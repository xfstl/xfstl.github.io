const USERNAME = 'xfstl';
const LANG_COLORS = {
  Swift: '#F05138',
  Objective-C: '#438EFF',
  JavaScript: '#F7DF1E',
  TypeScript: '#3178C6',
  Python: '#3572A5',
  HTML: '#E34C26',
  CSS: '#563D7C',
  Ruby: '#701516',
  Go: '#00ADD8',
  Rust: '#DEA584',
  default: '#8b9cb3',
};

function getLangColor(lang) {
  return LANG_COLORS[lang] || LANG_COLORS.default;
}

function initTheme() {
  const toggle = document.getElementById('themeToggle');
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
  } else if (!prefersDark) {
    document.documentElement.setAttribute('data-theme', 'light');
  }

  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
}

async function fetchUser() {
  const res = await fetch(`https://api.github.com/users/${USERNAME}`);
  if (!res.ok) return null;
  return res.json();
}

async function fetchRepos() {
  const res = await fetch(
    `https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=100`
  );
  if (!res.ok) return [];
  return res.json();
}

function renderProjects(repos) {
  const grid = document.getElementById('projectsGrid');
  const filtered = repos.filter((r) => r.name !== `${USERNAME}.github.io`);

  if (filtered.length === 0) {
    grid.innerHTML = '<p class="section-desc">No public repositories yet.</p>';
    return;
  }

  grid.innerHTML = filtered
    .map((repo) => {
      const desc = repo.description || 'No description provided.';
      const lang = repo.language || '';
      const stars = repo.stargazers_count;
      const langDot = lang
        ? `<span class="project-lang"><span class="lang-dot" style="background:${getLangColor(lang)}"></span>${lang}</span>`
        : '';

      return `
        <a href="${repo.html_url}" class="project-card" target="_blank" rel="noopener noreferrer">
          <div class="project-name">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 0 1 1-1h8zM5 12.25v3.25a.25.25 0 0 0 .4.2l1.45-1.087a.25.25 0 0 1 .3 0L8.6 15.7a.25.25 0 0 0 .4-.2v-3.25a.25.25 0 0 0-.25-.25h-3.5a.25.25 0 0 0-.25.25z"/>
            </svg>
            ${repo.name}
          </div>
          <p class="project-desc">${desc}</p>
          <div class="project-meta">
            ${langDot}
            ${stars > 0 ? `<span>★ ${stars}</span>` : ''}
          </div>
        </a>
      `;
    })
    .join('');
}

async function init() {
  document.getElementById('year').textContent = new Date().getFullYear();
  initTheme();

  try {
    const [user, repos] = await Promise.all([fetchUser(), fetchRepos()]);

    if (user) {
      document.getElementById('repoCount').textContent = user.public_repos;
      document.getElementById('followerCount').textContent = user.followers;
    }

    renderProjects(repos);
  } catch {
    document.getElementById('projectsGrid').innerHTML =
      '<p class="section-desc">Failed to load projects. Visit <a href="https://github.com/xfstl">GitHub</a> directly.</p>';
  }
}

init();
