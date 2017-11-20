

import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom'; 

let cssPath = 'css/' ;
let jsPath = 'js/' ;

function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

let _theme = {

    dispatch(event) {
        console.log('dispatching')
        console.log(event)
        this._actions.dispatch(event)
    },

    menu(items) {
        items = items || [] ;
        return (
            <div>
                    <p>menu</p>
            </div>
        )
    },

    header(params) {
        const addItem = (e) => { 
            e.preventDefault()
            e.stopPropagation()
            this.dispatch({name: "addItem", title: document.getElementById('newItem').value})
            document.getElementById('newItem').value = ''
        }
        
        return ( 
            <div>
                 <h1>todos</h1>
                 <form name="todo" onSubmit={addItem}>
                    <input id="newItem" className="new-todo" placeholder="What needs to be done?" autoFocus={true} />
                 </form>
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
    
                <p>From <a href="http://todomvc.com">TodoMVC</a></p>
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

        const removeItem = (e) => { 
            e.preventDefault()
            this.dispatch({name: "removeItem", removedItem: e.target.value})
        }

        const check = (e) => { 
            this.dispatch({name: "toggleItem", toggleItem: e.target.name, checked: e.target.checked})
        }

        const display = (e) => {
            e.preventDefault()
            this.dispatch({name: "display", filter: e.target.name})
        }

        const clearCompleted = (e) => {
            e.preventDefault()
            let outstandingItems = params.items.map( item => (item.completed) ? null : item).filter( value => value != null)            
            this.dispatch({name: "clearCompleted", newItems: outstandingItems})
        }

        if (params.items.length > 0) {
            let displayAll = (params.filter === 'all') ? 'selected' : null
            let displayActive = (params.filter === 'active') ? 'selected' : null
            let displayCompleted = (params.filter === 'completed') ? 'selected' : null
        return (
            <div> 
                <input className="toggle-all" type="checkbox"/>

                <label htmlFor="toggle-all">Mark all as complete</label>

                <ul className="todo-list">
                    {params.items.map(function (item, index) {
                        let completed = item.completed ? 'completed' : null
                        let itemCompleted = (item.completed) ? true : false
                        let filter = params.filter || 'all'
                        if ((filter === 'all')
                        || ((filter === 'completed') && (item.completed === true))
                        || ((filter === 'active') && (item.completed !== true))
                        ) {
                                        
                            return (
                                <li key={index} className={completed}>
                                    <input className="toggle" type="checkbox" id={'cb-'+index} checked={itemCompleted} onChange={check} name={index}/>
                                    <label>{item.title}</label>
                                    <button className="destroy" onClick={removeItem} value={index}></button>
                                </li>
                            ) 
                            
                        } 
                    })}
                </ul>

                <footer className="footer">

                    <span className="todo-count">{params.openItems || '0'}</span>

                    <div className="filters">

                        <a className={displayAll} onClick={display}>All</a>&nbsp;&nbsp;&nbsp;

                        <a className={displayActive} name='active' onClick={display}>Active</a>&nbsp;&nbsp;&nbsp;

                        <a className={displayCompleted} name='completed' onClick={display}>Completed</a>

                    </div>

                    <button className="clear-completed" onClick={clearCompleted} >Clear completed</button>

                </footer>
            </div>       
        )
        } else {
            return (<div></div>)
        }

    },
    
    page(params) {
        if (params.menuItem === 'home') {
            // you can hard code the relationship between model and them
            return this.todo(params.home) 
        } else {
            // or make it a bit more dynamic
            if (params.menuItem === 'contactus') {
                return this.contactus(params[params.menuItem]) 
            } else {
                return this.fullPage(params[params.menuItem]) 
            }
        }
    }

} ; 


var theme = function (actions, conf) {
        cssPath = cssPath || conf.cssPath
        jsPath = jsPath || conf.jsPath
        _theme._dispatch = actions.dispatch
        _theme._actions = actions
        return _theme ; 
    }

export { theme } 

