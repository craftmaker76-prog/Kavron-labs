// Image Compressor - canvas quality compression. PNG is lossless, so for PNG the
// quality slider has no effect; JPG/WebP give real size savings for photos.
var cImg=null;
document.getElementById('quality').addEventListener('input', function(){ document.getElementById('qVal').textContent=this.value; });
document.getElementById('cFile').addEventListener('change', function(e){
  var file=e.target.files[0]; if(!file) return;
  var img=new Image(); var url=URL.createObjectURL(file);
  img.onload=function(){ URL.revokeObjectURL(url); cImg=img; document.getElementById('cInfo').textContent='Original: '+img.naturalWidth+' x '+img.naturalHeight+' px, '+file.size+' bytes.'; document.getElementById('cInfo').dataset.size=file.size; };
  img.onerror=function(){ document.getElementById('cErr').textContent='Could not load this image.'; };
  img.src=url;
});
document.getElementById('compressBtn').addEventListener('click', function(){
  if(!cImg){ document.getElementById('cErr').textContent='Please choose an image first.'; return; }
  var type=document.getElementById('cFormat').value; var q=Number(document.getElementById('quality').value)/100;
  var canvas=document.createElement('canvas'); canvas.width=cImg.naturalWidth; canvas.height=cImg.naturalHeight; canvas.getContext('2d').drawImage(cImg,0,0);
  canvas.toBlob(function(blob){
    if(!blob){ document.getElementById('cErr').textContent='Compression failed in this browser.'; return; }
    var orig=Number(document.getElementById('cInfo').dataset.size||0);
    var saved=orig ? Math.max(0, Math.round((1-blob.size/orig)*100)) : 0;
    document.getElementById('cResult').textContent='Compressed size: '+blob.size+' bytes'+(orig ? ' (saved about '+saved+'%)' : '')+'.';
    var url=URL.createObjectURL(blob); var prev=document.getElementById('cPreview'); prev.src=url; prev.hidden=false;
    var a=document.createElement('a'); a.href=url; a.download='compressed.'+(type.split('/')[1]||'jpg'); a.click();
    document.getElementById('cErr').textContent='';
  }, type, q);
});
