# Kavron Labs - Folder Structure

```
kavron-labs/
  index.html
  README.md
  .gitignore
  admin/
    index.html       - Admin dashboard (counts and quick links)
    tools.html       - Manage tools: ADD / REMOVE, add a new tool, download tools.json
    settings.html    - Site name and tagline (browser only)
    logs.html        - Admin action log (browser only)
    css/admin.css
    js/admin.js          - shared admin helpers (storage + log + download)
    js/tools-manager.js  - Tools page logic
    js/settings.js       - Settings page logic
  assets/
    images/  - logo.svg
    icons/
    fonts/   - system fonts are used, so no font files are required
  tools/
    picture-tools/
      image-resizer/     - index.html, style.css, script.js
      image-compressor/  - index.html, style.css, script.js
      image-converter/   - index.html, style.css, script.js
    pdf-tools/
      pdf-merger/        - index.html, style.css, script.js (pdf-lib from CDN)
      pdf-splitter/      - index.html, style.css, script.js (pdf-lib from CDN)
    text-tools/
      word-counter/          - index.html, style.css, script.js
      text-case-converter/   - index.html, style.css, script.js
  shared/
    css/global.css
    js/common.js         - header, footer, mobile menu, settings
    js/tool-registry.js  - master tool list + enabled/disabled handling
  data/
    tools.json           - master list of tools (the permanent registry)
  cookies/
    cookie-consent.js    - preference banner only, no tracking
    cookie-consent.css
  docs/
    folder-structure.md  - this file
    adding-new-tools.md  - how to add a tool tomorrow
```

## How to find a tool's files

Every tool lives in its own folder: `tools/<category>/<slug>/`.
Open that folder in VS Code to see and edit its three files.
If a tool does not appear on the site, check Admin > Tools first: it may be OFF.
If it appears but does not work, open its `script.js` - that is where its logic lives.
