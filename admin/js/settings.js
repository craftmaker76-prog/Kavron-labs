// Kavron Labs - Settings (Admin > Settings). Saved in the browser only.
(function(){
  var form = document.getElementById('settingsForm');
  try{
    var s = JSON.parse(localStorage.getItem('kavronlabs_settings')||'{}');
    if(s.siteName) form.siteName.value = s.siteName;
    if(s.tagline) form.tagline.value = s.tagline;
  }catch(e){}
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var fd = new FormData(form);
    var s = {siteName:String(fd.get('siteName')||'Kavron Labs').trim(), tagline:String(fd.get('tagline')||'').trim()};
    try{ localStorage.setItem('kavronlabs_settings', JSON.stringify(s)); kavronLog('SETTINGS_SAVED', s.siteName); }catch(e){}
    document.getElementById('settingsMsg').textContent = 'Settings saved in this browser. Reload the homepage to see the new name and tagline.';
  });
})();
