# SAFE as a Server-Side Time Travel Store

[SAFE](https://www.npmjs.com/package/sam-safe) is a simple middleware that can be used to support the implementation of the SAM pattern.

In this code sample we use SAFE as a Server-Side Time Travel store for client application. In this instance, the client application implements the SAM pattern (state,model and actions), but this capability can be used as long as your application or component uses a single state tree. 

You simply need to add three hooks to your client application:
- save snapshot
- restore snapshot
- display timetravel controls

## Usage

```
npm install
node sever-model.js
```

Open blog.html file or this url: [http://localhost:5425/html/blog.html](http://localhost:5425/html/blog.html)

## Server-Side

You need to create a simple node.js app

SAFE can be used to wire the SAM elements
```
var express = require('express');
var bodyParser = require('body-parser') ;
var morgan = require('morgan') ;

var app = express();
app.use(morgan('combined')) ;
app.use(bodyParser.json()) ;

var safe = require('sam-safe') ;
 
// SAFE adds a default set of actions,model and state
safe.init() ;
 
// use default time traveler
var myTimeTraveler = safe.defaultTimeTraveler() ;
safe.initTimeTraveler(myTimeTraveler) ;
 
safe.dispatcher(app,your_dispatcher_path) ;
 
myTimeTraveler.init(app,your_time_travel_path) ;
 
 
// start application 
 
app.listen(config.port, function() {
    console.log("registering app on port: "+config.port) ;
    //setTimeout(register(),2000) ; 
});
```

### Client-Side

You need to implement three hooks which interact with the Time Travel API

Save Snapshot
```
function saveSnapshot(model) {
    var snapshot = JSON.parse(JSON.stringify(model));
    snapshot.__action = "__present" ;
    $.post( "http://localhost:5425/app/v1/dispatch/", snapshot) ;
}
```

Restore Snapshot
```
function travel(data) {
    // client side
    //model.present(data) ;

    // server side
    $.get( "http://localhost:5425/dev/v1/timetravel/snapshots/"+data.snapshot) 
    .done(function( snapshot ) {
        $.post( "http://localhost:5425/dev/v1/timetravel/snapshots/"+data.snapshot, snapshot)
        .done( function (representation) {
            console.log(representation) ;
            let m = JSON.parse(representation) ;
            
            let modelProperties = Object.getOwnPropertyNames(model).filter(function (p) {
                return typeof model[p] !== 'function';
            }) ;
            
            let snapShotProperties = Object.getOwnPropertyNames(m) ;
            
            modelProperties.forEach(function(p) {
                delete model[p] ;
            });
            
            snapShotProperties.forEach(function(p) {
               model[p] = m[p] ; 
            });
            
            console.log(model) ;
            
            state.render(model,null,false) ;
        })
    }        
    );
}
```

Display Time Travel controls
```
function displayTimeTravelControls(representation) {
    
    return (representation + 
    '          <br>\n<br>\n<hr>\n<div class="mdl-cell mdl-cell--6-col">\n'+
    '                      <input id="__snapshot" type="text" class="form-control"><br>\n'+
    '                      <button id="__travel" onclick="JavaScript:return travel({\'snapshot\':document.getElementById(\'__snapshot\').value});"> TimeTravel </button>\n'+
    '          </div><br><br>\n') ;
}
```
