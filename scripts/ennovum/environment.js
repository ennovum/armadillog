'use strict';

window.define && define(
	[],
	function () {
/* ==================================================================================================== */

// html tag class 'no-js' to be removed
var HtmlEl = document.querySelector('html');
HtmlEl.className = HtmlEl.className.replace('no-js', '');

// function.prototype.bind (from developer.mozilla.org)
if (!Function.prototype.bind) {
	Function.prototype.bind = function (oThis) {
		if (typeof this !== "function") {
			// closest thing possible to the ECMAScript 5 internal IsCallable function
			throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
		}
 
		var aArgs = Array.prototype.slice.call(arguments, 1),
			fToBind = this,
			fNOP = function () {},
			fBound = function () {
				return fToBind.apply(
					this instanceof fNOP && oThis ? this : oThis,
					aArgs.concat(Array.prototype.slice.call(arguments)));
			};
 
		fNOP.prototype = this.prototype;
		fBound.prototype = new fNOP();
 
		return fBound;
	};
}

if (!window.BlobBuilder) {
	window.BlobBuilder = window.BlobBuilder || window.MozBlobBuilder || window.WebKitBlobBuilder;
}

if (!window.URL) {
	window.URL = window.URL || window.webkitURL;
}

/* ==================================================================================================== */
		return null;
	});
