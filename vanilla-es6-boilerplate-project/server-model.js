


const configFile = (process.env.NODE_ENV || 'default');

const config = require('config');

// add a "safe get"
config.gets = function(prop) {
    if (this.has(prop)) {
        return this.get(prop);
    }
    return undefined;
}

const loggerConfig = config.gets("services.log4js") || {};
const logger = require('./log4')(loggerConfig) ;

logger.std.info('Logger is on!') ;
                        
var express = require('express');
var bodyParser = require('body-parser') ;
var morgan = require('morgan') ;
var nodemailer = require('nodemailer');
var cors = require('cors') ;
const rp = require('request-promise') ;
var Engine = require('tingodb')() ;

var site = require('./data') ;
var emailFormater = require('./plugins/email.formater') ;


var db = new Engine.Db( config.gets("dbPath"), {});
var autocomplete = db.collection("autocomplete");

var googleMapsClient = require('@google/maps').createClient({
  key: config.gets('googleMapsAPIKey')
});

// Business Logic - SAM Pattern
// var actions = require('./asana-html/sam/actions') ; // not implemented on the server
// var model = require('./asana-html/sam/model') ;
// var view = require('./asana-html/sam/view') ;
// var state = require('./asana-html/sam/state') ;

// var safe = require('sam-safe') ;

// safe.init(actions,model,state,view) ;

// // use default time traveler
// var myTimeTraveler = safe.defaultTimeTraveler() ;
// safe.initTimeTraveler(myTimeTraveler) ;

config.loginKey = 'abcdef0123456789' ;
config.username = 'sam' ;
config.password = 'nomvc' ;

var transporter = nodemailer.createTransport(config.gets("mailServer"));

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
app.all('*', cors());
app.use(morgan('combined')) ;
app.use(bodyParser.raw()) ;
app.use(bodyParser.json()) ;
app.use(bodyParser.urlencoded({ extended: true }));

var cookieParser = require('cookie-parser') ;
app.use(cookieParser()) ;

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

app.use('/html', express.static(config.gets("adminDirectory")));

var v = '/v1' ;
var r = 'app' ;
var d = 'dev' ;
var a = 'api' ;
var apis = {
    model: '/'+r+v+'/model.js',
    autocomplete: '/'+r+v+'/autocomplete',
    contact: '/'+r+v+'/contact',
    quote: '/'+r+v+'/quote',
    login: '/'+r+v+'/login',
    logout: '/'+r+v+'/logout',
    present: '/'+r+v+'/present',
    init: '/'+r+v+'/init',
    dispatch: '/'+r+v+'/dispatch',
    timetravel: '/'+d+v+'/timetravel/snapshots'
} ;


// var postman = require('./postman') ;

// postman.addAPI(r, 'login', config.loginKey) ;

console.log(config.gets("dbPath")) ;

app.get(apis.model,function(req,res) { 
   res.set('Content-Type', "text/javascript") ;
   res.status(200).send(`
   export var data = ${JSON.stringify(site(config.gets("dbPath"))(), null,4)} ;`) ; 
});

app.post(apis.login,function(req,res) { 
    var username = req.body.username,
        password = req.body.password ;
    
    if (authnz.validateCredentials(username,password)) {
            authnz.set(req,res,'authorized') ;
            res.status(200).send({authorized:true, user: {firstName:'Paul', lastName:'Smith', tel:'+1-425-555-1212'}}) ;
    } else {
        res.status(200).send({authorized:false}) ;
    }
}) ;


app.post(apis.contact,function(req,res) { 
    
    console.log(req.body) ;
    
    var name = req.body.name,
        email = req.body.email,
        phone = req.body.phone,
        message = req.body.message
        ;
    
    let toEmail = config.gets("adminEmail") || "jdubray@gmail.com" ;
    phone = phone || 'N/A' ;
    email = email || 'N/A' ;
    name = name || 'N/A' ;
    var mailOptions =  emailFormatter({
        from: toEmail, // sender address
        to: toEmail, // list of receivers
    }) ;

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            res.json({yo: 'error'});
        }else{
            logger.std.info('Email Message sent: ' + info.response);
        }
    });
    
    res.status(200).send({success:true}) ;

}) ;

// postman.addAPI(r, 'logout', config.loginKey) ;

app.get(apis.logout,function(req,res) { 
    authnz.del(req,res,'authorized') ;
    res.status(200).send({authorized:false}) ;
}) ;





//postman.addAPI(r, 'present', config.loginKey) ;

app.post(apis.present,function(req,res) { 
    var data = req.body ;
    model.present(data, function(representation) {
        res.status(200).send(representation) ;
    }) ;
}) ;


//postman.addAPI(r, 'init', config.loginKey) ;

app.get(apis.init,function(req,res) { 
    // Store initial snapshot
    myTimeTraveler.saveSnapshot(model,{}) ;
    
    res.status(200).send(view.init(model)) ;
}) ;

// add SAFE's APIs

// safe.dispatcher(app,apis.dispatch) ;

// myTimeTraveler.init(app,apis.timetravel) ;

// start application 

app.listen(config.gets("port"), function() {
    logger.std.info("registering app on port: "+config.gets("port")) ; 
});