///////////////////////////////////////////////////////////////////////////////
// This is free and unencumbered software released into the public domain.
//
// Anyone is free to copy, modify, publish, use, compile, sell, or
// distribute this software, either in source code form or as a compiled
// binary, for any purpose, commercial or non-commercial, and by any
// means.
//
// In jurisdictions that recognize copyright laws, the author or authors
// of this software dedicate any and all copyright interest in the
// software to the public domain. We make this dedication for the benefit
// of the public at large and to the detriment of our heirs and
// successors. We intend this dedication to be an overt act of
// relinquishment in perpetuity of all present and future rights to this
// software under copyright law.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
// OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
// ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
// OTHER DEALINGS IN THE SOFTWARE.
//
// For more information, please refer to <http://unlicense.org/>


var ApiBuilder = require('claudia-api-builder'),
    api = new ApiBuilder() ;

// Business Logic - SAM Pattern
var actions     = require('./actions' ) ;
var model       = require('./model'   ) ;
var view        = require('./view'    ) ;
var state       = require('./state'   ) ;

var sessionManager = require('./DDBsession') ;

var v = '/v1' ;
var r = 'app' ;
var d = 'dev' ;
var a = 'api' ;
var apis = {
    login: '/'+r+v+'/login',
    logout: '/'+r+v+'/logout',
    present: '/'+r+v+'/present',
    init: '/'+r+v+'/init',
    dispatch: '/'+r+v+'/dispatch',
    timetravel: '/'+d+v+'/timetravel/snapshots',
    session: '/'+r+v+'/session' 
} ;


api.post(apis.present,function(req) { 
    var data = req.body ;
    
    return new Promise(function(resolve,reject) {
      
      model.present(data, function(representation) {
          resolve(representation) ;
      }) ;
      
    });
    
    
}) ;


///////////////////////////////////////////////////////////////////////////////////////
///     
///     Session Management APIs 
///

api.post(apis.session, function(req) { 
    
    var data = req.body || {} ;
    
    var sessionID = req.queryString.sessionID || '1234' ;
    
    data.__token = data.__token || sessionID ;
    
    return sessionManager.dehydrateSession(data) ;
 
    
}) ;

api.get(apis.session, function(req) {
    var sessionID = req.queryString.sessionID || '1234' ;
    
    return sessionManager.rehydrateSession(sessionID) ;
}) ;


///////////////////////////////////////////////////////////////////////////////////////
/// 
///   Action Dispatcher
///

// Claudia.js is not compatible with Express, so dispatch is implemented manually
api.post(apis.dispatch, function(req) {

    var data = req.body ;

    console.log('dispatcher received request ' + JSON.stringify(data)) ;
    console.log('model is                    ' + JSON.stringify(model)) ;

    data.__token = req.__token || '1234' ;

    return new Promise(function(resolve, reject) {
        var actionName = data.__action ;
        if (actionName && actions[actionName] && typeof actions[actionName] === 'function') {
            actions[actionName](data, function(proposal) {
                model.present(proposal, function(representation) {
                    resolve(representation) ;
                }) ;
            }) ;
        } else {
            // Unknown action: present data directly
            model.present(data, function(representation) {
                resolve(representation) ;
            }) ;
        }
    }) ;

}) ;

api.get(apis.init, function(req) {
    // pass a no-op render callback so state does not attempt browser rendering
    state.render(model, () => {}) ;
    return view.init(model) ;
}) ;


// Export the api
module.exports = api;


