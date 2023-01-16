// Give names to IIFE to have proper call stack
var fp = (function fp(library) {
    library.curry = function __curry(fn) {
        if (fn == null || !fn.isFunction()) {
            throw 'Supply valid function to curry method' ;
        }

        return function curried(...args) {
            if (args.length >= fn.length) {
                return fn.apply(library, args);
            } else {
                return function __curried(...args2) {
                    return curried.apply(library, args.concat(args2));
                }
            }
        };
    };

    return library;
})(fp || {});