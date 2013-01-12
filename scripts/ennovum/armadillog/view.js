'use strict';

window.define && define(
	[
		'ennovum.Environment',
		'ennovum.Utils',
		'Handlebars'
	],
	function (mEnvironment, mUtils, Handlebars) {
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
	contentViewGet: function () {context},
	contentLineItemViewGet: function () {context}
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
		
		this.inputViewSource = '' +
			'<div class="input-clear-box">' +
				'<span class="textinput input-clear-label"></span>'+
				'<a href="#input-clear" class="button input-clear-button">Clear</a>' +
			'</div>' +
			'<div class="input-file-box">' +
				'<input type="file" class="input-file-input" style="position: absolute; left: -1000000px; top: -1000000px;" />' +
				'<a href="#input-file" class="button input-file-button">Import from file</a>' +
			'</div>' +
			'<div class="input-paste-box">' +
				'<textarea rows="10" cols="80" class="textinput input-paste-input"></textarea>' +
				'<a href="#input-paste" class="button input-paste-button">Paste</a>' +
			'</div>' +
			'<div class="input-url-box">' +
				'<input type="text" class="textinput input-url-input" />' +
				'<a href="#input-web" class="button input-url-button">Import from URL</a>' +
			'</div>' +
			'';
		
		this.inputViewTemplate = Handlebars.compile(this.inputViewSource);
		
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
		
		this.filterViewSource = '' +
			'<div class="filter-list hidden">' +
			'</div>' +
			'<div class="filter-button-box">' +
				'<a href="#filter-clear" class="button filter-button-clear">Clear</a>' +
				'<a href="#filter-add" class="button filter-button-add">New filter</a>' +
				'<a href="#filter-submit" class="button filter-button-submit">Submit filters</a>' +
			'</div>' +
			'';
			
		this.filterViewTemplate = Handlebars.compile(this.filterViewSource);

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
		
		this.filterItemViewSource = '' +
			'<div class="filter-item">' +
				'<div class="filter-header">' +
					'<div class="filter-title">Filter #{{id}}</div>' +
					'<div class="filter-mute">' +
						'<input type="checkbox" id="filter-{{id}}-mute-checkbox" class="filter-mute-checkbox" />' +
						'<label for="filter-{{id}}-mute-checkbox" class="filter-mute-label">Mute</label>' +
					'</div>' +
					'<a href="#filter-move-up" class="filter-move-up">Move up</a>' +
					'<a href="#filter-move-down" class="filter-move-down">Move down</a>' +
					'<a href="#filter-remove" class="filter-remove">Remove</a>' +
				'</div>' +
				'<div class="filter-affect-type-list">' +
					'{{#each filterAffectTypes}}' +
					'<div class="filter-affect-type-item">' +
						'<input id="filter-{{../id}}-affect-type-radio-{{this.value}}" name="filter-{{../id}}-affect-type-radio" type="radio" value="{{this.value}}" class="filter-affect-type-radio"{{#if this.default}} checked="checked"{{/if}} />' +
						'<label for="filter-{{../id}}-affect-type-radio-{{this.value}}" class="filter-affect-type-label">{{this.label}}</label>' +
					'</div>' +
					'{{/each}}' +
				'</div>' +
				'<div class="filter-value-box">' +
					'<input type="text" class="textinput filter-value-input" />' +
				'</div>' +
				'<div class="filter-value-type-list">' +
					'{{#each filterValueTypes}}' +
					'<div class="filter-value-type-item">' +
						'<input id="filter-{{../id}}-value-type-radio-{{this.value}}" name="filter-{{../id}}-value-type-radio" type="radio" value="{{this.value}}" class="filter-value-type-radio"{{#if this.default}} checked="checked"{{/if}} />' +
						'<label for="filter-{{../id}}-value-type-radio-{{this.value}}" class="filter-value-type-label">{{this.label}}</label>' +
					'</div>' +
					'{{/each}}' +
				'</div>' +
			'</div>' +
			'';
			
		this.filterItemViewTemplate = Handlebars.compile(this.filterItemViewSource);

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
		
		this.examineViewSource = '' +
			'<div class="examine-raw-box">' +
				'<div class="textinput examine-raw-content" contenteditable="true"></div>' +
			'</div>' +
			'<div class="examine-filtered-box">' +
				'<div class="textinput examine-filtered-content" contenteditable="true"></div>' +
			'</div>' +
			'';
			
		this.examineViewTemplate = Handlebars.compile(this.examineViewSource);

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
		
		this.contentViewSource = '' +
			'<div class="content-frame">' +
				'<div class="content-line-list">' +
				'</div>' +
			'</div>' +
			'';
			
		this.contentViewTemplate = Handlebars.compile(this.contentViewSource);

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
		
		this.contentLineItemViewSource = '' +
			'<div class="content-line-item" style="counter-increment: numeration {{number}};">' +
			'</div>' +
			'';
			
		this.contentLineItemViewTemplate = Handlebars.compile(this.contentLineItemViewSource);

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
