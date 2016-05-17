function Namespace(name) {
	if (typeof name == "string" && name.length > 0) {
		_buildNamespace(window, name.split('.'));
		return _buildNamespace.last;
	}
}

function _buildNamespace(obj, tail) {
	var name = tail.shift();
	if (name) {
		if (!obj[name]) {
			obj[name] = {}
		}
		_buildNamespace.call(obj[name], obj[name], tail);
	} else {
		_buildNamespace.last = this;
	}
}

(function (hel) {
	hel.getDefaults = function (settings, defaults) {
		if (!this.isObject(defaults)) {
			return settings;
		}
		settings = settings || {};
		Object.keys(defaults).forEach(
			function(prop) {
				if (!settings[prop]) {
					settings[prop] = defaults[prop];
				}
		});
		return settings;
	};

	hel.isArray = function (arr) {
		return Object.prototype.toString.apply(arr) === "[object Array]";
	};
	hel.isFunction = function (func) {
		return typeof func === "function";
	};
	hel.isObject = function (obj) {
		return obj && typeof obj == "object";
	};
	hel.to$ = function (el) {
		if (el instanceof jQuery) {
			return el;
		}
		return $(el);
	};
	hel.isString = function (str) {
		return typeof str === "string";
	};
	hel.isDefined = function (val) {
		return typeof val !== "undefined";
	};
	hel.guid = function() {
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1);
		}
		return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
	};
	hel.toArray = function(args) {
		if (hel.isArray(args)) {
			return args;
		}
		if (args && args.length && args.length > 0) {
			var result = [];
			for (var i = 0, l = args.length; i < l; ++i) {
				result[i] = args[i];
			}
			return result;
		} 
		return [];
	};
})(Namespace("KL.Helpers"));

(function (ns) {
	ns.log = function () {
		if (console) {
			console.log.apply(console, KL.Helpers.toArray(arguments));
		}
	};
	ns.info = function() {
		if (console) {
			console.info.apply(console, KL.Helpers.toArray(arguments));
		}
	};
	ns.warn = function() {
		if (console) {
			console.warn.apply(console, KL.Helpers.toArray(arguments));
		}
	};
	ns.error = function() {
		if (console) {
			console.error.apply(console, KL.Helpers.toArray(arguments));
		}
	};
	ns.assert = function() {
		if (console) {
			console.assert.apply(console, KL.Helpers.toArray(arguments));
		}
	};

})(Namespace("KL.Logger"));

(function ($) {
	$.fn.hasAttr = function (name) {
		return KL.Helpers.isDefined(this.attr(name));
	}
})(jQuery);

(function ($) {
	$.fn.appendTimeZone = function (name) {
		if (this.length > 0 && this[0].tagName.toLowerCase() === "form") {
			var timeZone = (new Date().getTimezoneOffset()) / 60;
			this.append($('<input>').attr('type', 'hidden')
				.attr('name', name).val(timeZone * -1));
		}
		return this;
	}
})(jQuery);

(function () {
	String.prototype.format = function () {
		var args = KL.Helpers.toArray(arguments);
		if (args.length === 0) {
			return this;
		}
		if (args.length === 1 && KL.Helpers.isArray(args[0])) {
			args = args[0];
		}
		var result = this;
		args.forEach(function(item, i) {
			var regex = new RegExp('\\{' + i + '\\}');
			result = result.replace(regex, item.toString());
		});
		return result;
	};

	String.prototype.isEmpty = function () {
		return this.length === 0;
	};
	
	Array.prototype.unshift = (function(){
		var base = Array.prototype.unshift;
		return function(){
			base.apply(this, arguments);
			return this;
		};
	})();
})();

(function ($, ns) {
	function hasHandler(handlers, code) {
		return handlers && 
			code && 
			handlers.hasOwnProperty(code) && 
			KL.Helpers.isFunction(handlers[code]);
	}	
	function tryParseJson(str){
		try{
			return $.parseJSON(str);
		} catch(e) {
			KL.Logger.error('JSON parse error:', e);
			return false;
		}
	}	
	function fatal(handlers){
		var name = 'fatal';
		if(hasHandler(handlers, name)){
			handlers[name]();
			return true;
		}
		return false;
	}	
	ns.post = function(url, data, handlers) {
		$.ajax({
			url: url,
			type: 'POST',
			data: data,
			async: true,
			cache: false,
			contentType: false,
			processData: false,
			success: function(data, textStatus, jqXhr) {
				KL.Logger.info('ajax', url, textStatus);
				var result = tryParseJson(data);
				if (result && hasHandler(handlers, result.code)) {
					handlers[result.code](result.data);
				} else {
					KL.Logger.error('Ajax handler', result.code, 'not found', jqXhr);
					fatal(handlers);
				}
			},
			error: function(jqXhr, textStatus, errorThrown) {
				KL.Logger.error('Ajax error:', errorThrown);
				if (!fatal(handlers)) {
					KL.Logger.error('Ajax fatal handler not found', textStatus, errorThrown, jqXhr);
				}
			}
		});
	};
})(jQuery, Namespace("KL.Ajax"));
