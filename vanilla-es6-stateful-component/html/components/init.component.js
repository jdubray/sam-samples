

import { menu } from './menu.component.js' 
import { datepicker } from './datepicker.component.js' 
import { A, F, O } from '../js/i.js'

// this function wires the application components 
// to the SAM pattern elements (actions and model updates)

function mountComponent(component = {}, components = {}) {
    components.renderers = O(components.renderers) 
    components.acceptors = A(components.acceptors)
    components.actions = A(components.actions)
    components.reactors = A(components.reactors)
    components.model = A(components.model)
    
    A(component.acceptors).forEach(function(acceptor) {
        components.acceptors.push(acceptor) 
    }) 

    A(component.actions).forEach(function(action) {
        components.actions.push(action) 
    }) 

    A(component.reactors).forEach(function(reactor) {
        components.reactors.push(reactor) 
    }) 

    if (component.id && component.render) {
        components.renderers[component.id] = F(component.render)
        components.model[component.id] = O(component.initialState)
    }
    
   
}

var init = function(components) {

    // stateless components
    mountComponent(menu, components)

    // stateful components
    mountComponent(datepicker('datepicker1'), components)
    mountComponent(datepicker('datepicker2'), components)
    
}

var getParameterByName = function(name, url) {
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var checkBackButton = function(model) {
    if (!model.data.popped) { 
        if (model.history){
            let bid = (model.data.home.blog.blogid) ? '-'+model.data.home.blog.blogid : '';
            model.history = {state:model.data.menuItem+bid};
            if (!model.data.home.blog.blogid) { 
                history.pushState(model.history, null, '/html/#'+model.data.menuItem); 
            } else {
                history.pushState(model.history, null, '/html/blog/'+model.data.home.blog.blogid);
            } 
        } else {
            model.history = {state:'home'} ; 
            window.history.pushState(model.history, null, '/html/');
        }
    } 
} ;

var preparePage = function(model) {
    // This section is used to prepare the page for rendering the state representation
    // it is called from the display() function in index.html

    // For instance it can be used to set the body element class

    // if (model.data.blog.blogid || (model.data.menuItem !== 'blog')) { 
    //     document.body.className = 'home' ;
    // } else if (model.data.menuItem === 'blog') { 
    //     document.body.className = 'page page-template' ;
    // } 
} ;

export { init, getParameterByName, preparePage, checkBackButton }