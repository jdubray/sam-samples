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

model.init = function(render) {
    model.render = render ;
} ;
 
model.present = function(data,next) {
    data = data || {} ;
    
    console.log('--- model present --- check session' ) ;
    console.log(model.__session) ;
    
    model.__token = model.__token || data.__token ;
    
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
        
        if (data.item.id !== "") {
            // item has been edited
            model.posts.forEach(function(el,index) {
                if (el.id !== null) {
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
    
    model.render(model,next) ;
} ;

module.exports = model ;