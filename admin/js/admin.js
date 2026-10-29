// Kavron Labs - Admin helpers shared by all admin pages.
// Storage keys (browser only, see README for the permanent-file step):
//  kavronlabs_tool_overrides - {toolId: true/false} for ADD / REMOVE
//  kavronlabs_custom_tools   - tools added through Admin > Tools
//  kavronlabs_admin_log      - [{date, action, detail}] admin actions
//  kavronlabs_settings       - {siteName, tagline}
function kavronLog(action, detail){
  try{
    var log = JSON.parse(localStorage.getItem('kavronlabs_admin_log')||'[]');
    log.unshift({date:new Date().toISOString(), action:action, detail:detail||''});
    localStorage.setItem('kavronlabs_admin_log', JSON.stringify(log.slice(0,200)));
  }catch(e){}
}
function kavronSetEnabled(id, enabled){
  try{
    var over = JSON.parse(localStorage.getItem('kavronlabs_tool_overrides')||'{}');
    over[id] = enabled;
    localStorage.setItem('kavronlabs_tool_overrides', JSON.stringify(over));
    kavronLog(enabled ? 'ADD' : 'REMOVE', id);
  }catch(e){}
}
function kavronDownloadToolsJson(tools){
  var data = JSON.stringify({site:'Kavron Labs', version:'1.0', tools:tools}, null, 2);
  var blob = new Blob([data], {type:'application/json'});
  var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'tools.json'; a.click();
  setTimeout(function(){ URL.revokeObjectURL(a.href); }, 1000);
}
