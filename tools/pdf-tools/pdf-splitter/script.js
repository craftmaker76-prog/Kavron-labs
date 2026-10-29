// PDF Splitter - uses pdf-lib (loaded from CDN on this page only). No files are uploaded.
function loadPdfLib(){
  return new Promise(function(res, rej){
    if(window.PDFLib){ res(window.PDFLib); return; }
    var s=document.createElement('script'); s.src='https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js';
    s.onload=function(){ window.PDFLib ? res(window.PDFLib) : rej(new Error('PDF library did not load.')); };
    s.onerror=function(){ rej(new Error('PDF library could not be loaded. Check your internet connection and try again.')); };
    document.head.appendChild(s);
  });
}
function parsePages(input, total){
  var out=[]; var parts=String(input||'').split(',').map(function(x){return x.trim();}).filter(Boolean);
  parts.forEach(function(p){
    if(p.indexOf('-')>=0){ var a=p.split('-'); var from=Number(a[0]), to=Number(a[1]);
      for(var i=from;i<=to;i++){ if(i>=1 && i<=total && out.indexOf(i-1)<0) out.push(i-1); } }
    else{ var n=Number(p); if(n>=1 && n<=total && out.indexOf(n-1)<0) out.push(n-1); }
  });
  return out.sort(function(a,b){return a-b;});
}
function downloadPdf(bytes, name){ var blob=new Blob([bytes], {type:'application/pdf'}); var url=URL.createObjectURL(blob); var a=document.createElement('a'); a.href=url; a.download=name; a.click(); }
var splitFile=null, splitDoc=null, splitTotal=0;
document.getElementById('sFile').addEventListener('change', async function(e){
  splitFile=e.target.files[0]; if(!splitFile) return;
  document.getElementById('sErr').textContent=''; document.getElementById('sStatus').textContent='Reading PDF...';
  try{ var lib=await loadPdfLib(); var bytes=await splitFile.arrayBuffer(); splitDoc=await lib.PDFDocument.load(bytes); splitTotal=splitDoc.getPageCount();
    document.getElementById('sInfo').textContent='Loaded: '+splitFile.name+' - '+splitTotal+' page(s).';
    document.getElementById('sStatus').textContent='';
  }catch(err){ document.getElementById('sErr').textContent='Could not read this PDF. Please check that it is a valid, unencrypted PDF.'; document.getElementById('sStatus').textContent=''; splitDoc=null; }
});
document.getElementById('splitBtn').addEventListener('click', async function(){
  if(!splitDoc){ document.getElementById('sErr').textContent='Please choose a valid PDF file first.'; return; }
  var mode=document.getElementById('sMode').value;
  document.getElementById('sErr').textContent=''; document.getElementById('sStatus').textContent='Working... please wait.';
  try{
    var lib=window.PDFLib;
    if(mode==='extract'){
      var pages=parsePages(document.getElementById('sPages').value, splitTotal);
      if(!pages.length){ document.getElementById('sErr').textContent='Please enter valid page numbers within 1-'+splitTotal+'.'; document.getElementById('sStatus').textContent=''; return; }
      var out=await lib.PDFDocument.create(); var copied=await out.copyPages(splitDoc, pages); copied.forEach(function(p){ out.addPage(p); });
      downloadPdf(await out.save(), 'extracted-pages.pdf'); document.getElementById('sStatus').textContent='Done. Extracted '+pages.length+' page(s) into extracted-pages.pdf.';
    } else {
      for(var i=0;i<splitTotal;i++){
        var single=await lib.PDFDocument.create(); var cp=await single.copyPages(splitDoc, [i]); cp.forEach(function(p){ single.addPage(p); });
        downloadPdf(await single.save(), 'page-'+(i+1)+'.pdf');
        await new Promise(function(r){ setTimeout(r, 300); });
      }
      document.getElementById('sStatus').textContent='Done. Split into '+splitTotal+' file(s). If your browser blocked some downloads, allow multiple downloads for this site and try again.';
    }
  }catch(err){ document.getElementById('sErr').textContent=err.message||'Split failed.'; document.getElementById('sStatus').textContent=''; }
});
