// Static profile content. Live numbers (stars, releases, languages, activity)
// come from the GitHub API at render time.

export default {
  login: 'caio-kenai',
  name: 'Caio Pacifico',
  greeting: 'Olá, eu sou o',
  roles: ['Desenvolvedor Full Stack', 'Apaixonado por frontend', 'TypeScript de coração'],
  location: 'Ipatinga, MG',
  company: 'Playlist Software Solutions',
  site: 'kenai.site',

  // Icons orbiting the header illustration.
  heroIcons: ['ts', 'nextjs', 'nestjs', 'nodejs', 'react', 'tailwind'],

  about: [
    {
      title: 'Minha praia',
      text: ['TypeScript de ponta a ponta:', 'Next.js no front, NestJS e', 'Node.js no back.'],
      icons: ['ts', 'nextjs', 'nestjs', 'nodejs'],
      accent: 'blue',
    },
    {
      title: 'Bagagem',
      text: ['Muita estrada com C#, Python', 'e Go em projetos reais,', 'do desktop à API.'],
      icons: ['cs', 'py', 'go'],
      accent: 'purple',
    },
    {
      title: 'Explorando',
      text: ['Aprendendo a gostar de baixo', 'nível, estudando e trabalhando', 'com C, C++ e Rust.'],
      icons: ['c', 'cpp', 'rust'],
      accent: 'orange',
    },
  ],

  stack: {
    linguagens: ['ts', 'js', 'c', 'cpp', 'cs', 'py', 'go', 'rust', 'dart'],
    frontend: ['nextjs', 'react', 'vue', 'angular', 'vite', 'tailwind', 'html', 'css'],
    backend: ['nodejs', 'nestjs', 'express', 'dotnet', 'fastapi', 'flask'],
    mobile: ['expo', 'flutter', 'electron', 'tauri', 'wails', 'juce', 'androidstudio'],
    dados: ['postgres', 'mysql', 'mariadb', 'sqlite', 'mongodb', 'redis', 'supabase', 'drizzle'],
    infra: ['docker', 'linux', 'windows', 'railway', 'githubactions', 'cmake', 'git', 'github', 'powershell', 'bash'],
  },

  featured: [
    {
      repo: 'Audioslave',
      logo: 'assets/logos/audioslave.png',
      accent: '#fe6902',
      summary: 'Deixa o áudio do Windows sempre no formato certo e livre do modo exclusivo, direto da bandeja.',
      icons: ['cpp', 'windows', 'cmake'],
    },
    {
      repo: 'Audio-Watchdog',
      logo: 'assets/logos/audio-watchdog.png',
      accent: '#3b82f6',
      summary: 'Um cão de guarda leve para os dispositivos de áudio, para que nenhum app perca o som.',
      icons: ['cpp', 'windows'],
    },
    {
      repo: 'Troqito',
      logo: 'assets/logos/troqito.png',
      accent: '#22c55e',
      summary: 'Finanças pessoais e da casa num app só, com contas divididas e funcionando até offline.',
      icons: ['ts', 'expo', 'sqlite', 'supabase'],
    },
    {
      repo: 'Portfolio',
      logo: 'assets/logos/portfolio.svg',
      accent: '#22d3c5',
      summary: 'Meu portfólio em kenai.site: bilíngue, tema claro e escuro, feito sem framework.',
      icons: ['ts', 'vite', 'css'],
    },
  ],

  languages: { top: 7, exclude: [] },
};
