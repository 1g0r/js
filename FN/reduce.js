// Give names to IIFE to have proper call stack
var fp = (function fp(library) {
    library.reduce = function __reduce(arr, fn, acc) {
        // TODO: check parameters
        let i = -1, l = arr.length;
        if (!acc && l > 0) {
            acc = arr[++i];
        }

        while (++i < l) {
            acc = fn(acc, arr[i], i, arr);
        }

        return acc;
    };

    library.reduceRight = function __reduceR(arr, fn, acc) {
        // TODO: check parameters
        let i = arr.length, l = 0;
        if (!acc && arr.length > 0) {
            acc = arr[--i];
        }

        while (--i > -1) {
            acc = fn(acc, arr[i], i, arr);
        }

        return acc;
    };

    return library;
})(fp || {});