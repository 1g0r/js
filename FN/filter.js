// Give names to IIFE to have proper call stack
var fp = (function fp(library) {
    library.filter = function __filter(arr, predicate) {
        // TODO: check parameters
        let index = -1,
            len = arr.length,
            result = [];

        while(++index < len) {
            let value = arr[index];
            if (predicate(value, index, arr)) {
                result.push(value);
            }
        }

        return result;
    };

    return library;
})(fp || {});