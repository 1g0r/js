var fp = (function fp(library) {
    library.map = function(arr, fn) {
        // Check parameters
        if (arr == null || !arr.isArray() || arr.length == 0){
            return [];
        }
        if (fn == null || !fn.isFunction()) {
            throw 'Supply valid function to map method' ;
        }

        // perform action
        let result = new Array(len);
        for(let i=0,l=arr.length; i<l; ++i) {
            result[i] = fn(arr[i], i, arr);
        }
        return result;
    };

    return library;
})(fp || {})