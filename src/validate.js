Namespace("KL.Validate");
(function ($, errorBlock) {
	var _attributes = {
		type: 'validate-type', 
		labelId: 'validate-label-id',
		inputId: 'validate-input-id',
		deputyId: 'validate-deputy-id',
		pattern: 'validate-regex',
		fileSize: 'validate-size',
		fileNameLength: 'validate-length'
	};
	var messages = $('[{0}]'.format(_attributes.type), errorBlock);

	function findElement($msg, attrName) {
		var attr = $msg.attr(attrName);
		if (!attr) {
			return $();
		}
		return $('#{0}'.format(attr));
	}

	function wrapVisitor(el) {
		if (!el) {
			return {
				setColor: function () { },
				delColor: function () { }
			};
		}
		if (!el.setColor) {
			var visitors = {};
			el.setColor = function(visitiorId, callback) {
				if (Object.keys(visitors).length === 0 &&
						KL.Helpers.isFunction(callback)) {
					callback.call(el);
				}
				visitors[visitiorId] = true;
			};
			el.delColor = function (visitiorId, callback) {
				delete visitors[visitiorId];
				if (Object.keys(visitors).length === 0 && 
						KL.Helpers.isFunction(callback))  {
					callback.call(el);
				}
			}
		}
		return el;
	}

	function wrapInput($input) {
		if (!$input || $input.length === 0) {
			return wrapVisitor(false);
		}
		var div = $input.parent();
		if (div.hasClass('validation-wrapper')) {
			return wrapVisitor(div[0]);
		}
		div = $('<div class="validation-wrapper"></div>');
		$input.wrap(div);
		return wrapVisitor($input.parent()[0]);
	}

	

	function getContext($msg) {
		var labelId = $msg.attr(_attributes.labelId);
		var result = {
			label: wrapVisitor(labelId ? document.getElementById(labelId) : false),
			input: findElement($msg, _attributes.inputId),
			pattern: $msg.attr(_attributes.pattern),
			code: $msg.attr('id') || KL.Helpers.guid(),
			fileSize: $msg.attr(_attributes.fileSize),
			fileNameLength: $msg.attr(_attributes.fileNameLength)
		}
		var deputy = findElement($msg, _attributes.deputyId);
		result.wrapper = wrapInput(deputy.length === 0 ? result.input : deputy);
		return result;
	}

	function handle($msg, context, validValue) {
		return function () {
			if (/*context.input &&*/ !validValue()) {
				this.on();
				return [context.code];
			} else {
				this.off();
				return [];
			}
		}
	}

	var handlerTypes = {
		'mandatory': function ($message, context) {
			return handle($message, context, function () {
				if (context.input.attr('type') === 'checkbox') {
					return context.input.is(':checked');
				}
				return context.input.val().length > 0;
			});
		},
		"regex": function ($message, context) {
			return handle($message, context, function () {
				if(context.input.val().isEmpty()){
					return true;
				}
				if (context.pattern) {
					var regex = new RegExp(context.pattern);
					return regex.test(context.input.val());
				}
				return true;
			});
		},
		"filesize": function($message, context) {
			return handle($message, context, function () {
				var file = context.input[0].files[0];
				if (file) {
					return file.size <= context.fileSize;
				}
				return true;
			});
		},
		"filenamelength": function ($message, context) {
			return handle($message, context, function () {
				var file = context.input[0].files[0];
				if (file) {
					return file.name.length > 0 && file.name.length <= context.fileNameLength;
				}
				return true;
			});
		},
		"filenullsize": function($message, context){
			return handle($message, context, function () {
				var file = context.input[0].files[0];
				if (file) {
					return file.size.length > 0;
				}
				return true;
			});
		},
		"captcha": function($message, context) {
			return handle($message, context, function () {
				/*Server side check only*/
				return true;
			});
		}
	};

	/*Closure handlers context*/
	(function () {
		messages.each(function (i, msg) {
			if (!msg.handlers) {
				createHandlers(msg);
			}
		});
	})();


	function createHandlers(msg) {
		var $msg = $(msg);
		var type = $msg.attr(_attributes.type).trim().toLowerCase();
		var context = getContext($msg);
		
		msg.handlers = {
			on: (function () {
				return function () {
					$msg.show();
					context.wrapper.setColor(context.code, function() {
						$(this).addClass('error');
					});
					context.label.setColor(context.code, function () {
						$(this).addClass('error-label');
					});
				};
			})(),
			off: (function () {
				return function() {
					$msg.hide();
					context.wrapper.delColor(context.code, function () {
						$(this).removeClass('error');
					});
					context.label.delColor(context.code, function () {
						$(this).removeClass('error-label');
					});
				}
			})(),
			validate: handlerTypes.hasOwnProperty(type) ?
				handlerTypes[type]($msg, context) :
				function () { return [] }
		};
	}


	KL.Validate.Run = function() {
		var errors = [];
		messages.each(function(i, msg) {
			if (!msg.handlers) {
				createHandlers(msg);
			}
			errors = errors.concat(msg.handlers.validate());
		});
		return errors;
	};
	KL.Validate.Highlight = function(errors) {
		messages.each(function(i, msg) {
			if (errors.hasOwnProperty(msg.id)) {
				msg.handlers.on();
			} else {
				msg.handlers.off();
			}
		});
	};
})(jQuery, jQuery('#error_block') || document);
