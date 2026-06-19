# xfstl.github.io

Personal GitHub Pages site for [xfstl](https://github.com/xfstl).

**Live site:** [https://xfstl.github.io](https://xfstl.github.io)

## Features

- Responsive personal portfolio layout
- Dark / light theme toggle (persists via localStorage)
- Auto-fetches public repositories from GitHub API
- Zero build step — pure static HTML, CSS, and JavaScript

## Structure

```
xfstl.github.io/
├── index.html          # Main page
├── assets/
│   ├── css/style.css   # Styles
│   └── js/main.js      # GitHub API integration & theme
└── README.md
```

## Local Preview

Serve the root directory with any static file server:

```bash
# Python
python3 -m http.server 8080

# Node.js (npx)
npx serve .
```

Then open [http://localhost:8080](http://localhost:8080).

## Deployment

Push to the `main` branch — GitHub Pages serves this repo automatically at `https://xfstl.github.io`.

No GitHub Actions or build configuration required.

## Customization

Edit `index.html` to update the hero text, about section, and tech stack. Repository cards are populated dynamically from the GitHub API in `assets/js/main.js`.
