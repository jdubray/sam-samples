 // standart SAM  

 import React, { Component, PropTypes } from 'react';
 import ReactDOM from 'react-dom';
 
 // application specific
 import {theme}       from './components/theme.jsx' ;

 // components
 import { menu } from './components/menu.component' ;
 import { todo } from './components/todo.component' ;
 
 import { SAM }        from './sam/sam'

 // theme = t
 
 // initial model, from file
 import {data}		   from './components/model.data'

 // initial model, from server
 // import {data}		   from '../app/v1/model.js' 

 var display = function(representation) {
    console.log('display')
    console.log(representation)
    if (representation.header) { ReactDOM.render(representation.header, document.getElementById('header-representation')) }
    if (representation.page) { ReactDOM.render(representation.page, document.getElementById('page-representation')) }
    if (representation.footer) { ReactDOM.render(representation.footer, document.getElementById('footer-representation')) }
    
 }

 var options = {
     host : "http://localhost:5425"
 } ;

// wire the elements of the pattern
let modules = [menu, todo]

SAM.init({theme, data, modules, display, options})

 