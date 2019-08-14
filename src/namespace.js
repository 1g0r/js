"use strict";
function Namespace(name) {
	if (typeof name === "string" && name.length > 0) {
		_buildNamespace(window, name.split('.'));
		return _buildNamespace.last;
	}
	return {};
};

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
