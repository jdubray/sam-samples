///////////////////////////////////////////////////////////////////////////////
// This is free and unencumbered software released into the public domain.
//
// Anyone is free to copy, modify, publish, use, compile, sell, or
// distribute this software, either in source code form or as a compiled
// binary, for any purpose, commercial or non-commercial, and by any
// means.
//
// In jurisdictions that recognize copyright laws, the author or authors
// of this software dedicate any and all copyright interest in the
// software to the public domain. We make this dedication for the benefit
// of the public at large and to the detriment of our heirs and
// successors. We intend this dedication to be an overt act of
// relinquishment in perpetuity of all present and future rights to this
// software under copyright law.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
// OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
// ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
// OTHER DEALINGS IN THE SOFTWARE.
//
// For more information, please refer to <http://unlicense.org/>



////////////////////////////////////////////////////////////////////////////////
// Model 
//
const COUNTER_MAX = 10 ;

var model = {
              posts: [
                {
                  id: 1,
                  title: "The SAM Pattern",
                  description: "SAM is a new reactive/functional pattern that simplifies Front-End architectures by clearly separating the business logic from the view and, in particular, strictly decoupling back-end APIs from the Front-End. SAM is technology independent and as such can be used to build Web Apps or Native Apps"
                },
                {
                  id: 2,
                  title: "Why I no longer use MVC Frameworks",
                  description: "The worst part of my job these days is designing APIs for front-end developers. "
                }
              ],
              itemId : 3 
            } ;

model.present = function(data,next) {
    data = data || {} ;
    
    if (data.deletedItemId !== undefined) {
        var d = -1 ;
        model.posts.forEach(function(el,index) {
            if (el.id !== undefined) {
                if (el.id == data.deletedItemId) {
                    d = index ;       
                }
            }
        });
        if (d>=0) {
            model.lastDeleted = model.posts.splice(d,1)[0] ;
        }
    }
    
    if (data.lastEdited !== undefined) {
        model.lastEdited = data.lastEdited ;
    } else {
        delete model.lastEdited ;
    } 
    
    if (data.item !== undefined) {
        if (data.item.id !== null) {
            // has been edited
            model.posts.forEach(function(el,index) {
                if (el.id !== undefined) {
                    if (el.id == data.item.id) {
                        model.posts[index] = data.item ;       
                    }
                }
            });
            
        } else {
            // new item
            data.item.id = model.itemId++ ;
            model.posts.push(data.item) ;
        }
    }
    
    state.render(model,next) ;
}


////////////////////////////////////////////////////////////////////////////////
// View
//
var view = {} ;

// Initial State
view.init = function(model) {
    return view.ready(model) ;
} ;

// State representation of the ready state
view.ready = function(model) { 
    model.lastEdited = model.lastEdited || {} ;
    var titleValue = model.lastEdited.title || 'Title' ;
    var descriptionValue = model.lastEdited.description || 'Description' ;
    var id = model.lastEdited.id || '' ;
    var cancelButton = '<button id="cancel" onclick="JavaScript:return actions.cancel({});\">Cancel</button>\n' ;
    var valAttr = "value" ;
    var actionLabel = "Save" ;
    var idElement = ', \'id\':\''+id+'\'' ;
    if (id.length === 0) { cancelButton = '' ; valAttr = "placeholder"; idElement = "" ; actionLabel = "Add"}
    var output = (
            '<br><br><div class="blog-post">\n\
               '+model.posts.map(function(e){
                   return(
                        '<br><br><h3 class="blog-post-title" onclick="JavaScript:return actions.edit({\'title\':\''+e.title+'\', \'description\':\''+e.description+'\', \'id\':\''+e.id+'\'});">'+e.title+'</h3>\n'
                       +'<p class="blog-post-meta">'+e.description+'</p>'
                       +'<button onclick="JavaScript:return actions.delete({\'id\':\''+e.id+'\'});">Delete</button>') ;
                   }).join('\n')+'\n\
             </div>\n\
             <br><br>\n\
             <div class="mdl-cell mdl-cell--6-col">\n\
               <input id="title" type="text" class="form-control"  '+valAttr+'="'+titleValue+'"><br>\n\
               <input id="description" type="textarea" class="form-control" '+valAttr+'="'+descriptionValue+'"><br>\n\
               <button id="save" onclick="JavaScript:return actions.save({\'title\':document.getElementById(\'title\').value, \'description\': document.getElementById(\'description\').value'+idElement+'});">'+actionLabel+'</button>\n\
               '+cancelButton+'\n\
             </div><br><br>\n'
        ) ;
    return output ;
} ;


//display the state representation
view.display = function(representation,next) {
    var stateRepresentation = document.getElementById("representation");
    stateRepresentation.innerHTML = representation;

    // next(representation) ;
} ;



////////////////////////////////////////////////////////////////////////////////
// State
//
var state =  { view: view} ;

model.state = state ;

// Derive the state representation as a function of the systen
// control state
state.representation = function(model,next,restore) {
    restore = restore || false ;
    var representation = 'oops... something went wrong, the system is in an invalid state' ;

    if (state.ready(model)) {
        representation = state.view.ready(model) ;
    } 
    
    if ((state.saveSnapshot) && (!restore)) {
        state.saveSnapshot(model) ;
    } 
    state.view.display(state.displayTimeTravelControls(representation),next) ;
} ;

// Derive the current state of the system
state.ready = function(model) {
   return true ;
} ;




// Next action predicate, derives whether
// the system is in a (control) state where
// a new (next) action needs to be invoked

state.nextAction = function(model) {
    // store snapshot
    // actions.do() ;
} ;

state.render = function(model,next) {
    state.representation(model,next)
    state.nextAction(model) ;
} ;

state.restore = function(model,next) {
    state.representation(model,next,false)
    state.nextAction(model) ;
} ;

////////////////////////////////////////////////////////////////////////////////
// Actions
//

var actions = {} ;

actions.edit = (data) => {
	data.lastEdited = {title: data.title,  description: data.description, id: data.id } ;
	data.__action = 'edit' ;
    actions.do(data) ;
    return false ;
} ;

actions.save = (data) => {
    data.item = {title: data.title, description: data.description, id: data.id || null} ;
    data.__action = 'save' ;
    actions.do(data) ; 
    return false ;
} ;

actions.delete = (data) => {
    data.deletedItemId = data.id ;
    data.__action = 'delete' ;
    actions.do(data) ;
    return false ;
} ;

actions.cancel = (data) => {
    data = data || {} ;
    data.__action = 'cancel'
    actions.do(data) ;
    return false ;
} ;


