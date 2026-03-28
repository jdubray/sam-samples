
////////////////////////////////////////////////////////////////////////////////
// View
//

function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

var view = {} ;

// Initial State
view.init = function(model) {
    return view.ready(model) ;
} ;

view.intents = { edit: 'edit', save: 'save', delete: 'delete', cancel: 'cancel' } ;

// State representation of the ready state
view.ready = function(model,intents) { 
    model.lastEdited = model.lastEdited || {} ;
    intents = intents || view.intents ;
    var titleValue = model.lastEdited.title || 'Title' ;
    var descriptionValue = model.lastEdited.description || 'Description' ;
    var id = model.lastEdited.id || '' ;
    var cancelButton = '<button id="cancel" onclick="JavaScript:return actions.'+intents['cancel']+'({});\">Cancel</button>\n' ;
    var valAttr = "value" ;
    var actionLabel = "Save" ;
    var idElement = ', \'id\':\''+id+'\'' ;
    if (id.length === 0) { cancelButton = '' ; valAttr = "placeholder"; idElement = "" ; actionLabel = "Add"}
    var output = (
    '         <br><br>\n<div class="blog-post">\n'
               +model.posts.map(function(e){
                   return(
                        '<br><br><h3 class="blog-post-title"'
                       +' data-id="'+escapeHtml(e.id)+'"'
                       +' data-title="'+escapeHtml(e.title)+'"'
                       +' data-desc="'+escapeHtml(e.description)+'"'
                       +' onclick="return actions.'+intents['edit']+'({title:this.dataset.title,description:this.dataset.desc,id:this.dataset.id});">'
                       +escapeHtml(e.title)+'</h3>\n'
                       +'<p class="blog-post-meta">'+escapeHtml(e.description)+'</p>'
                       +'<button data-id="'+escapeHtml(e.id)+'" onclick="return actions.delete({id:this.dataset.id});">Delete</button>') ;
                   }).join('\n')+'\n'+
   '          </div>\n'+
   '          <br><br>\n'+
   '          <div class="mdl-cell mdl-cell--6-col">\n'+
   '                      <input id="title" type="text" class="form-control" '+valAttr+'="'+escapeHtml(titleValue)+'"><br>\n'+
   '                      <input id="description" type="textarea" class="form-control" '+valAttr+'="'+escapeHtml(descriptionValue)+'"><br>\n'+
   '                      <button id="save" onclick="JavaScript:return actions.'+intents['save']+'({\'title\':document.getElementById(\'title\').value, \'description\': document.getElementById(\'description\').value'+idElement+'});">'+actionLabel+'</button>\n'+
               cancelButton+'\n'+
    '          </div><br><br>\n'
        ) ;
    return output ;
} ;


//display the state representation
view.display = function(representation,next) {
    if (next) {
        next(representation) ;
    } else {
        var stateRepresentation = document.getElementById("representation");
        stateRepresentation.innerHTML = representation;
    }
} ;

module.exports = view ;
