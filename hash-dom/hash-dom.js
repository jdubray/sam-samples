'use strict' ;

var hashCode = function(s){
    var hash = 0
    if (!s || s.length == 0) { 
        return hash
    }
    for (let i = 0; i < s.length; i++) {
        let char = s.charCodeAt(i)
        hash = ((hash<<5)-hash)+char
        hash = hash & hash
    }
    return hash
}
    
var hashRepresentation = function(representation) {
    
    let hashedRepresentation = {}
    
    Object.keys(representation || {}).forEach( function (key) {
        hashedRepresentation[key] = hashCode(representation[key])
    })
    
    return hashedRepresentation
    
}
    
var trim = function(representation, priorHash) {
    
    let newHashedValues = hashRepresentation(representation)
    let trim = {}
    
    Object.keys(representation).forEach( function (key) {
        if (newHashedValues[key] !== priorHash[key]) {
            document.getElementById(key).innerHTML = representation[key]
        }
    })
    
    return newHashedValues
}

export { trim }