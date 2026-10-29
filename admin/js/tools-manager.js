// Kavron Labs - Tools manager (Admin > Tools).
// Buttons per tool:
//   ADD / REMOVE - show or hide the tool on the site (does not delete files).
//   EDIT         - change the tool's name and description in this browser.
//   DELETE       - remove the tool from the site in this browser.
//                  Custom tools (added here) are removed completely.
//                  Built-in tools go to "Deleted tools" below, with a Restore button.
// To make an EDIT or DELETE permanent for everyone, click Download tools.json
// and replace data/tools.json in VS Code with the downloaded file.
function kavronEscapeHtml(s){
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function renderAdminTools(){
  kavronLoadTools().then(function(tools){
    var q = (document.getElementById('adminSearch').value||'').toLowerCase();
    var matches = function(t){ return !q || (t.name+' '+t.categoryLabel+' '+t.folder+' '+t.description).toLowerCase().indexOf(q)>=0; };
    var main = tools.filter(function(t){ return !t.deleted && matches(t); });
    var deleted = tools.filter(function(t){ return t.deleted && matches(t); });
    var visible = tools.filter(function(t){ return !t.deleted && t.enabled!==false; }).length;
    var hidden = tools.filter(function(t){ return !t.deleted && t.enabled===false; }).length;
    document.getElementById('adminCount').textContent = 'Total: '+tools.filter(function(t){return !t.deleted;}).length+' tools. Visible: '+visible+'. Hidden: '+hidden+'. Deleted: '+deleted.length+'.';
    document.getElementById('adminToolList').innerHTML = main.map(function(t){
      var on = t.enabled!==false;
      return '<div class="tool-row" data-row="'+t.id+'"><div><strong>'+kavronEscapeHtml(t.name)+'</strong> <span class="small">('+(on?'ON - visible':'OFF - hidden')+')</span><br>'
        + '<span class="small">Category: '+kavronEscapeHtml(t.categoryLabel)+' &middot; ID: '+kavronEscapeHtml(t.id)+'</span><br>'
        + '<span class="folder">'+kavronEscapeHtml(t.folder)+'/</span><br>'
        + '<span class="small">'+kavronEscapeHtml(t.description)+'</span>'
        + '<div class="edit-form" id="edit-'+t.id+'" style="display:none;margin-top:10px">'
        + '<label>Name <input type="text" class="edit-name" value="'+kavronEscapeHtml(t.name)+'"></label>'
        + '<label>Description <input type="text" class="edit-desc" value="'+kavronEscapeHtml(t.description)+'"></label>'
        + '<button type="button" class="success" data-save="'+t.id+'">Save</button> '
        + '<button type="button" class="secondary" data-cancel="'+t.id+'">Cancel</button></div></div>'
        + '<div class="tool-actions"><button type="button" class="'+(on?'danger':'success')+'" data-toggle="'+t.id+'" data-on="'+(on?'1':'0')+'">'+(on?'REMOVE':'ADD')+'</button> '
        + '<button type="button" class="secondary" data-edit="'+t.id+'">EDIT</button> '
        + '<button type="button" class="danger" data-delete="'+t.id+'">DELETE</button> '
        + '<a class="btn secondary" href="../'+t.page+'">Open tool</a></div></div>';
    }).join('') || '<p>No tools found.</p>';
    var delEl = document.getElementById('adminDeletedList');
    if(delEl){
      delEl.innerHTML = '<h2>Deleted tools</h2>'
        + (deleted.length ? deleted.map(function(t){
            return '<div class="tool-row deleted-row"><div><strong>'+kavronEscapeHtml(t.name)+'</strong><br><span class="small">ID: '+kavronEscapeHtml(t.id)+' &middot; '+kavronEscapeHtml(t.folder)+'/</span></div>'
              + '<div class="tool-actions"><button type="button" class="success" data-restore="'+t.id+'">Restore</button></div></div>';
          }).join('') : '<p class="small">No deleted tools. Deleted built-in tools appear here so you can restore them. Custom tools deleted here are removed completely and do not appear here.</p>');
    }
    document.querySelectorAll('[data-toggle]').forEach(function(b){
      b.addEventListener('click', function(){
        var id = b.getAttribute('data-toggle');
        kavronSetEnabled(id, b.getAttribute('data-on') !== '1');
        renderAdminTools();
      });
    });
    document.querySelectorAll('[data-edit]').forEach(function(b){
      b.addEventListener('click', function(){
        var form = document.getElementById('edit-' + b.getAttribute('data-edit'));
        if(form){ form.style.display = form.style.display === 'none' ? 'block' : 'none'; }
      });
    });
    document.querySelectorAll('[data-cancel]').forEach(function(b){
      b.addEventListener('click', function(){
        var form = document.getElementById('edit-' + b.getAttribute('data-cancel'));
        if(form){ form.style.display = 'none'; }
      });
    });
    document.querySelectorAll('[data-save]').forEach(function(b){
      b.addEventListener('click', function(){
        var id = b.getAttribute('data-save');
        var form = document.getElementById('edit-' + id);
        var name = form.querySelector('.edit-name').value.trim();
        var desc = form.querySelector('.edit-desc').value.trim();
        if(!name){ alert('Please enter a tool name.'); return; }
        kavronEditTool(id, name, desc);
        renderAdminTools();
      });
    });
    document.querySelectorAll('[data-delete]').forEach(function(b){
      b.addEventListener('click', function(){
        var id = b.getAttribute('data-delete');
        var isCustom = kavronIsCustom(id);
        var msg = isCustom
          ? 'Delete this tool completely? It was added in this browser, so it will be removed from the admin list too.'
          : 'Delete this tool from the site? It will go to "Deleted tools" below, where you can restore it. To make it permanent, Download tools.json and replace data/tools.json.';
        if(!confirm(msg)){ return; }
        kavronDeleteTool(id);
        renderAdminTools();
      });
    });
    document.querySelectorAll('[data-restore]').forEach(function(b){
      b.addEventListener('click', function(){
        kavronRestoreTool(b.getAttribute('data-restore'));
        renderAdminTools();
      });
    });
    // Clean list for Download tools.json: no deleted tools, edited names included.
    window._kavronAdminTools = tools.filter(function(t){ return !t.deleted; }).map(function(t){
      return {id:t.id, name:t.name, category:t.category, categoryLabel:t.categoryLabel, folder:t.folder, page:t.page, description:t.description, enabled: t.enabled!==false};
    });
  });
}
document.getElementById('adminSearch').addEventListener('input', renderAdminTools);
document.getElementById('downloadJsonBtn').addEventListener('click', function(){
  var tools = window._kavronAdminTools || [];
  kavronDownloadToolsJson(tools);
});
document.getElementById('addToolForm').addEventListener('submit', function(e){
  e.preventDefault();
  var fd = new FormData(e.target);
  var name = String(fd.get('name')||'').trim();
  var slug = String(fd.get('slug')||'').trim().toLowerCase().replace(/[^a-z0-9-]/g,'-');
  var category = String(fd.get('category')||'text-tools');
  var labels = {'picture-tools':'Picture Tools','pdf-tools':'PDF Tools','text-tools':'Text Tools','other-tools':'Other Tools'};
  if(!name || !slug){ document.getElementById('addToolMsg').textContent = 'Please enter both a name and a slug.'; return; }
  var tool = {id:slug, name:name, category:category, categoryLabel:labels[category]||'Other Tools', folder:'tools/'+category+'/'+slug, page:'tools/'+category+'/'+slug+'/index.html', description:String(fd.get('description')||'New tool.').trim(), enabled:true};
  try{
    var custom = JSON.parse(localStorage.getItem('kavronlabs_custom_tools')||'[]');
    if(custom.some(function(t){return t.id===slug;}) || (window._kavronAdminTools||[]).some(function(t){return t.id===slug;})){
      document.getElementById('addToolMsg').textContent = 'A tool with this slug already exists. Choose a different slug.'; return;
    }
    custom.push(tool); localStorage.setItem('kavronlabs_custom_tools', JSON.stringify(custom));
    kavronLog('ADD_TOOL', slug);
    document.getElementById('addToolMsg').textContent = 'Tool added in this browser: '+name+'. IMPORTANT: to make it permanent, first create the folder '+tool.folder+'/ in VS Code with index.html, style.css and script.js (see docs/adding-new-tools.md), then click Download tools.json and replace data/tools.json.';
    e.target.reset(); renderAdminTools();
  }catch(err){ document.getElementById('addToolMsg').textContent = 'Could not save the tool in this browser.'; }
});
renderAdminTools();
