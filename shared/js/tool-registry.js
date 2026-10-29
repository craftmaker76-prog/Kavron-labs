// Kavron Labs - tool registry.
// HOW IT WORKS (read this before editing):
// 1. The master list lives in data/tools.json AND is embedded below as a fallback.
//    The embedded copy lets the homepage work even when opened directly as a file
//    (file://), where browsers block fetch() for local JSON files.
// 2. When the site is served over http (for example VS Code Live Server),
//    this script tries to fetch data/tools.json first and uses it if it loads.
// 3. Admin Panel changes (enable/disable, and tools added in Admin) are stored
//    in the browser (localStorage) so they work immediately without a server.
//    To make a change permanent for everyone, use Admin > Tools > Download tools.json
//    and replace data/tools.json in VS Code with the downloaded file.
var KAVRON_EMBEDDED_TOOLS = [
  {
    "id": "image-resizer",
    "name": "Image Resizer",
    "category": "picture-tools",
    "categoryLabel": "Picture Tools",
    "folder": "tools/picture-tools/image-resizer",
    "page": "tools/picture-tools/image-resizer/index.html",
    "description": "Resize an image in your browser, keep the aspect ratio, and download it.",
    "enabled": true
  },
  {
    "id": "image-compressor",
    "name": "Image Compressor",
    "category": "picture-tools",
    "categoryLabel": "Picture Tools",
    "folder": "tools/picture-tools/image-compressor",
    "page": "tools/picture-tools/image-compressor/index.html",
    "description": "Compress an image in your browser with a quality slider and see the size saved.",
    "enabled": true
  },
  {
    "id": "image-converter",
    "name": "Image Converter",
    "category": "picture-tools",
    "categoryLabel": "Picture Tools",
    "folder": "tools/picture-tools/image-converter",
    "page": "tools/picture-tools/image-converter/index.html",
    "description": "Convert an image between PNG, JPG and WebP in your browser. No upload.",
    "enabled": true
  },
  {
    "id": "pdf-merger",
    "name": "PDF Merger",
    "category": "pdf-tools",
    "categoryLabel": "PDF Tools",
    "folder": "tools/pdf-tools/pdf-merger",
    "page": "tools/pdf-tools/pdf-merger/index.html",
    "description": "Merge multiple PDF files into one PDF, in the order you choose.",
    "enabled": true
  },
  {
    "id": "pdf-splitter",
    "name": "PDF Splitter",
    "category": "pdf-tools",
    "categoryLabel": "PDF Tools",
    "folder": "tools/pdf-tools/pdf-splitter",
    "page": "tools/pdf-tools/pdf-splitter/index.html",
    "description": "Extract pages from a PDF, or split a PDF into one file per page.",
    "enabled": true
  },
  {
    "id": "word-counter",
    "name": "Word Counter",
    "category": "text-tools",
    "categoryLabel": "Text Tools",
    "folder": "tools/text-tools/word-counter",
    "page": "tools/text-tools/word-counter/index.html",
    "description": "Count words, characters, sentences, paragraphs and reading time.",
    "enabled": true
  },
  {
    "id": "text-case-converter",
    "name": "Text Case Converter",
    "category": "text-tools",
    "categoryLabel": "Text Tools",
    "folder": "tools/text-tools/text-case-converter",
    "page": "tools/text-tools/text-case-converter/index.html",
    "description": "Convert text to UPPER, lower, Title, Sentence, camelCase, snake_case or kebab-case.",
    "enabled": true
  }
];
function kavronGetOverrides(){
  try{ return JSON.parse(localStorage.getItem('kavronlabs_tool_overrides')||'{}'); }catch(e){ return {}; }
}
function kavronGetCustomTools(){
  try{ return JSON.parse(localStorage.getItem('kavronlabs_custom_tools')||'[]'); }catch(e){ return []; }
}
function kavronGetEdits(){
  try{ return JSON.parse(localStorage.getItem('kavronlabs_tool_edits')||'{}'); }catch(e){ return {}; }
}
function kavronGetDeleted(){
  try{ return JSON.parse(localStorage.getItem('kavronlabs_deleted_tools')||'[]'); }catch(e){ return []; }
}
function kavronIsCustom(id){
  return kavronGetCustomTools().some(function(t){ return t.id === id; });
}
// EDIT: change a tool's name and description in this browser.
// Saved in localStorage. Download tools.json + replace data/tools.json to make it permanent.
function kavronEditTool(id, name, description){
  try{
    var edits = kavronGetEdits();
    edits[id] = {name: String(name||'').trim(), description: String(description||'').trim()};
    localStorage.setItem('kavronlabs_tool_edits', JSON.stringify(edits));
    if(typeof kavronLog === 'function'){ kavronLog('EDIT_TOOL', id); }
    return true;
  }catch(e){ return false; }
}
// DELETE: custom tools are removed completely (they were only in this browser).
// Built-in tools are marked deleted: they vanish from the homepage and from the
// main admin list, and appear in Admin > Tools > Deleted tools with a Restore button.
// Download tools.json + replace data/tools.json to make a built-in deletion permanent.
function kavronDeleteTool(id){
  try{
    if(kavronIsCustom(id)){
      var custom = kavronGetCustomTools().filter(function(t){ return t.id !== id; });
      localStorage.setItem('kavronlabs_custom_tools', JSON.stringify(custom));
    } else {
      var deleted = kavronGetDeleted();
      if(deleted.indexOf(id) === -1){ deleted.push(id); localStorage.setItem('kavronlabs_deleted_tools', JSON.stringify(deleted)); }
    }
    var over = kavronGetOverrides(); delete over[id]; localStorage.setItem('kavronlabs_tool_overrides', JSON.stringify(over));
    var edits = kavronGetEdits(); delete edits[id]; localStorage.setItem('kavronlabs_tool_edits', JSON.stringify(edits));
    if(typeof kavronLog === 'function'){ kavronLog('DELETE_TOOL', id); }
    return true;
  }catch(e){ return false; }
}
function kavronRestoreTool(id){
  try{
    var deleted = kavronGetDeleted().filter(function(x){ return x !== id; });
    localStorage.setItem('kavronlabs_deleted_tools', JSON.stringify(deleted));
    var over = kavronGetOverrides(); over[id] = true; localStorage.setItem('kavronlabs_tool_overrides', JSON.stringify(over));
    if(typeof kavronLog === 'function'){ kavronLog('RESTORE_TOOL', id); }
    return true;
  }catch(e){ return false; }
}
function kavronApplyOverrides(list){
  var over = kavronGetOverrides();
  var edits = kavronGetEdits();
  var deleted = kavronGetDeleted();
  return list.map(function(t){
    var copy = Object.assign({}, t);
    if(Object.prototype.hasOwnProperty.call(over, t.id)){ copy.enabled = over[t.id]; }
    if(edits[t.id]){
      if(edits[t.id].name){ copy.name = edits[t.id].name; }
      if(edits[t.id].description){ copy.description = edits[t.id].description; }
    }
    copy.deleted = deleted.indexOf(t.id) !== -1;
    return copy;
  });
}
async function kavronLoadTools(){
  var base = KAVRON_EMBEDDED_TOOLS.slice();
  var paths = ['data/tools.json','../data/tools.json','../../data/tools.json','../../../data/tools.json'];
  for(var i=0;i<paths.length;i++){
    try{
      var r = await fetch(paths[i]);
      if(r.ok){ var j = await r.json(); if(j && Array.isArray(j.tools) && j.tools.length){ base = j.tools; break; } }
    }catch(e){ /* file:// or wrong depth: use the embedded copy */ }
  }
  var all = kavronApplyOverrides(base.concat(kavronGetCustomTools()));
  return all;
}
function kavronRenderToolCards(containerId){
  var el = document.getElementById(containerId);
  if(!el) return;
  kavronLoadTools().then(function(tools){
    var visible = tools.filter(function(t){ return t.enabled !== false && !t.deleted; });
    var root = el.dataset.root || '';
    if(!visible.length){ el.innerHTML = '<p>No tools are enabled. Open the <a href="'+root+'admin/tools.html">Admin Panel</a> and click ADD on a tool.</p>'; return; }
    el.innerHTML = visible.map(function(t){
      return '<a class="card" href="'+root+t.page+'"><span class="badge">'+t.categoryLabel+'</span><h3>'+t.name+'</h3><p>'+t.description+'</p></a>';
    }).join('');
    var count = document.getElementById('toolCount');
    if(count){ count.textContent = visible.length + ' tool(s) available'; }
  });
}
