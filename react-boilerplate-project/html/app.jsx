 // standart SAM  

 import React, { Component, PropTypes } from 'react';
 import ReactDOM from 'react-dom';
 
 import {state}       from './sam/state.js' ; 
 import {model}       from './sam/model.js' ;
 import {actions}     from './sam/actions.js' ;
 import {view}        from './sam/view.js' ;
 
 // application specific
 import {theme}       from './components/theme.jsx' ;

 // theme = t
 
 // initial model, from file
 import {data}		   from './components/model.data.js'

 // initial model, from server
 // import {data}		   from '../app/v1/model.js' 

 var display = function(representation) {

    if (representation.header) { ReactDOM.render(representation.header, document.getElementById('header-representation')) }
    if (representation.page) { ReactDOM.render(representation.page, document.getElementById('page-representation')) }
    if (representation.footer) { ReactDOM.render(representation.footer, document.getElementById('footer-representation')) }
    
 }
 
 var components = {
     acceptors: [],
     reactors: [],
     filters:[],
     postProcessings: [],
     intents: [],
     states: {
         "ready": {
                     nextAction: () => {}
             }
       },
     data: data
 } ;

 var options = {
     host : "http://localhost:5425"
 } ;

// wire the elements of the pattern
state.init(view,theme, display, components) ;
model.init(state, components, options) ;
actions.init(model.present, options) ;
view.init(model,theme(options))
// init
state.representation(model) ;
 