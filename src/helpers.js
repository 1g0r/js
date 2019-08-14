"use strict";

(function (hel) {
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

	// isNumber
	var isNumber = defineProp('isNumber');
	isNumber(function () { return true; })(Number.prototype);
	var isNumberFalse = isNumber(function () { return false; });
	isNumberFalse(Function.prototype);
	isNumberFalse(Object.prototype);
	isNumberFalse(String.prototype);
	isNumberFalse(Array.prototype);
	isNumberFalse(Boolean.prototype);

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
	defineProp('foreach')(function (action) {
		if (action && action.isFunction()) {
			for (var i = 0, item; (item = this[i]); ++i) {
				if (action(item) === false) {
					break;
				}
			}
		}
		return this;
	})(Array.prototype);

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

	////////
	hel.to$ = function (el) {
		if (el instanceof jQuery) {
			return el;
		}
		return $(el);
	};
	hel.guid = function () {
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1);
		}
		return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
	};
	hel.toArray = function () {
		if (arguments.length === 0) {
			return null;
		}
		return [].slice.call(arguments);
	};
	hel.serialize = function (obj) {
		if (hel.isObject(obj)) {
			var str = [];
			for (var p in obj)
				if (obj.hasOwnProperty(p) && obj[p]) {
					str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p] + ''));
				}
			return str.join("&");
		}
	};
})(Namespace("App.Helpers"));

(function (help) {
	var queue = [];
	var isBussy = false;


	var invoke = function (n) {
		setTimeout(function () {
			n.func();
			n.resolve();
			next();
		}, n.time);
	};

	var next = function () {
		var n = queue.shift();
		if (n) {
			isBussy = true;
			invoke(n);
		} else {
			isBussy = false;
		}
	};



	help.chainTimeout = function (func, duration) {
		return new Promise(function (onResolve, onReject) {
			queue.push({ func: func, time: duration, resolve: onResolve });
			if (!isBussy) {
				next();
			}
		});
	}

})(Namespace("App.Helpers"));

(function (help) {
	var fakeTextAerea = document.createElement('textarea');
	fakeTextAerea.style.position = 'fixed';
	fakeTextAerea.style.top = 0;
	fakeTextAerea.style.left = 0;
	fakeTextAerea.style.width = '2em';
	fakeTextAerea.style.height = '2em';
	fakeTextAerea.style.padding = 0;
	fakeTextAerea.style.border = 'none';
	fakeTextAerea.style.outline = 'none';
	fakeTextAerea.style.boxShadow = 'none';
	fakeTextAerea.style.background = 'transparent';
	document.body.appendChild(fakeTextAerea);

	help.toClipboard = function (text) {
		if (!text.isString() || text.isEmpty()) {
			return;
		}
		try {
			fakeTextAerea.value = text;
			fakeTextAerea.select();
			var successful = document.execCommand('copy');
			var msg = successful ? 'successful' : 'unsuccessful';
			console.log('Copying text command was ' + msg);
		} catch (err) {
			console.log('Oops, unable to copy');
		}
	}

})(
	Namespace("App.Helpers")
);
