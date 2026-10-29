# Adding a New Tool Tomorrow

This is the full, honest workflow for a static site. A static site cannot write
files to your computer by itself, so adding a tool has two parts: (1) create
the folder and files in VS Code, (2) register the tool in the Admin Panel.

## Step 1 - Create the folder in VS Code

Decide the category and slug first. Examples:
- Picture tool: `tools/picture-tools/my-new-tool/`
- PDF tool: `tools/pdf-tools/my-new-tool/`
- Text tool: `tools/text-tools/my-new-tool/`

Inside that folder, create three files: `index.html`, `style.css`, `script.js`.

## Step 2 - Copy this starter template

### index.html (adjust the title, description and form fields for your tool)

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>My New Tool - Kavron Labs</title>
<link rel="stylesheet" href="../../../shared/css/global.css">
<link rel="stylesheet" href="style.css">
<link rel="stylesheet" href="../../../cookies/cookie-consent.css">
</head>
<body>
<header class="site" data-root="../../../"></header>
<main>
<nav class="small"><a href="../../../index.html">Home</a> &rsaquo; My New Tool</nav>
<h1>My New Tool</h1>
<p>One sentence about what this tool does.</p>
<div class="toolbox">
<label>Your input <textarea id="toolInput"></textarea></label>
<button type="button" id="runBtn">Run</button>
<div class="result" id="toolResult">Result will appear here.</div>
</div>
</main>
<footer class="site" data-root="../../../"></footer>
<script src="../../../shared/js/common.js"></script>
<script src="../../../shared/js/tool-registry.js"></script>
<script src="../../../cookies/cookie-consent.js"></script>
<script src="script.js"></script>
</body>
</html>
```

### style.css

```css
/* Tool page styles - extends shared/css/global.css. */
```

### script.js

```js
// My New Tool - put the tool logic here, in the browser only.
document.getElementById('runBtn').addEventListener('click', function(){
  var input = document.getElementById('toolInput').value;
  document.getElementById('toolResult').textContent = input;
});
```

## Step 3 - Register the tool in the Admin Panel

1. Open the site, then Admin Panel > Tools.
2. Fill in the Add a new tool form: name, slug (exactly the folder name you created),
   category, and a one-sentence description.
3. Click Add tool. The tool will appear on the homepage immediately in this browser.

## Step 4 - Make it permanent for everyone

Admin changes are stored in the browser only. To make the new tool visible to
every visitor:

1. On Admin > Tools, click Download tools.json.
2. In VS Code, replace `data/tools.json` with the downloaded file.
3. Reload the homepage and check that the new tool card opens your tool page.

## Step 5 - Test before you publish

- Open the tool page directly and try a real input.
- Try it on a phone-width browser window (mobile-friendly check).
- If the tool needs a library (like pdf-lib for PDFs), load it only on that
  tool's page, and show a clear error if it cannot load - never a fake result.
