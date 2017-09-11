
'use strict';

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
                <p>This is where the header goes</p>
                <pre>
                
                </pre>
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
                <p>This is where the footer goes</p>
                <pre>
               
                </pre>
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
    
    page(params) {
        if (params.menuItem === 'home') {
            return this.home(params.home) ;
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