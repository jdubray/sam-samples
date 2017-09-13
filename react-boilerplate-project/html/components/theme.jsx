

import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom'; 

let cssPath = 'css/' ;
let jsPath = 'js/' ;

function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

let _theme = {


    menu(items) {
        items = items || [] ;
        return (
            <div>
                    <p>menu</p>
            </div>
        )
    },

    header(params) {
        let menu = this.menu(params.menu) ;
        return ( 
            <div>
                 <h1>todos</h1>
                 
                <input className="new-todo" placeholder="What needs to be done?" autofocus/>
            </div>)
        },
    
    home(params) {
        let img = params.img || 'images/content/bg-classes.jpg';
        return (
                <div>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-8">
                                <p>This is where the main page goes</p>
                                <pre>
                              
                                </pre> 
                            </div>
                        </div>
                    </div>
                </div>
            )
                        
    },
    
    footer(params) { 
        
        params = params || {} ;
        
        return (
            <div>
                <p>Double-click to edit a todo</p>
                
                <p>Written by <a href="http://twitter.com/lukeed05">Luke Edwards</a></p>
    
                <p>Refactored by <a href="https://github.com/jdubray">Jean-Jacques Dubray</a></p>
    
                <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
            </div>
        ) 
    },
    
    fullPage(params) {
        // {JSON.stringify(params,null,4)}
        return ( 
            <div>
                <p>This is where a full page goes</p>
                <pre>
                
                </pre>
            </div>
        ) 
    },
    
    contactus(params) {
        
        return (
            <div>
                <p>This is where the contact page goes</p>
                <pre>
                
                </pre>
            </div>
        ) ;
        
        
    },

    todo(params) {

        return (
            <div> 
                <input className="toggle-all" type="checkbox"/>

                <label for="toggle-all">Mark all as complete</label>

                <ul className="todo-list"></ul>

                <footer className="footer">

                    <span className="todo-count"></span>

                    <div className="filters">

                        <a href="#/" className="selected">All</a>

                        <a href="#/active">Active</a>

                        <a href="#/completed">Completed</a>

                    </div>

                    <button className="clear-completed">Clear completed</button>

                </footer>
            </div>       
        )

    },
    
    page(params) {
        if (params.menuItem === 'home') {
            return this.todo(params.home) ;
        } else {
            if (params.menuItem === 'contactus') {
                return this.contactus(params[params.menuItem]) ;
            } else {
                return this.fullPage(params[params.menuItem]) ;
            }
        }
    }

} ; 


var theme = function (conf) {
        cssPath = cssPath || conf.cssPath;
        jsPath = jsPath || conf.jsPath;
        
        return _theme ; 
    }

export { theme } ;

