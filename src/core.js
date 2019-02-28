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
	
	// String
	defineProp('format')(function () {
		if (arguments.length === 0) {
			return this;
		}
		var args = [].slice.call(arguments);
		if (args.length === 1 && args[0].isArray()) {
			args = args[0];
		}
		var result = this;
		args.forEach(function (item, i) {
			var regex = new RegExp('\\{' + i + '\\}');
			result = result.replace(regex, item.toString());
		});
		return result;
	})(String.prototype);

	defineProp('isEmpty')(function () {
		return this.length === 0;
	})(String.prototype);

	defineProp('fromUtc')(function () {
		if (!this.endsWith('Z')) {
			return new Date(this + "Z");
		}
		return new Date(this);
	})(String.prototype);

	// Array
	defineProp('isEmpty')(function () {
		return this.length === 0;
	})(Array.prototype);

	defineProp('delete')(function (func) {
		if (!func && !func.isFunction() || this.isEmpty()) {
			return this;
		}
		for (var i = 0, item; (item = this[i]); ++i) {
			if (func(item) === true) {
				this.splice(i, 1);
				break;
			}
		}
		return this;
	})(Array.prototype);
})(
	window
);
