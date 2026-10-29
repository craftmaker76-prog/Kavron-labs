# Kavron Labs

A fast, mobile-friendly, static tools website. No server, no database, no build step required.

## What is inside

- `index.html` - homepage with all enabled tools
- `admin/` - Admin Panel: dashboard, tools manager, settings, logs
- `tools/` - one folder per tool, each with `index.html`, `style.css`, `script.js`
- `shared/` - shared styles and the tool registry
- `data/tools.json` - master list of tools
- `cookies/` - cookie consent banner (preference only, no tracking)
- `docs/` - folder structure and how to add a new tool

## How to open it in VS Code

1. Open VS Code.
2. File > Open Folder, then select the `kavron-labs` folder.
3. To preview: open `index.html` in a browser, or better, use Live Server (right-click `index.html` > Open with Live Server) so `data/tools.json` loads over http. Opening the file directly also works, because the tool list is embedded as a fallback.

## Tools included (all working, no fake results)

- Picture Tools: Image Resizer, Image Compressor, Image Converter
- PDF Tools: PDF Merger, PDF Splitter (uses pdf-lib from a CDN, loaded only on PDF pages)
- Text Tools: Word Counter, Text Case Converter

Image and text tools work fully offline in the browser. PDF tools need an internet connection for the pdf-lib library; if it cannot load, they show a clear error instead of a fake result.

## Admin Panel

Open `admin/index.html`, or click Admin Panel in the site header.

- **Tools page:** ADD (show) or REMOVE (hide) any tool. REMOVE does not delete files.
- **Add a new tool:** create its folder under `tools/<category>/<slug>/` in VS Code with `index.html`, `style.css`, `script.js`, then add it on Admin > Tools. To make it permanent for everyone, click Download tools.json on that page and replace `data/tools.json` with the downloaded file.
- **Settings and Logs:** settings are saved in the browser; the log records every admin add/remove action in the browser.

Admin changes are stored in the browser (localStorage) so they work immediately without a server. That is an honest limit of a static site: a visitor on another computer will see the tools from `data/tools.json`, not your browser-only changes, until you replace that file.

## Adding a new tool tomorrow

See `docs/adding-new-tools.md` for the full step-by-step guide and a starter template.
