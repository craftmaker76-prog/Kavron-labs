// PDF Merger - uses pdf-lib (loaded from CDN on this page only). No files are uploaded.
function loadPdfLib(){
  return new Promise(function(res, rej){
    if(window.PDFLib){ res(window.PDFLib); return; }
    var s=document.createElement('script'); s.src='https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js';
    s.onload=function(){ window.PDFLib ? res(window.PDFLib) : rej(new Error('PDF library did not load.')); };
    s.onerror=function(){ rej(new Error('PDF library could not be loaded. Check your internet connection and try again.')); };
    document.head.appendChild(s);
  });
}
var mergeFiles=[];
document.getElementById('mFiles').addEventListener('change', async function(e){
  mergeFiles=Array.from(e.target.files||[]);
  if(!mergeFiles.length){ document.getElementById('mList').textContent='No files selected yet.'; return; }
  document.getElementById('mList').textContent=mergeFiles.map(function(f,i){ return (i+1)+'. '+f.name+' ('+f.size+' bytes)'; }).join('\n');
});
document.getElementById('mergeBtn').addEventListener('click', async function(){
  if(!mergeFiles.length){ document.getElementById('mErr').textContent='Please choose at least one PDF file.'; return; }
  document.getElementById('mErr').textContent=''; document.getElementById('mStatus').textContent='Merging... please wait.';
  try{
    var lib=await loadPdfLib();
    var merged=await lib.PDFDocument.create();
    for(var i=0;i<mergeFiles.length;i++){
      var bytes=await mergeFiles[i].arrayBuffer();
      var doc=await lib.PDFDocument.load(bytes);
      var pages=await merged.copyPages(doc, doc.getPageIndices());
      pages.forEach(function(p){ merged.addPage(p); });
    }
    var out=await merged.save();
    var blob=new Blob([out], {type:'application/pdf'});
    var url=URL.createObjectURL(blob); var a=document.createElement('a'); a.href=url; a.download='merged.pdf'; a.click();
    document.getElementById('mStatus').textContent='Done. Merged '+mergeFiles.length+' file(s) into merged.pdf.';
  }catch(err){ document.getElementById('mErr').textContent=err.message||'Merge failed. Please check that all files are valid PDFs.'; document.getElementById('mStatus').textContent=''; }
});
