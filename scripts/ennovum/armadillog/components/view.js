'use strict';

window.define && define(
	[
		'ennovum.Environment',
		'ennovum.Utils',
		'Handlebars',
		'text!./../templates/input.html-template',
		'text!./../templates/filter.html-template',
		'text!./../templates/filter-item.html-template',
		'text!./../templates/examine.html-template',
		'text!./../templates/content.html-template',
		'text!./../templates/content-line-item.html-template'
	],
	function (
		mEnvironment,
		mUtils,
		Handlebars,
		templateInput,
		templateFilter,
		templateFilterItem,
		templateExamine,
		templateContent,
		templateContentLineItem
	) {
/* ==================================================================================================== */

// debug console logs switch
var DEBUG = false;

/**
 * ArmadillogView interface
 */
var iArmadillogView = {
	inputViewGet: function (context) {},
	filterViewGet: function (context) {},
	filterItemViewGet: function (context) {},
	examineViewGet: function (context) {},
	contentViewGet: function (context) {},
	contentLineItemViewGet: function (context) {}
};

/**
 * ArmadillogView constructor
 */
var ArmadillogView = function ArmadillogView() {
	this.init.apply(this, arguments);
	return mUtils.obj.implement({}, this, iArmadillogView);
};

/**
 * ArmadillogView prototype
 */
ArmadillogView.prototype = {

	/**
	 * Initializes instance
	 *
	 * @param {object} config configuration object
	 */
	init: function ArmadillogView_init(config) {
		DEBUG && console && console.log('ArmadillogView', 'init', arguments);

		switch (true) {
			case !this.viewInit():
				return false;
				break;
		}

		return true;
	},

	/**
	 * Inits view
	 */
	viewInit: function () {
		DEBUG && console && console.log('ArmadillogView', 'viewInit', arguments);

		switch (true) {
			case !this.inputViewInit():
			case !this.filterViewInit():
			case !this.filterItemViewCreate():
			case !this.examineViewInit():
			case !this.contentViewInit():
			case !this.contentLineItemViewInit():
				return false;
				break;
		}

		return true;
	},

	/**
	 * Inits input view
	 */
	inputViewInit: function () {
		DEBUG && console && console.log('ArmadillogView', 'inputViewInit', arguments);

		this.inputViewTemplate = Handlebars.compile(templateInput);

		return true;
	},

	/**
	 * Returns input view
	 *
	 * @param {object} context context object
	 */
	inputViewGet: function (context) {
		DEBUG && console && console.log('ArmadillogView', 'inputViewGet', arguments);

		var containerEl = mUtils.dom.createElement('div');
		containerEl.innerHTML = this.inputViewTemplate(context);

		return {
			'clearBoxEl': containerEl.querySelector('.input-clear-box'),
			'clearLabelEl': containerEl.querySelector('.input-clear-label'),
			'clearButtonEl': containerEl.querySelector('.input-clear-button'),
			'fileBoxEl': containerEl.querySelector('.input-file-box'),
			'fileInputEl': containerEl.querySelector('.input-file-input'),
			'fileButtonEl': containerEl.querySelector('.input-file-button'),
			'pasteBoxEl': containerEl.querySelector('.input-paste-box'),
			'pasteInputEl': containerEl.querySelector('.input-paste-input'),
			'pasteButtonEl': containerEl.querySelector('.input-paste-button'),
			'urlBoxEl': containerEl.querySelector('.input-url-box'),
			'urlInputEl': containerEl.querySelector('.input-url-input'),
			'urlButtonEl': containerEl.querySelector('.input-url-button')
		};
	},

	/**
	 * Inits filter view
	 */
	filterViewInit: function () {
		DEBUG && console && console.log('ArmadillogView', 'filterViewInit', arguments);

		this.filterViewTemplate = Handlebars.compile(templateFilter);

		return true;
	},

	/**
	 * Returns filter view
	 *
	 * @param {object} context context object
	 */
	filterViewGet: function (context) {
		DEBUG && console && console.log('ArmadillogView', 'filterViewGet', arguments);

		var containerEl = mUtils.dom.createElement('div');
		containerEl.innerHTML = this.filterViewTemplate(context);

		return {
			'listEl': containerEl.querySelector('.filter-list'),
			'buttonBoxEl': containerEl.querySelector('.filter-button-box'),
			'clearButtonEl': containerEl.querySelector('.filter-button-clear'),
			'addButtonEl': containerEl.querySelector('.filter-button-add'),
			'submitButtonEl': containerEl.querySelector('.filter-button-submit'),
		};
	},

	/**
	 * Inits filter item view
	 */
	filterItemViewCreate: function () {
		DEBUG && console && console.log('ArmadillogView', 'filterItemViewCreate', arguments);

		this.filterItemViewTemplate = Handlebars.compile(templateFilterItem);

		return true;
	},

	/**
	 * Returns filter item view
	 *
	 * @param {object} context context object
	 */
	filterItemViewGet: function (context) {
		DEBUG && console && console.log('ArmadillogView', 'filterItemViewGet', arguments);

		var containerEl = mUtils.dom.createElement('div');
		containerEl.innerHTML = this.filterItemViewTemplate(context);

		var filterItemAffectTypeList = [];
		for (var i = 0, l = context.filterAffectTypes.length; i < l; i++) {
			filterItemAffectTypeList.push({
				'el': containerEl.querySelectorAll('.filter-affect-type-item')[i],
				'radioEl': containerEl.querySelectorAll('.filter-affect-type-radio')[i],
				'labelEl': containerEl.querySelectorAll('.filter-affect-type-label')[i],
			});
		}

		var filterItemValueTypeList = [];
		for (var i = 0, l = context.filterValueTypes.length; i < l; i++) {
			filterItemValueTypeList.push({
				'el': containerEl.querySelectorAll('.filter-value-type-item')[i],
				'radioEl': containerEl.querySelectorAll('.filter-value-type-radio')[i],
				'labelEl': containerEl.querySelectorAll('.filter-value-type-label')[i],
			});
		}

		return {
			'el': containerEl.querySelector('.filter-item'),
			'headerEl': containerEl.querySelector('.filter-header'),
			'titleEl': containerEl.querySelector('.filter-title'),
			'muteEl': containerEl.querySelector('.filter-mute'),
			'muteCheckboxEl': containerEl.querySelector('.filter-mute-checkbox'),
			'muteLabelEl': containerEl.querySelector('.filter-mute-label'),
			'moveUpEl': containerEl.querySelector('.filter-move-up'),
			'moveDownEl': containerEl.querySelector('.filter-move-down'),
			'removeEl': containerEl.querySelector('.filter-remove'),
			'affectTypeListEl': containerEl.querySelector('.filter-affect-type-list'),
			'affectTypeList': filterItemAffectTypeList,
			'valueBoxEl': containerEl.querySelector('.filter-value-box'),
			'valueInputEl': containerEl.querySelector('.filter-value-input'),
			'valueTypeListEl': containerEl.querySelector('.filter-value-type-list'),
			'valueTypeList': filterItemValueTypeList
		};
	},

	/**
	 * Inits examine view
	 */
	examineViewInit: function () {
		DEBUG && console && console.log('ArmadillogView', 'examineViewInit', arguments);

		this.examineViewTemplate = Handlebars.compile(templateExamine);

		return true;
	},

	/**
	 * Returns examine view
	 *
	 * @param {object} context context object
	 */
	examineViewGet: function (context) {
		DEBUG && console && console.log('ArmadillogView', 'examineViewGet', arguments);

		var containerEl = mUtils.dom.createElement('div');
		containerEl.innerHTML = this.examineViewTemplate(context);

		return {
			'rawBoxEl': containerEl.querySelector('.examine-raw-box'),
			'rawContentEl': containerEl.querySelector('.examine-raw-content'),
			'filteredBoxEl': containerEl.querySelector('.examine-filtered-box'),
			'filteredContentEl': containerEl.querySelector('.examine-filtered-content')
		};
	},

	/**
	 * Inits content view
	 */
	contentViewInit: function () {
		DEBUG && console && console.log('ArmadillogView', 'contentViewInit', arguments);

		this.contentViewTemplate = Handlebars.compile(templateContent);

		return true;
	},

	/**
	 * Returns content view
	 *
	 * @param {object} context context object
	 */
	contentViewGet: function (context) {
		DEBUG && console && console.log('ArmadillogView', 'contentViewGet', arguments);

		var containerEl = mUtils.dom.createElement('div');
		containerEl.innerHTML = this.contentViewTemplate(context);

		return {
			'frameEl': containerEl.querySelector('.content-frame'),
			'lineListEl': containerEl.querySelector('.content-line-list')
		};
	},

	/**
	 * Inits content line view
	 */
	contentLineItemViewInit: function () {
		DEBUG && console && console.log('ArmadillogView', 'contentLineItemViewInit', arguments);

		this.contentLineItemViewTemplate = Handlebars.compile(templateContentLineItem);

		return true;
	},

	/**
	 * Returns content line view
	 *
	 * @param {object} context context object
	 */
	contentLineItemViewGet: function (context) {
		DEBUG && console && console.log('ArmadillogView', 'contentLineItemViewGet', arguments);

		var containerEl = mUtils.dom.createElement('div');
		containerEl.innerHTML = this.contentLineItemViewTemplate(context);

		return {
			'el': containerEl.querySelector('.content-line-item')
		};
	},

	/**
	 *
	 */
	toString: function ArmadillogView_toString() {
		return 'ennovum.ArmadillogView';
	}

};

/* ==================================================================================================== */
		return {
			'ArmadillogView': ArmadillogView,
			'iArmadillogView': iArmadillogView
		};
	});
