Namespace("KL");

(function ($) {
	$.fn.bindFirst = function (event, fn) {
		this.each(function () {
			$(this).on(event, fn);
			var handler = $._data(this, 'events')[event];
			handler.splice(0, 0, handler.pop());
		});
	};
})(jQuery);

(function ($){
	'use strict';
	var __nEventAttrName = 'eb_onEvent';
	var __eventAttrName = 'eb_fireEvent';
	var __eventData = {
		Page: {
			Url: window.location.href
		}
	};
	var __events = {};
	var __errorHandler = false;
	var __imp = {
		init: function(selector){
			$(selector).each(function(){
				var me = $(this);
				me.bindFirst(me.attr(__nEventAttrName), function () {
					KL.EventBus.trigger(me.attr(__eventAttrName), this);
				});
			})
		},
		initAll: function(){
			__imp.init('input[' + __nEventAttrName + ']');
			__imp.init('label[' + __nEventAttrName + ']');
		},
		addEventData: function(name, value){
			if (name && KL.Helpers.isString(name) && name.toLowerCase() !== 'page') {
				__eventData[name] = value;
			}
			return KL.EventBus;
		},
		on: function(event, handler){
			if(KL.Helpers.isString(event) && KL.Helpers.isFunction(handler)){
				var eventName = event.toLowerCase();
				if (!__events[eventName]) {
					__events[eventName] = [handler];
				} else {
					__events[eventName].push(handler);
				}
			}
			return KL.EventBus;
		},
		off: function(event){
			if(KL.Helpers.isString(event)){
				var eventName = event.toLowerCase();
				if(__events.hasOwnProperty(eventName)){
					delete __events[eventName];
				}
			}
		},
		getArgsFrom: function(args, startIndex){
			var result = [];
			if(args.length > startIndex){
				for(var i=startIndex, l=args.length; i<l; ++i){
					result.push(args[i]);
				}
			}
			return result;
		},
		addHandleError: function(callback){
			if(KL.Helpers.isFunction(callback)){
				__errorHandler = callback;
			}
		},
		executeSafe: function(event, handler, thisArg, args){
			try {
				handler.apply(thisArg, args);
			} catch (error) {
				if (__errorHandler && KL.Helpers.isFunction(__errorHandler)) {
					args.unshift(error);
					args.unshift(event);					
					try {
						__errorHandler.apply(thisArg, args);
					} catch (error) {
						// Если совсем всё плохо у клиента, 
						//внутренний код это не должно затрагивать
					}
				}
			}
		},
		trigger: function(event, thisArg){
			var args = __imp.getArgsFrom(arguments, 2);
			args.unshift(__eventData);
			
			var handlers = __events[event.toLowerCase()];
			if (handlers) {
				for (var i = 0, handler; handler = handlers[i]; ++i) {
					(function (h) {
						__imp.executeSafe(event, h, thisArg, args);
					})(handler); //loop scope issue

				}
			}
			return KL.EventBus;
		}
	}
	
	
	/*Public interface*/
	KL.EventBus = {
		init: __imp.initAll,
		/*
		* Добавляет данные в EventData, если имя свойства не равно 'Page'.
		* @param {string} name
		* @param {string | object | array} value - значение, которое необходимо добавить.
		* @returns {KL.EventBus}
		*/
		addEventData: __imp.addEventData,
		/*
		* Добавляет данные в EventData, если имя свойства не равно 'Page'.
		* @param {string} name
		* @param {function} handler - функция обработчик события.
		* @returns {KL.EventBus}
		*/
		on: __imp.on,
		/*
		* Удаляет обарботчик события с указанным именем.
		* @param {string} name
		* @returns {KL.EventBus}
		*/
		off: __imp.off,
		/*
		* Вызов события.
		* @param {string} name - название события.
		* @param {object} thisArg - объект, инициировавший событие.
		* @param {any} args - дополнительные параметры, которые необходимо передать в обработчик события.
		* @returns {KL.EventBus}
		*/
		trigger: __imp.trigger,
		
		/*
		* Обработчик исключения, возникшего в обработчике события.
		* @param {string} event - названия события
		* @param {error} error - ошибка, возникшая в обработчике.
		* @param {object} eventData - данные события.
		* @param {any} args - данные события, переданные в метод trigger.
		* @returns {void}
		*/
		handleError: __imp.addHandleError
	};
	
})(jQuery);
