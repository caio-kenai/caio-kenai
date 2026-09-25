// Collects everything the cards need in a single GraphQL round trip.

const ENDPOINT = 'https://api.github.com/graphql';

const REPO_FIELDS = `
  name
  url
  description
  stargazerCount
  forkCount
  pushedAt
  licenseInfo { spdxId }
  primaryLanguage { name color }
  latestRelease { tagName publishedAt }
`;

async function graphql(query, variables) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error('GITHUB_TOKEN is not set');

  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'caio-kenai-profile-renderer',
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await response.json();
  if (!response.ok || json.errors) {
    throw new Error(`GitHub GraphQL request failed: ${JSON.stringify(json.errors ?? json)}`);
  }
  return json.data;
}

export async function fetchProfile(login, featured) {
  // Aliased lookups keep the featured repositories in the same request.
  const featuredQuery = featured
    .map((name, i) => `f${i}: repository(owner: $login, name: ${JSON.stringify(name)}) { ${REPO_FIELDS} }`)
    .join('\n');

  const data = await graphql(
    `query ($login: String!) {
      user(login: $login) {
        name
        followers { totalCount }
        pullRequests { totalCount }
        issues { totalCount }
        repositories(ownerAffiliations: OWNER, privacy: PUBLIC, isFork: false, first: 100) {
          totalCount
          nodes {
            stargazerCount
            languages(first: 12, orderBy: { field: SIZE, direction: DESC }) {
              edges { size node { name color } }
            }
          }
        }
        contributionsCollection {
          totalCommitContributions
          restrictedContributionsCount
          totalPullRequestContributions
          totalPullRequestReviewContributions
          contributionCalendar {
            totalContributions
            weeks { contributionDays { date contributionCount } }
          }
        }
      }
      ${featuredQuery}
    }`,
    { login },
  );

  const { user } = data;
  const repos = user.repositories.nodes;

  const languageBytes = new Map();
  for (const repo of repos) {
    for (const { size, node } of repo.languages.edges) {
      const entry = languageBytes.get(node.name) ?? { name: node.name, color: node.color, size: 0 };
      entry.size += size;
      languageBytes.set(node.name, entry);
    }
  }

  const collection = user.contributionsCollection;
  const days = collection.contributionCalendar.weeks.flatMap((w) => w.contributionDays);

  return {
    login,
    name: user.name,
    followers: user.followers.totalCount,
    pullRequests: user.pullRequests.totalCount,
    issues: user.issues.totalCount,
    publicRepos: user.repositories.totalCount,
    stars: repos.reduce((sum, r) => sum + r.stargazerCount, 0),
    commitsLastYear: collection.totalCommitContributions + collection.restrictedContributionsCount,
    reviewsLastYear: collection.totalPullRequestReviewContributions,
    contributionsLastYear: collection.contributionCalendar.totalContributions,
    weeks: collection.contributionCalendar.weeks.map((w) =>
      w.contributionDays.reduce((sum, d) => sum + d.contributionCount, 0),
    ),
    weekStarts: collection.contributionCalendar.weeks.map((w) => w.contributionDays[0].date),
    days,
    languages: [...languageBytes.values()].sort((a, b) => b.size - a.size),
    featured: Object.fromEntries(featured.map((name, i) => [name, data[`f${i}`]])),
    generatedAt: new Date(),
  };
}

// Current streak tolerates an empty "today" because the day is not over yet.
export function streaks(days) {
  let longest = 0;
  let run = 0;
  for (const day of days) {
    run = day.contributionCount > 0 ? run + 1 : 0;
    longest = Math.max(longest, run);
  }

  let current = 0;
  let i = days.length - 1;
  if (i >= 0 && days[i].contributionCount === 0) i -= 1;
  for (; i >= 0 && days[i].contributionCount > 0; i -= 1) current += 1;

  const best = days.reduce((a, b) => (b.contributionCount > a.contributionCount ? b : a), days[0]);
  return { current, longest, best };
}
