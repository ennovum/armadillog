'use strict';

window.define && define(
	[
		'ennovum.Environment',
		'ennovum.Utils',
		'./core',
		'./layout'
	],
	function (mEnvironment, mUtils, mArmadillogCore, mArmadillogLayout) {
/* ==================================================================================================== */

// debug console logs switch
var DEBUG = false;

/**
 * Armadillog interface
 */
var iArmadillog = {
	contentClear: function () {},
	contentTextSet: function (text) {}
};

/**
 * Armadillog constructor
 */
var Armadillog = function Armadillog() {
	this.init.apply(this, arguments);
	var instance = mUtils.obj.implement({}, this, iArmadillog);
	return instance;
};

/**
 * Armadillog prototype
 */
Armadillog.prototype = {
	
	/**
	 * Initializes instance
	 * 
	 * @param {object} config configuration object
	 */
	init: function Armadillog_init(config) {
		DEBUG && console && console.log('Armadillog', 'init', arguments);
		
		switch (true) {
			case !this.browserCheck():
			case !this.configSet(config):
			case !this.dataInit():
				return false;
				break;
		}

		return true;
	},
	
	/**
	 * 
	 */
	browserCheck: function () {
		DEBUG && console && console.log('Armadillog', 'browserCheck', arguments);
		
		switch (true) {
			case !document.querySelector:
			case !window.File:
			case !window.FileReader:
			case !window.FileList:
			case !window.Blob:
			case !window.Array.prototype.some:
			case !window.Worker:
				console && console.error('Armadillog', 'browserCheck', 'unsupported browser');
				alert('You are using an uncompatible browser!');
				return false;
				break;
		}
		
		return true;
	},
	
	/**
	 * Initializes config
	 * 
	 * @param {object} config configuration object
	 */
	configSet: function (config) {
		DEBUG && console && console.log('Armadillog', 'configSet', arguments);
		
		switch (false) {
			case !!config:
			case typeof config === 'object':
				console && console.error('Armadillog', 'configSet', 'invalid input');
				return false;
		};
		
		this.config = {
			bodyEl: config.bodyEl || null,

			mainmenuInputEl: config.mainmenuInputEl || null,
			mainmenuFilterEl: config.mainmenuFilterEl || null,
			mainmenuExamineEl: config.mainmenuExamineEl || null,

			inputWrapperEl: config.inputWrapperEl || null,
			inputBoxEl: config.inputBoxEl || null,
			inputFoldEl: config.inputFoldEl || null,

			filterWrapperEl: config.filterWrapperEl || null,
			filterBoxEl: config.filterBoxEl || null,
			filterFoldEl: config.filterFoldEl || null,

			examineWrapperEl: config.examineWrapperEl || null,
			examineBoxEl: config.examineBoxEl || null,
			examineFoldEl: config.examineFoldEl || null,

			contentBoxEl: config.contentBoxEl || null,
			contentScrollEl: config.contentScrollEl || null,
			contentDropEl: config.contentDropEl || null
		};
		
		return true;
	},
	
	/**
	 * Initializes data
	 */
	dataInit: function Armadillog_dataInit() {
		DEBUG && console && console.log('Armadillog', 'dataInit', arguments);
		
		this.armadillogCore = new mArmadillogCore.ArmadillogCore(this.config);
		this.armadillogLayout = new mArmadillogLayout.ArmadillogLayout(this.config);
		
		return true;
	},
	
	/**
	 * Clears content
	 */
	contentClear: function Armadillog_contentClear() {
		DEBUG && console && console.log('Armadillog', 'contentClear', arguments);
		
		this.armadillogCore.contentClear();
		
		return true;
	},
	
	/**
	 * Sets a piece of source
	 * 
	 * @param {string} text a piece of source text
	 */
	contentTextSet: function Armadillog_contentTextSet(text, label) {
		DEBUG && console && console.log('Armadillog', 'contentTextSet', arguments);
		
		this.armadillogCore.contentTextSet(text, label);
		
		return true;
	},
	
	/**
	 * 
	 */
	toString: function Armadillog_toString() {
		return 'ennovum.Armadillog';
	}

};

/* ==================================================================================================== */
		return {
			'Armadillog': Armadillog,
			'iArmadillog': iArmadillog
		};
	});
