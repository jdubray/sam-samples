
'use strict';

import { datepicker } from './datepicker.component.js'
import { A, F, O } from '../js/i.js'

let cssPath = 'css/' ;
let jsPath = 'js/' ;

function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

let _theme = {


    menu(items) {
        items = items || [] ;
        let output = (items.map(function(item) {
            let active = '' ;
            if (item.active) { active = `class="active"`; }
            let html = `<li ${active}><a id="${item.href}" href="#" onclick="return actions.setMenuItem({menuItem:'${item.href}'});">${item.label}</a>` ;
            if (item.subMenu) {
                html += this.menu(item.subMenu) ;
            }
            html += `</li>`;
            return html ;
        }).join('\n')) ;
        return output ; 
    },

    header(params) {
        let menu = this.menu(params.menu) ;
        let output = ( `
            <p>This is where the header goes</p>
            <ul>
                ${menu}
            </ul>
            <pre>
${JSON.stringify(params,null,4)}
            </pre>
        `) ;
        return output 
    },
    
    home(params, renderers = {}, components = {}) {
        let img = params.img || 'images/content/bg-classes.jpg';
        let output = `<br><br>
                <div class="container">
                    <div class="row">
                        <div class="col-lg-4 col-lg-offset-2 col-md-5 col-md-offset-1">
                            ${F(renderers['datepicker1'])(components.model['datepicker1'])}
                        </div>
                        <div class="col-lg-4 col-lg-offset-2 col-md-5 col-md-offset-1">
                            ${F(renderers['datepicker2'])(components.model['datepicker2'])}
                        </div>
                    </div>
                </div>
                <br><br>
                <div class="container">
                    <div class="row">
                        <div class="col-md-8">
                            <p>This is where the main page goes</p>
                            <pre>
${JSON.stringify(params,null,4)}
                            </pre> 
                        </div>
                    </div>
                </div>
                        
        `
        
        
        return output 
    },

    
    
    footer(params) { 
        
        params = params || {} ;
        
        return (`
            <p>This is where the footer goes</p>
            <pre>
${JSON.stringify(params,null,4)}
            </pre>
        `) ;
    },
    
    fullPage(params, renderers = {}, components = {}) {
        return ( 
            `<p>This is where a full page goes</p>
            <pre>
            ${JSON.stringify(params,null,4)}
            </pre>`) ;
    },
    
    contactus(params, renderers = {}, components = {}) {
        
        return (`
            <p>This is where the contact page goes</p>
            <pre>
            ${JSON.stringify(params,null,4)}
            </pre>
        `) ;
        
        
    },
    
    page(params, renderers, components) {
        if (params.menuItem === 'home') {
            return this.home(params.home, renderers, components) ;
        } else {
            if (params.menuItem === 'contactus') {
                return this.contactus(params[params.menuItem], renderers, components) ;
            } else {
                return this.fullPage(params[params.menuItem], renderers, components) ;
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