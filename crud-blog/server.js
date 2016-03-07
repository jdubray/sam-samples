// 

var express = require('express');
var bodyParser = require('body-parser') ;
var morgan = require('morgan') ;
var postman = require('./postman') ;


var config = {} ;
config.port = 5425 ;
config.loginKey = 'abcdef0123456789' ;
config.adminDirectory = './console/bower_components'
config.username = 'sam' ;
config.password = 'nomvc' ;

var serverResponses = {
    tooBusy: function(req,res) {
        res.writeHead(429, { 'Content-Type': 'text/plain' });
        res.end("Server is too busy, please try again later") ;
    },
    
    unauthorized: function(req,res) {
        res.header('Content-Type', 'text/html') ;
        res.status(401).send('<htnl><body>Unauthorized access</body></html>') ;  
    },
    
    serverError: function(req,res) {
        res.header('Content-Type', 'text/html') ;
        res.status(500).send('<htnl><body>Server Error</body></html>') ;  
    }
} ;

var authnz = {

    authorized: function (cookies) {
        if (cookies.authorized > 0) {
            return true ;
        }
        return false ;
    },
    
    del: function(req, res, cookie) { 
        if (cookie !== undefined) {
            res.clearCookie(cookie);  
        }
    },
    
    set: function(req, res, cookie) { 
        if (cookie !== undefined) {
             res.cookie(cookie, +new Date(), { maxAge: 3600000, path: '/' }); 
        }
    },
    
    isSet: function(req, res, cookie) { 
        if (cookie !== undefined) {
             return res.cookies[cookie]; 
        }
    },
    
    validateCredentials: function(username,password) {
        return ((username === config.username) && (password === config.password)) ;
    }

} ;

var app = express();
app.use(morgan('combined')) ;
app.use(bodyParser.raw()) ;
app.use(bodyParser.urlencoded({ extended: true }));

var cookieParser = require('cookie-parser') ;
app.use(cookieParser()) ;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/html', express.static(config.adminDirectory));


var v = '/v1' ;
var r = 'app' ;
var a = 'api' ;
var apis = {
    login: '/'+r+v+'/login',
    logout: '/'+r+v+'/logout',
    present: '/'+r+v+'/present',
    init: '/'+r+v+'/init'
} ;


var postman = require('./postman') ;

postman.addAPI(r, 'login', config.loginKey) ;
app.post(apis.login,function(req,res) { 
    var username = req.body.username,
        password = req.body.password ;
    
    if (authnz.validateCredentials(username,password)) {
            console.log('Authorized') ;
            authnz.set(req,res,'authorized') ;
            res.status(200).send({authorized:true, user: {firstName:'Paul', lastName:'Smith', tel:'+1-425-555-1212'}}) ;
    } else {
        console.log('Unauthorized access') ;
        res.status(200).send({authorized:false}) ;
    }
}) ;

postman.addAPI(r, 'logout', config.loginKey) ;
app.get(apis.logout,function(req,res) { 
    authnz.del(req,res,'authorized') ;
    res.status(200).send({authorized:false}) ;
}) ;

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
        
        if (data.item.id !== "") {
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
    next(representation) ;
    //var stateRepresentation = document.getElementById("representation");
    //stateRepresentation.innerHTML = representation;
} ;


////////////////////////////////////////////////////////////////////////////////
// State
//
var state =  { view: view} ;

model.state = state ;

// Derive the state representation as a function of the systen
// control state
state.representation = function(model,next) {
    var representation = 'oops... something went wrong, the system is in an invalid state' ;

    if (state.ready(model)) {
        representation = state.view.ready(model) ;
    } 
    
    state.view.display(representation,next) ;
} ;

// Derive the current state of the system
state.ready = function(model) {
   return true ;
} ;


// Next action predicate, derives whether
// the system is in a (control) state where
// a new (next) action needs to be invoked

state.nextAction = function(model) {} ;

state.render = function(model,next) {
    state.representation(model,next)
    state.nextAction(model) ;
} ;

postman.addAPI(r, 'present', config.loginKey) ;
app.post(apis.present,function(req,res) { 
    var data = req.body ;
    model.present(data, function(representation) {
        res.status(200).send(representation) ;
    }) ;
}) ;


postman.addAPI(r, 'init', config.loginKey) ;
app.get(apis.init,function(req,res) { 
    res.status(200).send(view.init(model)) ;
}) ;



app.listen(config.port, function() {
    console.log("registering app on port: "+config.port) ;
    //setTimeout(register(),2000) ; 
});