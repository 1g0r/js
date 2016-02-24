function Namespace(name) {
	if (typeof name == "string" && name.length > 0) {
		_buildNamespace(window, name.split('.'));
	}
}

function _buildNamespace(obj, tail) {
	var name = tail.shift();
	if (name) {
		if (!obj[name]) {
			obj[name] = {}
		}
		_buildNamespace(obj[name], tail);
	}
}

Namespace("App.Helpers");
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
})(App.Helpers);

Namespace("App.Logger");
(function (ns) {
	ns.log = function () {
		if (console) {
			console.log.apply(console, App.Helpers.toArray(arguments));
		}
	};
	ns.info = function() {
		if (console) {
			console.info.apply(console, App.Helpers.toArray(arguments));
		}
	};
	ns.warn = function() {
		if (console) {
			console.warn.apply(console, App.Helpers.toArray(arguments));
		}
	};
	ns.error = function() {
		if (console) {
			console.error.apply(console, App.Helpers.toArray(arguments));
		}
	};
	ns.assert = function() {
		if (console) {
			console.assert.apply(console, App.Helpers.toArray(arguments));
		}
	};

})(App.Logger);

(function () {
	String.prototype.format = function () {
		var args = App.Helpers.toArray(arguments);
		if (args.length === 0) {
			return this;
		}
		if (args.length === 1 && App.Helpers.isArray(args[0])) {
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
	}
})();

Namespace("App.Ajax");
(function ($, ns) {
	function hasHandler(handlers, code) {
		return handlers && code && handlers.hasOwnProperty(code);
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
				App.Logger.info('ajax', url, textStatus);
				var result = $.parseJSON(data);
				if (result && hasHandler(handlers, result.code)) {
					handlers[result.code](result.data);
				} else {
					App.Logger.error('Ajax handler', result.code, 'not found', jqXhr);
				}
			},
			error: function(jqXhr, textStatus, errorThrown) {
				App.Logger.error('Ajax error:', errorThrown);
				if (hasHandler(handlers, 'fatal')) {
					handlers['fatal']();
				} else {
					App.Logger.error('Ajax fatal handler not found', textStatus, errorThrown, jqXhr);
				}
			}
		});
	};
})(jQuery, App.Ajax);
