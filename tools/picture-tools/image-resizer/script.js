// Image Resizer - loads the image, draws it on a canvas at the new size, downloads it.
var origImg=null, origW=0, origH=0;
function loadImageFile(file){ return new Promise(function(res, rej){ var img=new Image(); var url=URL.createObjectURL(file); img.onload=function(){ URL.revokeObjectURL(url); res(img); }; img.onerror=function(){ rej(new Error('Could not load this image.')); }; img.src=url; }); }
document.getElementById('imgFile').addEventListener('change', async function(e){
  var file=e.target.files[0]; if(!file) return;
  try{ origImg=await loadImageFile(file); origW=origImg.naturalWidth; origH=origImg.naturalHeight;
    document.getElementById('imgW').value=origW; document.getElementById('imgH').value=origH;
    document.getElementById('imgInfo').textContent='Original: '+origW+' x '+origH+' px, '+file.size+' bytes.';
    document.getElementById('imgErr').textContent='';
  }catch(err){ document.getElementById('imgErr').textContent=err.message; }
});
document.getElementById('imgW').addEventListener('input', function(){
  if(document.getElementById('keepRatio').checked && origW && origH){ document.getElementById('imgH').value=Math.max(1, Math.round(origH*Number(this.value||0)/origW)); }
});
document.getElementById('imgH').addEventListener('input', function(){
  if(document.getElementById('keepRatio').checked && origW && origH){ document.getElementById('imgW').value=Math.max(1, Math.round(origW*Number(this.value||0)/origH)); }
});
document.getElementById('resizeBtn').addEventListener('click', function(){
  if(!origImg){ document.getElementById('imgErr').textContent='Please choose an image first.'; return; }
  var w=Number(document.getElementById('imgW').value), h=Number(document.getElementById('imgH').value);
  if(!w || !h || w<1 || h<1){ document.getElementById('imgErr').textContent='Please enter a valid width and height.'; return; }
  var canvas=document.createElement('canvas'); canvas.width=w; canvas.height=h; canvas.getContext('2d').drawImage(origImg,0,0,w,h);
  var type=document.getElementById('imgFormat').value;
  canvas.toBlob(function(blob){
    if(!blob){ document.getElementById('imgErr').textContent='Conversion failed in this browser.'; return; }
    var url=URL.createObjectURL(blob); var prev=document.getElementById('imgPreview'); prev.src=url; prev.hidden=false;
    var a=document.createElement('a'); a.href=url; a.download='resized.'+(type.split('/')[1]||'png'); a.click();
    document.getElementById('imgErr').textContent='';
  }, type, 0.92);
});
