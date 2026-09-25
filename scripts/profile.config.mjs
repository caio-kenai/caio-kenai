// Static profile content. Live numbers (stars, releases, languages, activity)
// come from the GitHub API at render time.

export default {
  login: 'caio-kenai',
  name: 'Caio Pacifico',
  role: 'Software Developer',
  tracks: ['Desktop', 'Web', 'Mobile'],
  location: 'Ipatinga, MG, Brazil',
  company: 'Playlist Software Solutions',

  terminal: [
    { cmd: 'whoami', out: 'caio-kenai, software developer', color: 'text' },
    { cmd: 'cat stack.txt', out: 'C++ · C# · TypeScript · Rust · Go · Python', color: 'cyan' },
    { cmd: 'ls ~/projects --featured', out: 'Audioslave  Audio-Watchdog  Troqito  Portfolio', color: 'purple' },
    { cmd: 'echo $FOCUS', out: 'audio tooling · offline-first apps · automation', color: 'green' },
  ],

  featured: [
    {
      repo: 'Audioslave',
      accent: '#fe6902',
      summary:
        'Single-executable Windows audio service on JUCE 9. Keeps every endpoint out of WASAPI exclusive mode, standardizes sample rate and bit depth, and ships a tray launcher, CLI and installer.',
      tech: ['C++20', 'JUCE', 'WASAPI', 'CMake'],
    },
    {
      repo: 'Audio-Watchdog',
      accent: '#7dcfff',
      summary:
        'Lightweight C++20 Win32 service with a tray companion that listens to Core Audio device notifications and keeps exclusive mode disabled, so broadcast apps never lose their device.',
      tech: ['C++20', 'Win32', 'Core Audio', 'CMake'],
    },
    {
      repo: 'Troqito',
      accent: '#9ece6a',
      summary:
        'Offline-first personal and household finance app: accounts, cards, installments, budgets and shared houses with split expenses. Local SQLite is the source of truth; money is integer cents.',
      tech: ['Expo', 'React Native', 'Drizzle', 'Supabase'],
    },
    {
      repo: 'Portfolio',
      accent: '#bb9af7',
      summary:
        'kenai.site: bilingual single-page portfolio with zero runtime dependencies. Native DOM, strict TypeScript and pure CSS, with no CDN, analytics or third-party requests.',
      tech: ['TypeScript', 'Vite', 'CSS'],
    },
  ],

  languages: { top: 7, exclude: [] },
};
