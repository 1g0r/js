'use strict';
(function (d) {
	Object.defineProperty(window, '$$', {
		enumerable: false,
		value: new HtmlBuilder()
	});

	function HtmlBuilder() {
		return {
			div: function (attr) {
				return new $$Element('div', attr || {});
			},

			form: function (attr) {
				return new $$Element('form', attr || {});
			},

			label: function (attr) {
				return new $$Element('label', attr || {});
			},

			input: function (attr) {
				return new Input(attr || {});
			},

			textarea: function (attr) {
				return new $$Element('textarea', attr || {});
			},

			button: function (attr) {
				return new $$Element('button', attr || {});
			},

			table: function (attr) {
				return new $$Element('table', attr || {});
			},

			thead: function (attr) {
				return new $$Element('thead', attr || {});
			},

			tbody: function (attr) {
				return new $$Element('tbody', attr || {});
			},

			tr: function (attr) {
				return new $$Element('tr', attr || {});
			},

			th: function (attr) {
				return new $$Element('th', attr || {});
			},

			td: function (attr) {
				return new $$Element('td', attr || {});
			},

			span: function (attr) {
				return new $$Element('span', attr || {});
			},

			ul: function (attr) {
				return new $$Element('ul', attr || {});
			},

			li: function (attr) {
				return new $$Element('li', attr || {});
			},

			a: function (attr) {
				return new $$Element('a', attr || {});
			},

			select: function (attr) {
				return new $$Element('select', attr || {});
			},

			option: function (attr) {
				return new $$Element('option', attr || {});
			},

			img: function (attr) {
				return new $$Element('img', attr || {});
			},

			pre: function (attr) {
				return new $$Element('pre', attr || {});
			}
		};
	}

	var attributeSetters = {
		'children': function (element, arr) {
			if (!arr.isArray()) {
				return;
			}
			if (arr.length > 1) {
				element.children = arr;
			}
			arr.forEach(child => {
				if (child.isObject()) {
					element.el.appendChild(child.el || child);
				}
			});
		},
		'text': function (element, value) {
			if (value !== null && value !== undefined) {
				element.el.innerText = value.toString();
			}
		},
		'style': function (element, style) {
			if (style && style.isObject()) {
				Object.keys(style).forEach(function (x) {
					element.el.style[x] = style[x];
				});
			}
		},
		'click': function (element, fn) {
			if (fn && fn.isFunction()) {
				element.el.addEventListener('click', function (e) { fn.call(element, e); });
			}
		},
		'change': function (element, fn) {
			if (fn && fn.isFunction()) {
				element.el.addEventListener('change', function (e) { fn.call(element, e) });
			}
		}
	};

	// $$ELEMENT
	function $$Element(tagName, props) {
		var self = this;

		var el = d.createElement(tagName);
		Object.defineProperty(self, 'el', {
			enumerable: false,
			configurable: false,
			get: function () {
				return el;
			}
		});

		Object.defineProperty(self, '_hidden', {
			enumerable: false,
			configurable: false,
			writable: true,
			value: false
		});

		Object.defineProperty(self, '_oldDisplay', {
			enumerable: false,
			configurable: false,
			writable: true,
			value: ''
		});

		Object.keys(props).forEach(function (propName) {
			var prop = props[propName];
			if (propName === 'store') {
				self.store = prop;
			} else if (prop instanceof $$Element) {
				if (prop.store) {
					self[propName] = prop;
					delete prop.store;
				} else {
					moveProps(self, prop);
				}
				self.append(prop);
			} else if (attributeSetters[propName]) {
				attributeSetters[propName](self, prop);
			} else {
				el.setAttribute(propName, prop);
			}
		});

		function moveProps(parent, obj) {
			Object.keys(obj).forEach(function (propName) {
				var prop = obj[propName];
				if (prop instanceof $$Element) {
					parent[propName] = prop;
				}
			});
		}
	}

	$$Element.prototype.show = function () {
		this.el.style.display = this._oldDisplay;
		this._hidden = false;
		return this;
	};

	$$Element.prototype.hide = function () {
		if (this.el.style.display !== 'none') {
			this._hidden = true;
			this._oldDisplay = this.el.style.display;
			this.el.style.display = 'none';
		}
		return this;
	};

	$$Element.prototype.toggle = function () {
		if (this._hidden) {
			this.show();
		} else {
			this.hide();
		}
	};

	$$Element.prototype.appendTo = function (container) {
		if (container.appendChild) {
			container.appendChild(this.el);
		} else if (container.append) {
			container.append(this.el);
		}
		return this;
	};

	$$Element.prototype.append = function () {
		if (arguments.length > 0) {
			attributeSetters.children(
				this,
				[].slice.call(arguments).where(function (x) { return !!x; }).toArray()
			);
		}
		return this;
	}

	$$Element.prototype.val = function (value) {
		if (typeof value === 'boolean' || value || value === '') {
			this.el.value = value + '';
			return this;
		} else {
			var result = this.el.value;
			return (result === null || result === undefined) ? '' : result + '';
		}
	};

	$$Element.prototype.click = function (fn) {
		attributeSetters.click(this, fn);
		return this;
	}

	$$Element.prototype.change = function (fn) {
		attributeSetters.change(this, fn);
		return this;
	}

	$$Element.prototype.text = function (value) {
		attributeSetters.text(this, value);
		return this;
	}

	$$Element.prototype.get$ = function () {
		return $(this.el);
	}

	$$Element.prototype.removeClass = function (name) {
		if (name && name.isString()) {
			this.el.classList.remove(name);
		}
		return this;
	}

	$$Element.prototype.addClass = function (name) {
		if (name && name.isString()) {
			this.el.classList.add(name);
		}
		return this;
	}

	$$Element.prototype.empty = function () {
		this.el.innerHTML = '';
		return this;
	};

	$$Element.prototype.attr = function (name) {
		if (name && name.isString()) {
			return this.el.getAttribute(name);
		}
		return '';
	}

	$$Element.prototype.scrollTop = function (val) {
		this.el.scrollTo(0, 0);
		return this;
	}

	$$Element.prototype.focus = function () {
		this.el.focus();
		return this;
	}

	$$Element.prototype.html = function (html) {
		this.el.innerHTML = html;
		return this;
	}

	$$Element.prototype.disable = function () {
		this.el.disabled = true;
		return this;
	}

	$$Element.prototype.enable = function () {
		this.el.disabled = false;
		return this;
	}


	function Input(attrs) {
		attrs = attrs.setDefaults({
			type: 'text'
		});
		Object.setPrototypeOf(this, new $$Element('input', attrs));
	}
})(
	document
);
