// Kavron Labs - cookie consent banner.
// This static site has no server and no tracking. The banner only records
// your own preference, in a cookie and in localStorage, so it is not shown again.
(function(){
  function getConsent(){
    try{ if(localStorage.getItem('kavronlabs_cookie_consent')) return localStorage.getItem('kavronlabs_cookie_consent'); }catch(e){}
    var m = document.cookie.match(/(?:^|;)\s*kavron_consent=([^;]+)/);
    return m ? decodeURIComponent(m[1]) : null;
  }
  function setConsent(value){
    try{ localStorage.setItem('kavronlabs_cookie_consent', value); }catch(e){}
    document.cookie = 'kavron_consent=' + encodeURIComponent(value) + '; max-age=' + (365*24*60*60) + '; path=/; SameSite=Lax';
    var b = document.getElementById('cookieBanner'); if(b) b.remove();
  }
  window.showCookieBanner = function(){
    if(document.getElementById('cookieBanner')) return;
    var div = document.createElement('div');
    div.id = 'cookieBanner'; div.className = 'cookie-banner';
    div.innerHTML = '<p><strong>Cookie preference</strong> - Kavron Labs uses only a preference cookie to remember this choice. No tracking, no advertising cookies.</p>'
      + '<div><button type="button" id="cookieAccept">Accept</button> <button type="button" id="cookieReject" class="secondary">Reject</button></div>';
    document.body.appendChild(div);
    document.getElementById('cookieAccept').addEventListener('click', function(){ setConsent('accepted'); });
    document.getElementById('cookieReject').addEventListener('click', function(){ setConsent('declined'); });
  };
  if(!getConsent()){ window.showCookieBanner(); }
})();
