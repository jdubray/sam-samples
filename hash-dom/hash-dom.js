'use strict' ;

//////////////////////////////////////////////////////////////////
//
// Hash DOM    
//
var hashCode = function (s) {
    // from http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
    // or your favorite hashing algorithm
    let hash = 0
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

var hashedRepresentation = function (representation) {

    let hashedRepresentation = {}

    Object.keys(representation || {}).forEach( function (key) {
        hashedRepresentation[key] = (typeof representation[key] === 'string') ? hashCode(representation[key]) : window.hashedRepresentation(representation[key])
    })

    return hashedRepresentation

}

var trim = function (representation, priorHash) {

    let newHashedValues = hashedRepresentation(representation)

    Object.keys(representation || {}).forEach( function (key) {
        if (typeof newHashedValues[key] === 'number') {
            if (newHashedValues[key] !== priorHash[key]) {
                (document.getElementById(key) || {}).innerHTML = representation[key]
            }
        } else {
            window.trim(representation[key],(priorHash[key] || {}))
        }
    })

    return newHashedValues
}

export { trim }