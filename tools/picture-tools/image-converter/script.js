// Image Converter - canvas format conversion, in the browser only.
var vImg=null;
document.getElementById('vFile').addEventListener('change', function(e){
  var file=e.target.files[0]; if(!file) return;
  var img=new Image(); var url=URL.createObjectURL(file);
  img.onload=function(){ URL.revokeObjectURL(url); vImg=img; document.getElementById('vInfo').textContent='Loaded: '+img.naturalWidth+' x '+img.naturalHeight+' px, '+file.size+' bytes.'; };
  img.onerror=function(){ document.getElementById('vErr').textContent='Could not load this image.'; };
  img.src=url;
});
document.getElementById('convertBtn').addEventListener('click', function(){
  if(!vImg){ document.getElementById('vErr').textContent='Please choose an image first.'; return; }
  var type=document.getElementById('vFormat').value;
  var canvas=document.createElement('canvas'); canvas.width=vImg.naturalWidth; canvas.height=vImg.naturalHeight; canvas.getContext('2d').drawImage(vImg,0,0);
  canvas.toBlob(function(blob){
    if(!blob){ document.getElementById('vErr').textContent='Conversion failed in this browser.'; return; }
    var url=URL.createObjectURL(blob); var prev=document.getElementById('vPreview'); prev.src=url; prev.hidden=false;
    var a=document.createElement('a'); a.href=url; a.download='converted.'+(type.split('/')[1]||'png'); a.click();
    document.getElementById('vErr').textContent='';
  }, type, 0.92);
});
