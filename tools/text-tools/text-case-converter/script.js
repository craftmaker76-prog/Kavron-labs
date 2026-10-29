// Text Case Converter - pure browser logic, no server.
function convertCase(text, mode){
  if(mode==='upper') return text.toUpperCase();
  if(mode==='lower') return text.toLowerCase();
  if(mode==='title') return text.toLowerCase().replace(/\b\w/g, function(c){ return c.toUpperCase(); });
  if(mode==='sentence') return text.toLowerCase().replace(/(^|[.!?]\s+)([a-z])/g, function(m, p1, p2){ return p1 + p2.toUpperCase(); });
  if(mode==='camel'){ var w = text.trim().split(/[^a-zA-Z0-9]+/).filter(Boolean); return w.map(function(x,i){ var l=x.toLowerCase(); return i===0 ? l : l.charAt(0).toUpperCase()+l.slice(1); }).join(''); }
  if(mode==='snake') return text.trim().toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'');
  if(mode==='kebab') return text.trim().toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
  return text;
}
document.querySelectorAll('[data-case]').forEach(function(b){
  b.addEventListener('click', function(){ document.getElementById('ccOutput').value = convertCase(document.getElementById('ccInput').value, b.getAttribute('data-case')); });
});
document.getElementById('ccCopy').addEventListener('click', function(){ navigator.clipboard.writeText(document.getElementById('ccOutput').value); });
document.getElementById('ccClear').addEventListener('click', function(){ document.getElementById('ccInput').value=''; document.getElementById('ccOutput').value=''; });
