# CheezCut Static Website

A fully static HTML/CSS/JS starter website for `cheezcut.com`.

## Project structure

```bash
cheezcut-site/
├── 404.html
├── index.html
├── README.md
├── render.yaml
├── robots.txt
├── sitemap.xml
└── static/
    ├── css/
    │   └── style.css
    ├── fonts/
    ├── images/
    │   ├── favicon.svg
    │   ├── hero-visual.svg
    │   ├── logo.svg
    │   └── og-image.svg
    └── js/
        └── main.js
```

## Deploy on Render

1. Create a new GitHub repository.
2. Upload all files from this folder.
3. Go to Render and create a **Static Site**.
4. Connect your GitHub repository.
5. Keep the publish path as the project root (`.`).
6. If Render detects `render.yaml`, the static configuration is applied automatically.
7. Add your custom domain `cheezcut.com` in Render dashboard.

## Before going live

- Replace placeholder contact details in `index.html`
- Replace SVG placeholder images in `static/images/`
- Update metadata and social preview text
- Update `sitemap.xml` if you add more pages

## Notes

- No build step required
- No framework required
- Lightweight and fast
