'use strict';
(function(w){
    function buildNamespace(obj, tail) {
        var name = tail.shift();
        if (name) {
            if (!obj[name]) {
                obj[name] = {}
            }
            buildNamespace.call(obj[name], obj[name], tail);
        } else {
            buildNamespace.last = this;
        }
    }

    w.Namespace = function(name){
        if (typeof name === "string" && name.length > 0) {
            buildNamespace(w, name.split('.'));
            return buildNamespace.last;
        }
        return {};
    };
})(window);

(function(w){
    function defineProp(name) {
		return function(fn) {
			return function(obj) {
				Object.defineProperty(obj, name, {
					enumerable: false,
					value: fn
				});
			}
		}
	}

	// isArray
	var isArray = defineProp('isArray');
	isArray(function () { return true; })(Array.prototype);
	var isArrayFalse = isArray(function() { return false; });
	isArrayFalse(Object.prototype);
	isArrayFalse(Function.prototype);
	isArrayFalse(Number.prototype);
	isArrayFalse(String.prototype);
	isArrayFalse(Boolean.prototype);

	// isString
	var isString = defineProp('isString');
	isString(function () { return true; })(String.prototype);
	var isStringFalse = isString(function() { return false; });
	isStringFalse(Function.prototype);
	isStringFalse(Object.prototype);
	isStringFalse(Number.prototype);
	isStringFalse(Array.prototype);
	isStringFalse(Boolean.prototype);

	// isFunction
	var isFunction = defineProp('isFunction');
	isFunction(function () { return true; })(Function.prototype);
	var isFunctionFalse = isFunction(function() { return false; });
	isFunctionFalse(String.prototype);
	isFunctionFalse(Object.prototype);
	isFunctionFalse(Number.prototype);
	isFunctionFalse(Array.prototype);
	

	// isObject
	var isObject = defineProp('isObject');
	isObject(function () { return true; })(Object.prototype);
	var isObjectFalse = isObject(function() { return false; });
	isObjectFalse(Array.prototype);
	isObjectFalse(Date.prototype);
	isObjectFalse(Boolean.prototype);
	isObjectFalse(String.prototype);
	isObjectFalse(Number.prototype);

	//setDefaults
	var setDefaults = defineProp('setDefaults');
	setDefaults(function(defaults) {
		defaults = defaults || {};
		if (!defaults.isObject())
			return this;

		var self = this;
		Object.keys(defaults).forEach(function (name) {
			if (!self.hasOwnProperty(name)) {
				self[name] = defaults[name];
			}
		});

		return self;
	})(Object.prototype);
	var setDefaultsDef = setDefaults(function () { return this; });
	setDefaultsDef(Date.prototype);
	setDefaultsDef(String.prototype);
	setDefaultsDef(Boolean.prototype);
	setDefaultsDef(Number.prototype);
	setDefaultsDef(Function.prototype);
	setDefaultsDef(Array.prototype);
})(window);
