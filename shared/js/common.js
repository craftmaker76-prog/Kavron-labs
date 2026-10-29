// Kavron Labs - shared header and footer, design v2.
// Header has only 3 links, so it never looks crowded. Footer has clear sections.
// Site settings saved in Admin > Settings are read from localStorage, if present.
(function(){
  function settings(){ try{ return JSON.parse(localStorage.getItem('kavronlabs_settings')||'{}'); }catch(e){ return {}; } }
  function esc(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  var s = settings();
  var brandName = s.siteName || 'Kavron Labs';
  var header = document.querySelector('header.site');
  if(header){
    var r = header.dataset.root || '';
    header.innerHTML = '<div class="nav"><a class="brand" href="'+r+'index.html">'+esc(brandName)+'</a>'
      + '<button class="menubtn" type="button" aria-label="Open menu">Menu</button>'
      + '<nav class="navlinks"><a href="'+r+'index.html">Home</a>'
      + '<a href="'+r+'index.html#tools">All Tools</a>'
      + '<a href="'+r+'admin/index.html">Admin Panel</a></nav></div>';
    var btn = header.querySelector('.menubtn');
    var nav = header.querySelector('.navlinks');
    if(btn && nav){
      btn.addEventListener('click', function(){ nav.classList.toggle('open'); btn.textContent = nav.classList.contains('open') ? 'Close' : 'Menu'; });
      nav.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', function(){ nav.classList.remove('open'); btn.textContent = 'Menu'; }); });
    }
  }
  var footer = document.querySelector('footer.site');
  if(footer){
    var fr = footer.dataset.root || '';
    footer.innerHTML = '<div class="footer-inner">'
      + '<div><h3>'+esc(brandName)+'</h3><p>Powerful Tools. One Simple Platform. Fast, mobile-friendly tools that run in your browser.</p></div>'
      + '<div><h3>Tools</h3><a href="'+fr+'index.html#tools">All Tools</a><a href="'+fr+'tools/picture-tools/image-compressor/index.html">Image Compressor</a><a href="'+fr+'tools/pdf-tools/pdf-merger/index.html">PDF Merger</a><a href="'+fr+'tools/text-tools/word-counter/index.html">Word Counter</a></div>'
      + '<div><h3>Admin</h3><a href="'+fr+'admin/index.html">Admin Dashboard</a><a href="'+fr+'admin/tools.html">Manage Tools</a><a href="'+fr+'admin/settings.html">Settings</a><a href="'+fr+'admin/logs.html">Logs</a><a href="#" id="cookieSettingsLink">Cookie Settings</a></div>'
      + '</div>'
      + '<div class="footer-bottom">\u00A9 2026 '+esc(brandName)+'. Image and PDF tools run in your browser. Your files are not uploaded to a server by this static site.</div>';
    var link = document.getElementById('cookieSettingsLink');
    if(link){ link.addEventListener('click', function(e){ e.preventDefault(); if(window.showCookieBanner){ window.showCookieBanner(); } }); }
  }
  var heroTitle = document.getElementById('heroTitle');
  if(heroTitle && s.siteName){ heroTitle.textContent = s.siteName; }
  var heroTag = document.getElementById('heroTagline');
  if(heroTag && s.tagline){ heroTag.textContent = s.tagline; }
})();
