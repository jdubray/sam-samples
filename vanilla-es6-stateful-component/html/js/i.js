

function A(arr) {

    if (!Array.isArray(arr)) {
        arr = []
    }
    return arr
}

function O( obj ) {
    if (!obj || typeof obj !== 'object') {
        obj = {}
    }
    return obj
}

function F( f ) {
    if (!f || {}.toString.call(f) !== '[object Function]') {
        f = () => {}
    }
    return f
}

export { A, O, F }