'use strict';
(function (d, app, $) {
	app.HtmlBuilder = {
		div: function (attrs) {
			return new Div(attrs);
		},

		form: function (attrs) {
			return new Form(attrs || {});
		},

		label: function (attrs) {
			return new Label(attrs || {});
		},

		input: function (attrs) {
			return new Input(attrs || {});
		},

		textarea: function (attrs) {
			return new Textarea(attrs || {});
		},

		button: function (attrs) {
			return new Button(attrs || {});
		},

		table: function (attrs) {
			return new Table(attrs || {});
		},

		thead: function (attrs) {
			return new Element('thead', attrs || {});
		},

		tbody: function (attrs) {
			return new Element('tbody', attrs || {});
		},

		tr: function (attrs) {
			return new Element('tr', attrs || {});
		},

		th: function (attrs) {
			return new Element('th', attrs || {});
		},

		td: function (attrs) {
			return new Element('td', attrs || {});
		},

		span: function (attrs) {
			return new Element('span', attrs || {});
		},

		ul: function (attrs) {
			return new Element('ul', attrs || {});
		},

		li: function (attrs) {
			return new Element('li', attrs || {});
		},

		a: function (attrs) {
			return new Element('a', attrs || {});
		}
	};


	var attributeSetters = {
		'children': function (el, arr) {
			if (!arr.isArray()) {
				return;
			}
			arr.forEach(child => {
				if (child.isObject() && child.el) {
					el.appendChild(child.el);
				}
			});
		},
		'text': function (el, value) {
			if (value.isString()) {
				el.innerText = value;
			}
		},
		'style': function (el, style) {
			if (style && style.isObject()) {
				Object.keys(style).forEach(function (x) {
					el.style[x] = style[x];
				});
			}
		},
		'click': function (el, fn) {
			if (fn && fn.isFunction()) {
				el.addEventListener('click', fn);
			}
		}
	};

	// ELEMENT
	function Element(tagName, attrs) {
		var el = d.createElement(tagName);
		this.foo = '';

		Object.defineProperty(this, 'el', {
			enumerable: false,
			configurable: false,
			get: function () {
				return el;
			}
		});

		if (attrs.isObject()) {
			Object.keys(attrs).forEach(function (name) {
				if (attributeSetters[name]) {
					attributeSetters[name](el, attrs[name]);
				} else {
					el.setAttribute(name, attrs[name]);
				}
				delete attrs[name];
			});
		}

		var oldDisplay = '';
		this.show = function () {
			this.el.style.display = oldDisplay;
			return this;
		};

		this.hide = function () {
			if (this.el.style.display !== 'none') {
				oldDisplay = this.el.style.display;
				this.el.style.display = 'none';
			}
			return this;
		};
	}

	Element.prototype.appendTo = function (container) {
		container.appendChild(this.el);
		return this;
	};

	Element.prototype.append = function () {
		if (arguments.length > 0) {
			attributeSetters.children(this.el, [].slice.call(arguments));
		}
		return this;
	}

	Element.prototype.val = function (value) {
		if ((value || value === '') && value.isString()) {
			this.el.value = value;
			return this;
		}
		return this.el.value;
	};

	Element.prototype.click = function (fn) {
		if (fn.isFunction()) {
			this.el.addEventListener('click', fn);
		}
		return this;
	}

	Element.prototype.text = function (value) {
		if (value && value.isString()) {
			this.el.innerText = value;
		}
	}

	Element.prototype.get$ = function () {
		return $(this.el);
	}

	Element.prototype.removeClass = function (name) {
		if (name && name.isString()) {
			this.el.classList.remove(name);
		}
		return this;
	}

	Element.prototype.addClass = function (name) {
		if (name && name.isString()) {
			this.el.classList.add(name);
		}
		return this;
	}

	Element.prototype.to = function (obj, name) {
		if (obj && obj.isObject()) {
			if (name && name.isString()) {
				obj[name] = this;
			}
		}
		return this;
	}

	function Div(attrs) {
		Object.setPrototypeOf(this, new Element('div', attrs));
	}

	function Form(attrs) {
		Object.setPrototypeOf(this, new Element('form', attrs));
	}

	function Label(attrs) {
		Object.setPrototypeOf(this, new Element('label', attrs));
	}

	function Input(attrs) {
		attrs = attrs.setDefaults({
			type: 'text'
		});
		Object.setPrototypeOf(this, new Element('input', attrs));
	}

	function Textarea(attrs) {
		Object.setPrototypeOf(this, new Element('textarea', attrs));
	}

	function Button(attrs) {
		Object.setPrototypeOf(this, new Element('button', attrs));
	}

	function Table(attrs) {
		Object.setPrototypeOf(this, new Element('table', attrs));
	}

	Table.prototype.thead = function (attrs) {
		var thead = new Element('thead', attrs);
		this.append(thead);
		return thead;
	}

})(
	document,
	Namespace('App'),
	jQuery
);
