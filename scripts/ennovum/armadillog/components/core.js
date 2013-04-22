'use strict';

window.define && define(
	[
		'ennovum.Environment',
		'ennovum.Utils',
		'ennovum.Model',
		'ennovum.Worker',
		'./view'
	],
	function (mEnvironment, mUtils, mModel, mWorker, mArmadillogView) {
/* ==================================================================================================== */

// debug console logs switch
var DEBUG = false;

/**
 * ArmadillogCore interface
 */
var iArmadillogCore = {
	contentClear: function () {},
	contentTextSet: function (text) {}
};

/**
 * ArmadillogCore constructor
 */
var ArmadillogCore = function ArmadillogCore() {
	this.init.apply(this, arguments);
	var instance = mUtils.obj.implement({}, this, iArmadillogCore);
	return instance;
};

/**
 * ArmadillogCore prototype
 */
ArmadillogCore.prototype = {

	HIDDEN_CLASS: 'hidden',

	FILTER_AFFECT_TYPE_SHOW_LINE: '1',
	FILTER_AFFECT_TYPE_SHOW: '2',
	FILTER_AFFECT_TYPE_HIDE_LINE: '3',
	FILTER_AFFECT_TYPE_HIDE: '4',
	FILTER_AFFECT_TYPE_HIGHLIGHT_LINE: '5',
	FILTER_AFFECT_TYPE_HIGHLIGHT: '6',

	FILTER_VALUE_TYPE_TEXT: '1',
	FILTER_VALUE_TYPE_REGEXP: '2',

	FILTER_LIST_STORAGE_NAME: 'filterList',

	FILTER_TAG_FILTERED_BEGIN_SYMBOL: '\uff00\uff80',
	FILTER_TAG_FILTERED_END_SYMBOL: '\uff01\uff81',
	FILTER_TAG_FILTERED_BEGIN_HTML: '<span class="filtered">',
	FILTER_TAG_FILTERED_END_HTML: '</span>',
	FILTER_TAG_HIGHLIGHT_BEGIN_SYMBOL: '\uff02\uff82',
	FILTER_TAG_HIGHLIGHT_END_SYMBOL: '\uff03\uff83',
	FILTER_TAG_HIGHLIGHT_BEGIN_HTML: '<span class="highlight">',
	FILTER_TAG_HIGHLIGHT_END_HTML: '</span>',

	CONTENT_OVERFLOW_CHUNK_SIZE: 1000,
	CONTENT_OVERFLOW_DELAY: 200,

	CONTENT_FILE_UPDATE_DELAY: 1000,
	CONTENT_URL_UPDATE_DELAY: 1000,

	CONTENT_TAILING_DELAY: 1000,

	/**
	 * Initializes instance
	 *
	 * @param {object} config configuration object
	 */
	init: function ArmadillogCore_init(config) {
		DEBUG && console.log('ArmadillogCore', 'init', arguments);

		switch (true) {
			case !this.browserCheck():
			case !this.configSet(config):
			case !this.dataInit():
			case !this.viewInit():
			case !this.uiInit():
			case !this.storageInit():
				return false;
				break;
		}

		return true;
	},

	/**
	 *
	 */
	browserCheck: function ArmadillogCore_browserCheck() {
		DEBUG && console.log('ArmadillogCore', 'browserCheck', arguments);

		switch (true) {
			case !document.querySelector:
			case !window.File:
			case !window.FileReader:
			case !window.FileList:
			case !window.Blob:
			case !window.Array.prototype.some:
			case !window.Worker:
			case !window.URL || !window.URL.createObjectURL:
			case !window.localStorage:
				console.error('ArmadillogCore', 'browserCheck', 'unsupported browser');
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
	configSet: function ArmadillogCore_configSet(config) {
		DEBUG && console.log('ArmadillogCore', 'configSet', arguments);

		switch (false) {
			case !!config:
			case typeof config === 'object':
				console.error('ArmadillogCore', 'configSet', 'invalid input');
				return false;
		};

		this.config = {
			bodyEl: config.bodyEl || null,
			inputBoxEl: config.inputBoxEl || null,
			filterBoxEl: config.filterBoxEl || null,
			examineBoxEl: config.examineBoxEl || null,
			contentBoxEl: config.contentBoxEl || null,
			contentScrollEl: config.contentScrollEl || null,
			contentDropEl: config.contentDropEl || null
		};

		return true;
	},

	/**
	 * Initializes data
	 */
	dataInit: function ArmadillogCore_dataInit() {
		DEBUG && console.log('ArmadillogCore', 'dataInit', arguments);

		switch (true) {
			case !this.inputDataInit():
			case !this.filterDataInit():
			case !this.examineDataInit():
			case !this.contentDataInit():
			case !this.busyDataInit():
				return false;
				break;
		}

		return true;
	},

	/**
	 * Initializes view
	 */
	viewInit: function ArmadillogCore_viewInit() {
		DEBUG && console.log('ArmadillogCore', 'viewInit', arguments);

		this.armadillogView = new mArmadillogView.ArmadillogView();

		this.bodyEl = this.config.bodyEl;

		switch (true) {
			case !this.inputViewCreate():
			case !this.filterViewCreate():
			case !this.examineViewCreate():
			case !this.contentViewCreate():
				return false;
				break;
		}

		return true;
	},

	/**
	 * Initializes UI
	 */
	uiInit: function ArmadillogCore_uiInit() {
		DEBUG && console.log('ArmadillogCore', 'uiInit', arguments);

		switch (true) {
			case !this.inputUiInit():
			case !this.filterUiInit():
			case !this.examineUiInit():
			case !this.contentUiInit():
				return false;
				break;
		}

		return true;
	},

	/**
	 * Initializes storage
	 */
	storageInit: function ArmadillogCore_storageInit() {
		DEBUG && console.log('ArmadillogCore', 'storageInit', arguments);

		switch (true) {
			case !this.filterStorageInit():
				return false;
				break;
		}

		return true;
	},

	/**
	 * Initializes input data
	 */
	inputDataInit: function ArmadillogCore_inputDataInit() {
		DEBUG && console.log('ArmadillogCore', 'inputDataInit', arguments);

		// nothing

		return true;
	},

	/**
	 * Creates input view structure
	 */
	inputViewCreate: function ArmadillogCore_inputViewCreate() {
		DEBUG && console.log('ArmadillogCore', 'inputViewCreate', arguments);

		this.inputBoxEl = this.config.inputBoxEl;
		if (!this.inputBoxEl) {
			console.error('ArmadillogCore', 'inputViewCreate', 'invalid inputBoxEl');
			return false;
		};

		this.inputView = this.armadillogView.inputViewGet();
		this.inputBoxEl.appendChild(this.inputView.clearBoxEl);
		this.inputBoxEl.appendChild(this.inputView.fileBoxEl);
		this.inputBoxEl.appendChild(this.inputView.pasteBoxEl);
		this.inputBoxEl.appendChild(this.inputView.urlBoxEl);

		return this.inputView;
	},

	/**
	 * Initializes input UI
	 */
	inputUiInit: function ArmadillogCore_inputUiInit() {
		DEBUG && console.log('ArmadillogCore', 'inputUiInit', arguments);

		this.inputView.clearButtonEl.addEventListener(
			'click',
			function ArmadillogCore_inputUiInit_inputClearButtonElClickHandler(evt) {
				if (!this.busy && confirm('Are you sure?')) {
					this.contentClear();
				}

				evt.preventDefault();
				evt.stopPropagation();
			}.bind(this));

		this.inputView.fileInputEl.addEventListener(
			'change',
			function ArmadillogCore_inputUiInit_inputFileInputElChangeHandler(evt) {
				if (!this.busy) {
					var files = evt.target.files;
					if (files.length) {
						this.contentClear();
						this.contentFileSet(files[0], files[0].name);
					}
				}

				evt.preventDefault();
				evt.stopPropagation();
			}.bind(this));

		this.inputView.fileButtonEl.addEventListener(
			'click',
			function ArmadillogCore_inputUiInit_inputFileButtonElClickHandler(evt) {
				if (!this.busy) {
					this.inputView.fileInputEl.click();
				}

				evt.preventDefault();
				evt.stopPropagation();
			}.bind(this));

		this.inputView.pasteButtonEl.addEventListener(
			'click',
			function ArmadillogCore_inputUiInit_inputPasteButtonElClickHandler(evt) {
				if (!this.busy && this.inputView.pasteInputEl.value) {
					this.contentClear();
					this.contentTextSet(this.inputView.pasteInputEl.value, '(pasted text)');
					this.inputView.pasteInputEl.value = '';
				}

				evt.preventDefault();
				evt.stopPropagation();
			}.bind(this));

		this.inputView.urlInputEl.addEventListener(
			'keypress',
			function ArmadillogCore_inputUrlInputEl_inputUrlInputElKeypressHandler(evt) {
				if (evt.keyCode === 13) {
					this.inputView.urlButtonEl.click();

					evt.preventDefault();
					evt.stopPropagation();
				}
			}.bind(this));

		this.inputView.urlButtonEl.addEventListener(
			'click',
			function ArmadillogCore_inputUiInit_inputUrlButtonElClickHandler(evt) {
				if (!this.busy && this.inputView.urlInputEl.value) {
					this.contentClear();
					this.contentUrlSet(this.inputView.urlInputEl.value, this.inputView.urlInputEl.value);
					this.inputView.urlInputEl.value = '';
				}

				evt.preventDefault();
				evt.stopPropagation();
			}.bind(this));

		return true;
	},

	/**
	 * Initializes filter data
	 */
	filterDataInit: function ArmadillogCore_filterDataInit() {
		DEBUG && console.log('ArmadillogCore', 'filterDataInit', arguments);

		this.filterItemIdSeq = 1;

		this.filterMList = new mModel.ModelList();

		this.filterAffectTypes = [
			{
				'value': this.FILTER_AFFECT_TYPE_SHOW_LINE,
				'label': 'Show only lines',
				'default': true
			},
			{
				'value': this.FILTER_AFFECT_TYPE_SHOW,
				'label': 'Show only fragments'
			},
			{
				'value': this.FILTER_AFFECT_TYPE_HIDE_LINE,
				'label': 'Hide lines'
			},
			{
				'value': this.FILTER_AFFECT_TYPE_HIDE,
				'label': 'Hide fragments'
			},
			{
				'value': this.FILTER_AFFECT_TYPE_HIGHLIGHT_LINE,
				'label': 'Highlight line'
			},
			{
				'value': this.FILTER_AFFECT_TYPE_HIGHLIGHT,
				'label': 'Highlight fragment'
			}
		];

		this.filterValueTypes = [
			{
				'value': this.FILTER_VALUE_TYPE_TEXT,
				'label': 'Plain text',
				'default': true
			},
			{
				'value': this.FILTER_VALUE_TYPE_REGEXP,
				'label': 'Regular expression'
			}
		];

		return true;
	},

	/**
	 * Creates filter view structure
	 */
	filterViewCreate: function ArmadillogCore_filterViewCreate() {
		DEBUG && console.log('ArmadillogCore', 'filterViewCreate', arguments);

		this.filterBoxEl = this.config.filterBoxEl;
		if (!this.filterBoxEl) {
			console.error('ArmadillogCore', 'filterViewCreate', 'invalid filterBoxEl');
			return false;
		};

		this.filterView = this.armadillogView.filterViewGet();
		this.filterBoxEl.appendChild(this.filterView.listEl);
		this.filterBoxEl.appendChild(this.filterView.buttonBoxEl);

		return this.filterView;
	},

	/**
	 * Initializes filter UI
	 */
	filterUiInit: function ArmadillogCore_filterUiInit() {
		DEBUG && console.log('ArmadillogCore', 'filterUiInit', arguments);

		this.filterView.clearButtonEl.addEventListener(
			'click',
			function ArmadillogCore_inputUiInit_filterClearButtonElClickHandler(evt) {
				if (!this.busy && confirm('Are you sure?')) {
					this.filterClear();
				}

				evt.preventDefault();
				evt.stopPropagation();
			}.bind(this));

		this.filterView.addButtonEl.addEventListener(
			'click',
			function ArmadillogCore_inputUiInit_filterAddButtonElClickHandler(evt) {
				if (!this.busy) {
					var filterItemMMap = this.filterItemCreate();
					this.filterMList.push(filterItemMMap);

					this.filterView.listEl.scrollTop = this.filterView.listEl.scrollHeight;
					filterItemMMap.get('view').valueInputEl.focus();
				}

				evt.preventDefault();
				evt.stopPropagation();
			}.bind(this));

		this.filterView.submitButtonEl.addEventListener(
			'click',
			function ArmadillogCore_inputUiInit_filterSubmitButtonElClickHandler(evt) {
				if (!this.busy) {
					this.filterSubmit();
				}

				evt.preventDefault();
				evt.stopPropagation();
			}.bind(this));

		this.filterMList.on(
			'model-insert',
			function ArmadillogCore_inputUiInit_filterMListInsertHandler(evt, dataList) {
				var filterDataList = [];

				for (var i = 0, l = dataList.length; i < l; i++) {
					filterDataList.push({
						'filterIndex': dataList[i].index,
						'filterItemMMap': dataList[i].valueNew
					});
				}

				this.filterViewListInsert(filterDataList);

				mUtils.dom.classDepend(this.filterView.listEl, this.HIDDEN_CLASS, this.filterMList.length() === 0);
			}.bind(this));

		this.filterMList.on(
			'model-update',
			function ArmadillogCore_inputUiInit_filterMListUpdateHandler(evt, dataList) {
				var filterDataList = [];

				for (var i = 0, l = dataList.length; i < l; i++) {
					filterDataList.push({
						'filterIndex': dataList[i].index,
						'filterItemMMap': dataList[i].valueNew
					});
				}

				this.filterViewListUpdate(filterDataList);
			}.bind(this));

		this.filterMList.on(
			'model-delete',
			function ArmadillogCore_inputUiInit_filterMListDeleteHandler(evt, dataList) {
				var filterDataList = [];

				for (var i = 0, l = dataList.length; i < l; i++) {
					filterDataList.push({
						'filterIndex': dataList[i].index,
						'filterItemMMap': dataList[i].valueOld
					});
				}

				this.filterViewListDelete(filterDataList);

				mUtils.dom.classDepend(this.filterView.listEl, this.HIDDEN_CLASS, this.filterMList.length() === 0);
			}.bind(this));

		this.filterMList.on(
			'model-forward',
			function ArmadillogCore_inputUiInit_filterMListForwardHandler(evt, dataList) {
				var filterDataList = [];

				for (var i = 0, l = dataList.length; i < l; i++) {
					var update = dataList[i].dataList.some(function (dataItem) {
						return ~['mute', 'affectType', 'value', 'valueType'].indexOf(dataItem.key);
					});

					if (update) {
						filterDataList.push({
							'filterIndex': dataList[i].index,
							'filterItemMMap': dataList[i].valueNew
						});
					}
				}

				if (filterDataList.length) {
					this.filterViewListUpdate(filterDataList);
				}
			}.bind(this));

		return true;
	},

	/**
	 * Initializes filter storage
	 */
	filterStorageInit: function ArmadillogCore_filterStorageInit() {
		DEBUG && console.log('ArmadillogCore', 'filterStorageInit', arguments);

		this.filterStorageLoad();

		return true;
	},

	/**
	 * Creates a filter item
	 *
	 * @param {object} data filter item data
	 */
	filterItemCreate: function ArmadillogCore_filterItemCreate(data) {
		DEBUG && console.log('ArmadillogCore', 'filterItemCreate', arguments);

		if (!data || typeof data !== 'object') {
			data = {};
		}

		var filterItemMMap = new mModel.ModelMap();
		filterItemMMap.set(
			'id',
			this.filterItemIdSeq++,
			'mute',
			'mute' in data ? data.mute : false,
			'affectType',
			'affectType' in data ? data.affectType : this.FILTER_AFFECT_TYPE_SHOW_LINE,
			'value',
			'value' in data ? data.value : '',
			'valueType',
			'valueType' in data ? data.valueType : this.FILTER_VALUE_TYPE_TEXT);

		filterItemMMap.set(
			'view',
			this.filterItemViewCreate(filterItemMMap));

		return filterItemMMap;
	},

	/**
	 * Creates a filter item view stricture
	 *
	 * @param {object} filterItemMMap filter item data
	 */
	filterItemViewCreate: function ArmadillogCore_filterItemViewCreate(filterItemMMap) {
		DEBUG && console.log('ArmadillogCore', 'filterItemViewCreate', arguments);

		return this.armadillogView.filterItemViewGet({
			'id': filterItemMMap.get('id'),
			'filterAffectTypes': this.filterAffectTypes,
			'filterValueTypes': this.filterValueTypes
		});
	},

	/**
	 * Creates a filter item regexp
	 *
	 * @param {object} filterItemMMap filter item data
	 */
	filterItemRegexpCreate: function ArmadillogCore_filterItemRegexpCreate(filterItemMMap) {
		DEBUG && console.log('ArmadillogCore', 'filterItemRegexpCreate', arguments);

		var regexp = null;
		var filterItemValue = filterItemMMap.get('value');

		if (filterItemValue) {
			switch (filterItemMMap.get('valueType')) {
				case this.FILTER_VALUE_TYPE_TEXT:
					try {
						regexp = new RegExp(mUtils.regexp.escape(filterItemValue), 'gi');
					}
					catch (err) {
						// nothing
					}
					break;

				case this.FILTER_VALUE_TYPE_REGEXP:
					try {
						regexp = new RegExp(filterItemValue, 'gi');
					}
					catch (err) {
						// nothing
					}
					break;
			}
		}

		filterItemMMap.set('regexp', regexp);

		return true;
	},

	/**
	 * Initializes filter item UI
	 *
	 * @param {object} filterItemMMap filter item data
	 */
	filterItemUiInit: function ArmadillogCore_filterItemUiInit(filterItemMMap) {
		DEBUG && console.log('ArmadillogCore', 'filterItemUiInit', arguments);

		filterItemMMap.get('view').moveUpEl.addEventListener(
			'click',
			function ArmadillogCore_filterItemUiInit_filterItemViewMoveUpElClickHandler(evt) {
				this.filterItemMoveUp(filterItemMMap);

				evt.preventDefault();
				evt.stopPropagation();
			}.bind(this));

		filterItemMMap.get('view').moveDownEl.addEventListener(
			'click',
			function ArmadillogCore_filterItemUiInit_filterItemViewMoveDownElClickHandler(evt) {
				this.filterItemMoveDown(filterItemMMap);

				evt.preventDefault();
				evt.stopPropagation();
			}.bind(this));

		filterItemMMap.get('view').removeEl.addEventListener(
			'click',
			function ArmadillogCore_filterItemUiInit_filterItemViewRemoveElClickHandler(evt) {
				if (confirm('Are you sure?')) {
					this.filterItemRemove(filterItemMMap);
				}

				evt.preventDefault();
				evt.stopPropagation();
			}.bind(this));

		filterItemMMap.get('view').valueInputEl.addEventListener(
			'keypress',
			function ArmadillogCore_filterItemUiInit_filterItemViewValueInputElKeypressHandler(evt) {
				if (evt.keyCode === 13) {
					this.filterSubmit();
					evt.target.blur();

					evt.preventDefault();
					evt.stopPropagation();
				}
			}.bind(this));

		return true;
	},

	/**
	 * Moves a filter item up
	 *
	 * @param {object} filterItemMMap filter item data
	 */
	filterItemMoveUp: function ArmadillogCore_filterItemMoveUp(filterItemMMap) {
		DEBUG && console.log('ArmadillogCore', 'filterItemMoveUp', arguments);

		var filterItemIdx = this.filterMList.indexOf(filterItemMMap);

		if (filterItemIdx === 0) {
			return;
		}

		var filterItemIdxPrev = filterItemIdx - 1;
		var filterItemPrev = this.filterMList.getAt(filterItemIdxPrev);

		this.filterMList.setAt(filterItemIdxPrev, filterItemMMap, filterItemIdx, filterItemPrev);

		return true;
	},

	/**
	 * Moves filter item down
	 *
	 * @param {object} filterItemMMap filter item data
	 */
	filterItemMoveDown: function ArmadillogCore_filterItemMoveDown(filterItemMMap) {
		DEBUG && console.log('ArmadillogCore', 'filterItemMoveDown', arguments);

		var filterItemIdx = this.filterMList.indexOf(filterItemMMap);

		if (filterItemIdx === this.filterMList.length() - 1) {
			return;
		}

		var filterItemIdxNext = filterItemIdx + 1;
		var filterItemNext = this.filterMList.getAt(filterItemIdxNext);

		this.filterMList.setAt(filterItemIdxNext, filterItemMMap, filterItemIdx, filterItemNext);

		return true;
	},

	/**
	 * Removes a filter item
	 *
	 * @param {object} filterItemMMap filter item data
	 */
	filterItemRemove: function ArmadillogCore_filterItemRemove(filterItemMMap) {
		DEBUG && console.log('ArmadillogCore', 'filterItemRemove', arguments);

		this.filterMList.splice(this.filterMList.indexOf(filterItemMMap), 1);

		return true;
	},

	/**
	 * Removes a filter item
	 *
	 * @param {object} filterItemMMap filter item data
	 */
	filterClear: function ArmadillogCore_filterClear() {
		DEBUG && console.log('ArmadillogCore', 'filterClear', arguments);

		this.filterMList.queue('filter-clear');

		while (this.filterMList.length()) {
			this.filterItemRemove(this.filterMList.getAt(0));
		}

		this.filterMList.dequeue('filter-clear');

		return true;
	},

	/**
	 * Submits the filter list
	 */
	filterSubmit: function ArmadillogCore_filterSubmit() {
		DEBUG && console.log('ArmadillogCore', 'filterSubmit', arguments);

		var filterItemMMap;

		this.filterMList.queue('filter-submit');

		for (var i = 0, l = this.filterMList.length(); i < l; i++) {
			filterItemMMap = this.filterMList.getAt(i);

			filterItemMMap.queue('filter-submit');

			filterItemMMap.set('mute', filterItemMMap.get('view').muteCheckboxEl.checked ? true : false);

			var filterItemAffectTypeList = filterItemMMap.get('view').affectTypeList;
			var filterItemAffectTypeItem;

			for (var j = 0, m = filterItemAffectTypeList.length; j < m; j++) {
				filterItemAffectTypeItem = filterItemAffectTypeList[j];

				if (filterItemAffectTypeItem.radioEl.checked) {
					filterItemMMap.set('affectType', filterItemAffectTypeItem.radioEl.value);
				}
			}

			if (filterItemMMap.get('affectType') === null) {
				alert('You have to choose a filter affect type!');
				return false;
			}

			filterItemMMap.set('value', filterItemMMap.get('view').valueInputEl.value || '');

			var filterItemValueTypeList = filterItemMMap.get('view').valueTypeList;
			var filterItemValueTypeItem;

			for (var j = 0, m = filterItemValueTypeList.length; j < m; j++) {
				filterItemValueTypeItem = filterItemValueTypeList[j];

				if (filterItemValueTypeItem.radioEl.checked) {
					filterItemMMap.set('valueType', filterItemValueTypeItem.radioEl.value);
				}
			}

			if (filterItemMMap.get('valueType') === null) {
				alert('You have to choose a filter value type!');
				return false;
			}

			filterItemMMap.dequeue('filter-submit');
		}

		this.filterMList.dequeue('filter-submit');

		return true;
	},

	/**
	 * Handles filter model insert event
	 * @param {array} filterDataList model data list
	 */
	filterViewListInsert: function ArmadillogCore_filterViewListInsert(filterDataList) {
		DEBUG && console.log('ArmadillogCore', 'filterViewListInsert', arguments);

		this.filterViewListUpdate(filterDataList);

		var filterIndex,
			filterItemMMap;

		for (var i = 0, l = filterDataList.length; i < l; i++) {
			filterIndex = filterDataList[i].filterIndex;
			filterItemMMap = filterDataList[i].filterItemMMap;

			this.filterItemUiInit(filterItemMMap);
		}

		this.filterStorageSave();

		this.contentFilterApply();

		return true;
	},

	/**
	 * Handles filter model update event
	 * @param {array} filterDataList model data list
	 */
	filterViewListUpdate: function ArmadillogCore_filterViewListUpdate(filterDataList) {
		DEBUG && console.log('ArmadillogCore', 'filterViewListUpdate', arguments);

		var filterIndex,
			filterItemMMap,
			filterItemNextMMap;

		for (var i = 0, l = filterDataList.length; i < l; i++) {
			filterIndex = filterDataList[i].filterIndex;
			filterItemMMap = filterDataList[i].filterItemMMap;
			filterItemNextMMap = this.filterMList.getAt(filterIndex + 1);

			filterItemMMap.get('view').muteCheckboxEl.checked = filterItemMMap.get('mute');

			var filterItemAffectTypeList = filterItemMMap.get('view').affectTypeList;
			var filterItemAffectTypeItem;

			for (var j = 0, m = filterItemAffectTypeList.length; j < m; j++) {
				filterItemAffectTypeItem = filterItemAffectTypeList[j];
				filterItemAffectTypeItem.radioEl.checked = (filterItemMMap.get('affectType') === filterItemAffectTypeItem.radioEl.value);
			}

			filterItemMMap.get('view').valueInputEl.value = filterItemMMap.get('value') || '';

			var filterItemValueTypeList = filterItemMMap.get('view').valueTypeList;
			var filterItemValueTypeItem;

			for (var j = 0, m = filterItemValueTypeList.length; j < m; j++) {
				filterItemValueTypeItem = filterItemValueTypeList[j];
				filterItemValueTypeItem.radioEl.checked = (filterItemMMap.get('valueType') === filterItemValueTypeItem.radioEl.value);
			}

			// TODO: better handling situation in which next item exists, but it's view.el is non in DOM yet.
			try {
				this.filterView.listEl.insertBefore(
					filterItemMMap.get('view').el,
					filterItemNextMMap ? filterItemNextMMap.get('view').el : null);
			}
			catch (err) {
				this.filterView.listEl.insertBefore(
					filterItemMMap.get('view').el,
					null);
			}

			this.filterItemRegexpCreate(filterItemMMap); // TODO work on better place for it
		}

		this.filterStorageSave();

		this.contentFilterApply();

		return true;
	},

	/**
	 * Handles filter model delete event
	 * @param {array} filterDataList model data list
	 */
	filterViewListDelete: function ArmadillogCore_filterViewListDelete(filterDataList) {
		DEBUG && console.log('ArmadillogCore', 'filterViewListDelete', arguments);

		var filterIndex,
			filterItemMMap;

		for (var i = 0, l = filterDataList.length; i < l; i++) {
			filterIndex = filterDataList[i].filterIndex;
			filterItemMMap = filterDataList[i].filterItemMMap;

			this.filterView.listEl.removeChild(filterItemMMap.get('view').el);
		}

		this.filterStorageSave();

		this.contentFilterApply();

		return true;
	},

	/**
	 *
	 */
	filterStorageLoad: function ArmadillogCore_filterStorageLoad() {
		DEBUG && console.log('ArmadillogCore', 'filterStorageLoad', arguments);

		var storageFilterList = [];
		var filterItemMMap;

		try {
			storageFilterList = JSON.parse(window.localStorage.getItem(this.FILTER_LIST_STORAGE_NAME) || []);
		}
		catch (err) {
			// nothing
		}

		this.filterMList.queue('filter-storage-load');

		for (var i = 0, l = storageFilterList.length; i < l; i++) {
			filterItemMMap = this.filterItemCreate(storageFilterList[i]);
			this.filterMList.push(filterItemMMap);
		}

		this.filterMList.dequeue('filter-storage-load');

		return true;
	},

	/**
	 *
	 */
	filterStorageSave: function ArmadillogCore_filterStorageSave() {
		DEBUG && console.log('ArmadillogCore', 'filterStorageSave', arguments);

		var storageFilterList = [];
		var filterItemMMap;

		for (var i = 0, l = this.filterMList.length(); i < l; i++) {
			filterItemMMap = this.filterMList.getAt(i);

			storageFilterList.push({
				'mute': filterItemMMap.get('mute'),
				'affectType': filterItemMMap.get('affectType'),
				'value': filterItemMMap.get('value'),
				'valueType': filterItemMMap.get('valueType')
			});
		}

		try {
			window.localStorage.setItem(this.FILTER_LIST_STORAGE_NAME, JSON.stringify(storageFilterList));
		}
		catch (err) {
			// nothing
		}

		return true;
	},

	/**
	 * Initializes examine data
	 */
	examineDataInit: function ArmadillogCore_examineDataInit() {
		DEBUG && console.log('ArmadillogCore', 'examineDataInit', arguments);

		// nothing

		return true;
	},

	/**
	 * Creates examine view structure
	 */
	examineViewCreate: function ArmadillogCore_examineViewCreate() {
		DEBUG && console.log('ArmadillogCore', 'examineViewCreate', arguments);

		this.examineBoxEl = this.config.examineBoxEl;
		if (!this.examineBoxEl) {
			console.error('ArmadillogCore', 'examineViewCreate', 'invalid examineBoxEl');
			return false;
		};

		this.examineView = this.armadillogView.examineViewGet();
		this.examineBoxEl.appendChild(this.examineView.rawBoxEl);
		this.examineBoxEl.appendChild(this.examineView.filteredBoxEl);

		return this.examineView;
	},

	/**
	 * Initializes examine UI
	 */
	examineUiInit: function ArmadillogCore_examineUiInit() {
		DEBUG && console.log('ArmadillogCore', 'examineUiInit', arguments);

		this.examineView.rawContentEl.addEventListener(
			'keyup',
			function (evt) {
				if (!(evt.keyCode === 27 && !evt.ctrlKey && !evt.altKey && !evt.shiftKey)) { // esc
					evt.stopPropagation();
				}
			}.bind(this));

		this.examineView.filteredContentEl.addEventListener(
			'keyup',
			function (evt) {
				if (!(evt.keyCode === 27 && !evt.ctrlKey && !evt.altKey && !evt.shiftKey)) { // esc
					evt.stopPropagation();
				}
			}.bind(this));

		return true;
	},

	/**
	 * Sets examine content
	 *
	 * @param {string} textRaw examine raw text
	 * @param {string} textFiltered examine filtered text
	 */
	examineContentSet: function ArmadillogCore_examineContentSet(textRaw, textFiltered) {
		DEBUG && console.log('ArmadillogCore', 'examineContentSet', arguments);

		this.examineView.rawContentEl.innerHTML = mUtils.string.escapeXML(textRaw);
		this.examineView.filteredContentEl.innerHTML = mUtils.string.escapeXML(textFiltered).replace(this.filterTagRegexp, this.filterTagMatch);

		return true;
	},

	/**
	 * Clears examine content
	 */
	examineContentClear: function ArmadillogCore_examineContentClear() {
		DEBUG && console.log('ArmadillogCore', 'examineContentClear', arguments);

		this.examineView.rawContentEl.innerHTML = '';
		this.examineView.filteredContentEl.innerHTML = '';

		return true;
	},

	/**
	 * Initializes content data
	 */
	contentDataInit: function ArmadillogCore_contentDataInit() {
		DEBUG && console.log('ArmadillogCore', 'contentDataInit', arguments);

		this.contentTailing = false;

		this.contentLineMList = new mModel.ModelList();

		this.contentFile = null;
		this.contentFileUpdateTimeout = null;

		this.contentUrl = null;
		this.contentUrlUpdateTimeout = null;

		this.contentDragging = false;

		this.workerFileReader = new mWorker.WorkerDownloader();
		this.workerTextLineSplitter = new mWorker.WorkerFunction(
			function ArmadillogCore_contentDataInit_workerTextLineSplitter(data, success, error) {
				var lineList = data.text.split(/\r?\n/g);
				for (var i = 0, l = lineList.length; i < l; i++) {
					success(
						{
							'index': i,
							'text': lineList[i]
						},
						null);
				}

				success(
					{
						'count': lineList.length
					},
					null);
		});

		this.filterTagMap = {};
		this.filterTagMap[this.FILTER_TAG_FILTERED_BEGIN_SYMBOL] = this.FILTER_TAG_FILTERED_BEGIN_HTML;
		this.filterTagMap[this.FILTER_TAG_FILTERED_END_SYMBOL] = this.FILTER_TAG_FILTERED_END_HTML;
		this.filterTagMap[this.FILTER_TAG_HIGHLIGHT_BEGIN_SYMBOL] = this.FILTER_TAG_HIGHLIGHT_BEGIN_HTML;
		this.filterTagMap[this.FILTER_TAG_HIGHLIGHT_END_SYMBOL] = this.FILTER_TAG_HIGHLIGHT_END_HTML;

		this.filterTagRegexp = RegExp(
			'(' + [
				mUtils.regexp.escape(this.FILTER_TAG_FILTERED_BEGIN_SYMBOL),
				mUtils.regexp.escape(this.FILTER_TAG_FILTERED_END_SYMBOL),
				mUtils.regexp.escape(this.FILTER_TAG_HIGHLIGHT_BEGIN_SYMBOL),
				mUtils.regexp.escape(this.FILTER_TAG_HIGHLIGHT_END_SYMBOL)
			].join('|') + ')',
			'g');

		this.filterTagMatch = function ArmadillogCore_contentDataInit_filterTagMatch(match) {
			return this.filterTagMap[match];
		}.bind(this);

		return true;
	},

	/**
	 * Creates content view structure
	 */
	contentViewCreate: function ArmadillogCore_contentViewCreate() {
		DEBUG && console.log('ArmadillogCore', 'contentViewCreate', arguments);

		this.contentBoxEl = this.config.contentBoxEl;
		if (!this.contentBoxEl) {
			console.error('ArmadillogCore', 'contentViewCreate', 'invalid contentBoxEl');
			return false;
		};

		this.contentScrollEl = this.config.contentScrollEl;
		this.contentDropEl = this.config.contentDropEl;

		this.contentView = this.armadillogView.contentViewGet();
		this.contentBoxEl.appendChild(this.contentView.frameEl);

		return this.contentView;
	},

	/**
	 * Initializes content UI
	 */
	contentUiInit: function ArmadillogCore_contentUiInit() {
		DEBUG && console.log('ArmadillogCore', 'contentUiInit', arguments);

		window.addEventListener(
			'load',
			function ArmadillogCore_contentUiInit_contentScrollElScrollHandler(evt) {
				this.contentTailingCheck();
			}.bind(this),
			false);

		this.contentScrollEl.addEventListener(
			'scroll',
			function ArmadillogCore_contentUiInit_contentScrollElScrollHandler(evt) {
				this.contentTailingCheck();

				evt.preventDefault();
				evt.stopPropagation();
			}.bind(this),
			false);

		this.contentDropEl.addEventListener(
			'dragstart',
			function ArmadillogCore_contentUiInit_contentDropElDragstartHandler(evt) {
				this.contentDragging = true;

				// evt.preventDefault();
				evt.stopPropagation();
			}.bind(this),
			false);

		this.contentDropEl.addEventListener(
			'dragover',
			function ArmadillogCore_contentUiInit_contentDropElDragoverHandler(evt) {
				evt.dataTransfer.dropEffect = this.contentDragging ? 'none' : 'copy';

				evt.preventDefault();
				evt.stopPropagation();
			}.bind(this),
			false);

		this.contentDropEl.addEventListener(
			'dragend',
			function ArmadillogCore_contentUiInit_contentDropElDragendHandler(evt) {
				this.contentDragging = false;

				evt.preventDefault();
				evt.stopPropagation();
			}.bind(this),
			false);

		this.contentDropEl.addEventListener(
			'drop',
			function ArmadillogCore_contentUiInit_contentDropElDropHandler(evt) {
				if (!this.contentDragging) {
					var files = evt.dataTransfer.files;
					if (files.length) {
						this.contentClear();
						this.contentFileSet(files[0], files[0].name);
					}

					var data = evt.dataTransfer.getData('text/plain');
					if (data) {
						this.contentClear();
						this.contentTextSet(data, '(dragged text)');
					}
				}

				evt.preventDefault();
				evt.stopPropagation();
			}.bind(this),
			false);

		this.contentView.lineListEl.addEventListener(
			'click',
			function ArmadillogCore_contentUiInit_contentLineListElDblclickHandler(evt) {
				var contentLineEl;

				contentLineEl = evt.target;
				while (contentLineEl && contentLineEl.parentNode !== this.contentView.lineListEl) {
					contentLineEl = contentLineEl.parentNode;
				}
				if (contentLineEl) {
					if (mUtils.dom.classContains(contentLineEl, 'selected')) {
						mUtils.dom.classRemove(contentLineEl, 'selected');

						this.examineContentClear();
					}
					else {
						mUtils.dom.classRemove(this.contentView.lineListEl.querySelector('.selected'), 'selected');
						mUtils.dom.classAdd(contentLineEl, 'selected');

						var contentLineItemMMap = this.contentLineMList.getAt(~~contentLineEl.getAttribute('data-index'));
						this.examineContentSet(contentLineItemMMap.get('textRaw'), contentLineItemMMap.get('textFiltered'));
					}
				}

				evt.preventDefault();
				evt.stopPropagation();
			}.bind(this));

		this.contentView.lineListEl.addEventListener(
			'dblclick',
			function ArmadillogCore_contentUiInit_contentLineListElDblclickHandler(evt) {
				var contentLineEl;

				contentLineEl = evt.target
				while (contentLineEl && contentLineEl.parentNode !== this.contentView.lineListEl) {
					contentLineEl = contentLineEl.parentNode;
				}
				if (contentLineEl) {
					mUtils.dom.classToggle(contentLineEl, 'marked');
				}

				evt.preventDefault();
				evt.stopPropagation();
			}.bind(this));

		this.contentLineMList.on(
			'model-insert',
			function ArmadillogCore_contentUiInit_contentLineMListInsertHandler(evt, dataList) {
				var contentLineViewList = [];

				for (var i = 0, l = dataList.length; i < l; i++) {
					contentLineViewList.push({
						'contentLineIndex': dataList[i].index,
						'contentLineItemMMap': dataList[i].valueNew
					});
				}

				this.contentLineViewListInsert(contentLineViewList);
			}.bind(this));

		this.contentLineMList.on(
			'model-update',
			function ArmadillogCore_contentUiInit_contentLineMListUpdateHandler(evt, dataList) {
				var contentLineViewList = [];

				for (var i = 0, l = dataList.length; i < l; i++) {
					contentLineViewList.push({
						'contentLineIndex': dataList[i].index,
						'contentLineItemMMap': dataList[i].valueNew
					});
				}

				this.contentLineViewListUpdate(contentLineViewList);
			}.bind(this));

		this.contentLineMList.on(
			'model-delete',
			function ArmadillogCore_contentUiInit_contentLineMListDeleteHandler(evt, dataList) {
				var contentLineViewList = [];

				for (var i = 0, l = dataList.length; i < l; i++) {
					contentLineViewList.push({
						'contentLineIndex': dataList[i].index,
						'contentLineItemMMap': dataList[i].valueOld
					});
				}

				this.contentLineViewListDelete(contentLineViewList);
			}.bind(this));

		this.contentLineMList.on(
			'model-forward',
			function ArmadillogCore_contentUiInit_contentLineMListForwardHandler(evt, dataList) {
				var contentLineViewList = [];

				for (var i = 0, l = dataList.length; i < l; i++) {
					var update = dataList[i].dataList.some(function (dataItem) {
						return ~['textFiltered', 'hidden'].indexOf(dataItem.key);
					});

					if (update) {
						contentLineViewList.push({
							'contentLineIndex': dataList[i].index,
							'contentLineItemMMap': dataList[i].valueNew
						});
					}
				}

				if (contentLineViewList.length) {
					this.contentLineViewListUpdate(contentLineViewList);
				}
			}.bind(this));

		return true;
	},

	/**
	 * Clears content
	 */
	contentClear: function ArmadillogCore_contentClear() {
		DEBUG && console.log('ArmadillogCore', 'contentClear', arguments);

		this.contentFile = null;
		this.contentFileUpdateUnschedule();

		this.contentUrl = null;
		this.contentUrlUpdateUnschedule();

		this.contentLineMList.splice(0, this.contentLineMList.length());
		this.examineContentClear();

		this.inputView.clearLabelEl.innerHTML = '(empty)';

		return true;
	},

	/**
	 * Sets a content file
	 *
	 * @param {object} file object (e. g. evt.target.files[0])
	 * @param {string} label content's label
	 */
	contentFileSet: function ArmadillogCore_contentFileSet(file, label) {
		DEBUG && console.log('ArmadillogCore', 'contentFileSet', arguments);

		this.contentFile = file;

		this.workerFileReader.run(
			{
				'url': URL.createObjectURL(file)
			},
			null,
			function ArmadillogCore_contentFileSet_workerFileReaderSuccess(data) {
				URL.revokeObjectURL(data.url);
				this.contentTextSet(data.result, label);
				this.contentFileUpdateSchedule();
			}.bind(this),
			function ArmadillogCore_contentFileSet_workerFileReaderFailure() {
				alert('An error occured, please try another input method.');
			}.bind(this));

		return true;
	},

	/**
	 * Updates the content file
	 */
	contentFileUpdate: function ArmadillogCore_contentFileUpdate() {
		DEBUG && console.log('ArmadillogCore', 'contentFileUpdate', arguments);

		if (!this.contentFile) {
			return;
		}

		if (this.busy || this.contentLineMList.queued()) {
			this.contentFileUpdateSchedule();
			return;
		}

		this.workerFileReader.run(
			{
				'url': URL.createObjectURL(this.contentFile)
			},
			null,
			function ArmadillogCore_contentFileUpdate_workerFileReaderSuccess(data) {
				URL.revokeObjectURL(data.url);

				if (this.contentFile) {
					this.contentTextUpdate(data.result);
					this.contentFileUpdateSchedule();
				}
			}.bind(this),
			function ArmadillogCore_contentFileUpdate_workerFileReaderFailure() {
				alert('An error occured, please try another input method.');
			}.bind(this));

		return true;
	},

	/**
	 * Schedules a content file update
	 */
	contentFileUpdateSchedule: function ArmadillogCore_contentFileUpdateSchedule() {
		DEBUG && console.log('ArmadillogCore', 'contentFileUpdateSchedule', arguments);

		if (this.CONTENT_FILE_UPDATE_DELAY > 0) {
			this.contentFileUpdateTimeout = window.setTimeout(
				this.contentFileUpdate.bind(this),
				this.CONTENT_FILE_UPDATE_DELAY);
		}

		return true;
	},

	/**
	 * Unschedules a content file update
	 */
	contentFileUpdateUnschedule: function ArmadillogCore_contentFileUpdateUnschedule() {
		DEBUG && console.log('ArmadillogCore', 'contentFileUpdateUnschedule', arguments);

		if (this.contentFileUpdateTimeout) {
			window.clearTimeout(this.contentFileUpdateTimeout);
			this.contentFileUpdateTimeout = null;
		}

		return true;
	},

	/**
	 * Sets a content url
	 *
	 * @param {string} url content's url
	 * @param {string} label content's label
	 */
	contentUrlSet: function ArmadillogCore_contentUrlSet(url, label) {
		DEBUG && console.log('ArmadillogCore', 'contentUrlSet', arguments);

		url = mUtils.url.validate(url);
		if (!url) {
			alert('Invalid URL.');
			return;
		}

		this.contentUrl = url;

		this.workerFileReader.run(
			{
				'url': url
			},
			null,
			function ArmadillogCore_contentUrlSet_workerFileReaderSuccess(data) {
				this.contentTextSet(data.result, label);
				this.contentUrlUpdateSchedule();
			}.bind(this),
			function ArmadillogCore_contentUrlSet_workerFileReaderFailure() {
				alert('An error occured, please try another input method.');
			}.bind(this));

		return true;
	},

	/**
	 * Updates the content url
	 */
	contentUrlUpdate: function ArmadillogCore_contentUrlUpdate() {
		DEBUG && console.log('ArmadillogCore', 'contentUrlUpdate', arguments);

		if (!this.contentUrl) {
			return;
		}

		if (this.busy || this.contentLineMList.queued()) {
			this.contentUrlUpdateSchedule();
			return;
		}

		this.workerFileReader.run(
			{
				'url': this.contentUrl
			},
			null,
			function ArmadillogCore_contentUrlUpdate_workerFileReaderSuccess(data) {
				if (this.contentUrl) {
					this.contentTextUpdate(data.result);
					this.contentUrlUpdateSchedule();
				}
			}.bind(this),
			function ArmadillogCore_contentUrlUpdate_workerFileReaderFailure() {
				alert('An error occured, please try another input method.');
			}.bind(this));

		return true;
	},

	/**
	 * Schedules a content url update
	 */
	contentUrlUpdateSchedule: function ArmadillogCore_contentUrlUpdateSchedule() {
		DEBUG && console.log('ArmadillogCore', 'contentUrlUpdateSchedule', arguments);

		if (this.CONTENT_URL_UPDATE_DELAY > 0) {
			this.contentUrlUpdateTimeout = window.setTimeout(
				this.contentUrlUpdate.bind(this),
				this.CONTENT_URL_UPDATE_DELAY);
		}

		return true;
	},

	/**
	 * Unschedules a content url update
	 */
	contentUrlUpdateUnschedule: function ArmadillogCore_contentUrlUpdateUnschedule() {
		DEBUG && console.log('ArmadillogCore', 'contentUrlUpdateUnschedule', arguments);

		if (this.contentUrlUpdateTimeout) {
			window.clearTimeout(this.contentUrlUpdateTimeout);
			this.contentUrlUpdateTimeout = null;
		}

		return true;
	},

	/**
	 * Sets a piece of content
	 *
	 * @param {string} text a piece of content
	 * @param {string} label content's label
	 */
	contentTextSet: function ArmadillogCore_contentTextSet(text, label) {
		DEBUG && console.log('ArmadillogCore', 'contentTextSet', arguments);

		this.contentLineMList.queue('content-text-set');

		this.contentTailingStop();

		this.workerTextLineSplitter.run(
			{
				'text': text
			},
			null,
			function ArmadillogCore_contentTextSet_workerTextLineSplitterSuccess(data) {
				if ('text' in data) {
					var contentLineItemMMap = new mModel.ModelMap(
						'textRaw',
						data.text,
						'textFiltered',
						data.text,
						'hidden',
						false,
						'view',
						null);

					this.contentLineListFilter([contentLineItemMMap]);

					this.contentLineMList.setAt(data.index, contentLineItemMMap);
				}

				if ('count' in data) {
					this.inputView.clearLabelEl.innerHTML = label || '(unknown)';

					this.contentLineMList.dequeue('content-text-set');
				}
			}.bind(this),
			null);

		return true;
	},

	/**
	 * Updates the piece of content
	 *
	 * @param {string} text a piece of content
	 */
	contentTextUpdate: function ArmadillogCore_contentTextUpdate(text) {
		DEBUG && console.log('ArmadillogCore', 'contentTextUpdate', arguments);

		this.contentLineMList.queue('content-text-update');

		this.contentTailingCheck();

		this.workerTextLineSplitter.run(
			{
				'text': text
			},
			null,
			function ArmadillogCore_contentTextUpdate_workerTextLineSplitterSuccess(data) {
				if ('text' in data) {
					var contentLineItemMMap = this.contentLineMList.getAt(data.index);

					if (contentLineItemMMap) {
						if (contentLineItemMMap.get('textRaw') !== data.text) {
							contentLineItemMMap.set(
								'textRaw',
								data.text,
								'textFiltered',
								data.text);

							this.contentLineListFilter([contentLineItemMMap]);
						}
					}
					else {
						contentLineItemMMap = new mModel.ModelMap(
							'textRaw',
							data.text,
							'textFiltered',
							data.text,
							'hidden',
							false,
							'view',
							null);

						this.contentLineListFilter([contentLineItemMMap]);
					}

					this.contentLineMList.setAt(data.index, contentLineItemMMap);
				}

				if ('count' in data) {
					if (data.count < this.contentLineMList.length()) {
						this.contentLineMList.splice(data.count);
					}

					this.contentLineMList.dequeue('content-text-update');
				}
			}.bind(this),
			null);

		return true;
	},

	/**
	 * Applies filters to content
	 */
	contentFilterApply: function ArmadillogCore_contentFilterApply() {
		DEBUG && console.log('ArmadillogCore', 'contentFilterApply', arguments);

		this.contentLineListFilter(this.contentLineMList.toArray());

		return true;
	},

	/**
	 * Creates a content line view stricture
	 *
	 * @param {number} contentLineIndex index in result source
	 * @param {object} contentLineItemMMap content line model object
	 */
	contentLineItemViewCreate: function ArmadillogCore_contentLineItemViewCreate(contentLineIndex, contentLineItemMMap) {
		DEBUG && console.log('ArmadillogCore', 'contentLineItemViewCreate', arguments);

		return this.armadillogView.contentLineItemViewGet({
			'number': contentLineIndex + 1
		});
	},

	/**
	 * Inserts a line of source in view
	 *
	 * @param {array} contentLineViewList contentLineIndex & contentLineItemMMap list
	 * @param {number} chunkIndex chunk index
	 * @param {number} chunkSize chunk size
	 */
	contentLineViewListInsert: function ArmadillogCore_contentLineViewListInsert(contentLineViewList, chunkIndex, chunkSize) {
		DEBUG && console.log('ArmadillogCore', 'contentLineViewListInsert', arguments);

		requestAnimationFrame(function () {
			this.busySet(true, 'contentLineViewListInsert');

			chunkIndex = typeof chunkIndex === 'undefined' ? 0 : chunkIndex;
			chunkSize = typeof chunkSize === 'undefined' ? contentLineViewList.length - chunkIndex : Math.min(chunkSize, contentLineViewList.length - chunkIndex);

			var contentLineIndex, contentLineItemMMap, contentLineItemView;
			var documentFragment = document.createDocumentFragment();

			for (var i = 0; i < chunkSize && i < this.CONTENT_OVERFLOW_CHUNK_SIZE; i++) {
				contentLineIndex = contentLineViewList[chunkIndex + i].contentLineIndex;
				contentLineItemMMap = contentLineViewList[chunkIndex + i].contentLineItemMMap;

				contentLineItemView = this.contentLineItemViewCreate(contentLineIndex, contentLineItemMMap);
				contentLineItemMMap.set('view', contentLineItemView);

				contentLineItemView.el.setAttribute('data-index', contentLineIndex);

				documentFragment.appendChild(contentLineItemView.el);
			}

			this.contentLineViewListUpdate(contentLineViewList, chunkIndex, Math.min(chunkSize, this.CONTENT_OVERFLOW_CHUNK_SIZE));

			this.contentView.lineListEl.insertBefore(
				documentFragment,
				this.contentView.lineListEl.childNodes[contentLineViewList[chunkIndex].contentLineIndex] || null);

			if (chunkSize > this.CONTENT_OVERFLOW_CHUNK_SIZE) {
				setTimeout(
					function ArmadillogCore_contentLineViewListInsert_contentOverflowChunk() {
						this.contentLineViewListInsert(contentLineViewList, chunkIndex + this.CONTENT_OVERFLOW_CHUNK_SIZE);
					}.bind(this),
					this.CONTENT_OVERFLOW_DELAY);
			}
			else {
				this.busySet(false, 'contentLineViewListInsert');

				this.contentTailingDo();
			}
		}.bind(this));

		return true;
	},

	/**
	 * Updates a line of source in view
	 *
	 * @param {array} contentLineViewList contentLineIndex & contentLineItemMMap list
	 * @param {number} chunkIndex chunk index
	 * @param {number} chunkSize chunk size
	 */
	contentLineViewListUpdate: function ArmadillogCore_contentLineViewListUpdate(contentLineViewList, chunkIndex, chunkSize) {
		DEBUG && console.log('ArmadillogCore', 'contentLineViewListUpdate', arguments);

		requestAnimationFrame(function () {
			this.busySet(true, 'contentLineViewListUpdate');

			chunkIndex = typeof chunkIndex === 'undefined' ? 0 : chunkIndex;
			chunkSize = typeof chunkSize === 'undefined' ? contentLineViewList.length - chunkIndex : Math.min(chunkSize, contentLineViewList.length - chunkIndex);

			var contentLineIndex, contentLineItemMMap;

			for (var i = 0; i < chunkSize && i < this.CONTENT_OVERFLOW_CHUNK_SIZE; i++) {
				contentLineIndex = contentLineViewList[chunkIndex + i].contentLineIndex;
				contentLineItemMMap = contentLineViewList[chunkIndex + i].contentLineItemMMap;

				var text = contentLineItemMMap.get('textFiltered');
				if (text === null) {
					text = contentLineItemMMap.get('textRaw');
				}

				text = mUtils.string.escapeXML(text).replace(this.filterTagRegexp, this.filterTagMatch);

				var contentLineEl = contentLineItemMMap.get('view').el;

				contentLineEl.innerHTML = text || '';
				mUtils.dom.classDepend(contentLineEl, this.HIDDEN_CLASS, contentLineItemMMap.get('hidden'));
			}

			if (chunkSize > this.CONTENT_OVERFLOW_CHUNK_SIZE) {
				setTimeout(
					function ArmadillogCore_contentLineViewListUpdate_contentOverflowChunk() {
						this.contentLineViewListUpdate(contentLineViewList, chunkIndex + this.CONTENT_OVERFLOW_CHUNK_SIZE);
					}.bind(this),
					this.CONTENT_OVERFLOW_DELAY);
			}
			else {
				this.busySet(false, 'contentLineViewListUpdate');

				this.contentTailingDo();
			}
		}.bind(this));

		return true;
	},

	/**
	 * Deletes a line of source in view
	 *
	 * @param {array} contentLineViewList contentLineIndex & contentLineItemMMap list
	 * @param {number} chunkIndex chunk index
	 * @param {number} chunkSize chunk size
	 */
	contentLineViewListDelete: function ArmadillogCore_contentLineViewListDelete(contentLineViewList, chunkIndex, chunkSize) {
		DEBUG && console.log('ArmadillogCore', 'contentLineViewListDelete', arguments);

		requestAnimationFrame(function () {
			this.busySet(true, 'contentLineViewListDelete');

			chunkIndex = typeof chunkIndex === 'undefined' ? 0 : chunkIndex;
			chunkSize = typeof chunkSize === 'undefined' ? contentLineViewList.length - chunkIndex : Math.min(chunkSize, contentLineViewList.length - chunkIndex);

			var contentLineIndex, contentLineItemMMap;

			for (var i = 0; i < chunkSize && i < this.CONTENT_OVERFLOW_CHUNK_SIZE; i++) {
				contentLineIndex = contentLineViewList[chunkIndex + i].contentLineIndex;
				contentLineItemMMap = contentLineViewList[chunkIndex + i].contentLineItemMMap;

				this.contentView.lineListEl.removeChild(contentLineItemMMap.get('view').el);
			}

			if (chunkSize > this.CONTENT_OVERFLOW_CHUNK_SIZE) {
				setTimeout(
					function ArmadillogCore_contentLineViewListDelete_contentOverflowChunk() {
						this.contentLineViewListDelete(contentLineViewList, chunkIndex + this.CONTENT_OVERFLOW_CHUNK_SIZE);
					}.bind(this),
					this.CONTENT_OVERFLOW_DELAY);
			}
			else {
				this.busySet(false, 'contentLineViewListDelete');

				this.contentTailingDo();
			}
		}.bind(this));

		return true;
	},

	/**
	 * Performs filtering of a line list
	 *
	 * @param {object} contentLineList content line list model object
	 */
	contentLineListFilter: function ArmadillogCore_contentLineListFilter(contentLineList) {
		DEBUG && console.log('ArmadillogCore', 'contentLineListFilter', arguments);

		var contentLineItemMMap;
		var textFiltered;
		var hidden;
		var filterItemMMap;
		var match;

		this.contentLineMList.queue('content-line-list-filter');

		for (var i = 0, l = contentLineList.length; i < l; i++) {
			contentLineItemMMap = contentLineList[i];

			textFiltered = contentLineItemMMap.get('textRaw');
			hidden = false;

			for (var j = 0, m = this.filterMList.length(); j < m; j++) {
				filterItemMMap = this.filterMList.getAt(j);

				if (filterItemMMap.get('mute') || !filterItemMMap.get('regexp')) {
					continue;
				}

				match = textFiltered.match(filterItemMMap.get('regexp'));

				switch (filterItemMMap.get('affectType')) {
					case this.FILTER_AFFECT_TYPE_SHOW_LINE:
						if (match) {
							textFiltered = textFiltered.replace(filterItemMMap.get('regexp'), this.FILTER_TAG_FILTERED_BEGIN_SYMBOL + '$&' + this.FILTER_TAG_FILTERED_END_SYMBOL);
						}
						else {
							hidden = true;
						}
						break;

					case this.FILTER_AFFECT_TYPE_SHOW:
						if (match) {
							textFiltered = this.FILTER_TAG_FILTERED_BEGIN_SYMBOL + match.join(this.FILTER_TAG_FILTERED_END_SYMBOL + ' ' + this.FILTER_TAG_FILTERED_BEGIN_SYMBOL) + this.FILTER_TAG_FILTERED_END_SYMBOL;
						}
						else {
							hidden = true;
						}
						break;

					case this.FILTER_AFFECT_TYPE_HIDE_LINE:
						if (match) {
							hidden = true;
						}
						break;

					case this.FILTER_AFFECT_TYPE_HIDE:
						if (match) {
							textFiltered = textFiltered.replace(match[0], '');
						}
						break;

					case this.FILTER_AFFECT_TYPE_HIGHLIGHT_LINE:
						if (match) {
							textFiltered = this.FILTER_TAG_HIGHLIGHT_BEGIN_SYMBOL + textFiltered + this.FILTER_TAG_HIGHLIGHT_END_SYMBOL;
						}
						break;

					case this.FILTER_AFFECT_TYPE_HIGHLIGHT:
						if (match) {
							textFiltered = textFiltered.replace(filterItemMMap.get('regexp'), this.FILTER_TAG_HIGHLIGHT_BEGIN_SYMBOL + '$&' + this.FILTER_TAG_HIGHLIGHT_END_SYMBOL);
						}
						break;
				}
			}

			contentLineItemMMap.set('textFiltered', textFiltered, 'hidden', hidden);
		}

		this.contentLineMList.dequeue('content-line-list-filter');

		return true;
	},

	/**
	 * Checks whether to do content tailing
	 */
	contentTailingCheck: function ArmadillogCore_contentTailingCheck() {
		DEBUG && console.log('ArmadillogCore', 'contentTailingCheck', arguments);

		if (this.contentScrollEl === window) {
			this.contentTailing = window.scrollY >= window.scrollMaxY
		}
		else {
			this.contentTailing = this.contentScrollEl.scrollTop + this.contentScrollEl.offsetHeight >= this.contentScrollEl.scrollHeight;
		}

		return true;
	},

	/**
	 * Does content tailing
	 */
	contentTailingDo: function ArmadillogCore_contentTailingDo() {
		DEBUG && console.log('ArmadillogCore', 'contentTailingDo', arguments);

		if (this.contentTailing) {
			if (this.contentScrollEl === window) {
				window.scrollTo(window.scrollX, window.scrollMaxY);
			}
			else {
				this.contentScrollEl.scrollTop = this.contentScrollEl.scrollHeight;
			}
		}

		return true;
	},

	/**
	 * Stops content tailing
	 */
	contentTailingStop: function ArmadillogCore_contentTailingStop() {
		DEBUG && console.log('ArmadillogCore', 'contentTailingStop', arguments);

		this.contentTailing = false;

		return true;
	},

	/**
	 * Initializes busy data
	 */
	busyDataInit: function ArmadillogCore_busyDataInit() {
		DEBUG && console.log('ArmadillogCore', 'busyDataInit', arguments);

		this.busy = false;
		this.busyTaskList = [];

		return true;
	},

	/**
	 * Sets app busy mode
	 *
	 * @param {boolean} busy busy flag value
	 */
	busySet: function ArmadillogCore_busySet(busy, task) {
		DEBUG && console.log('ArmadillogCore', 'busySet', arguments);

		var taskIndex = this.busyTaskList.indexOf(task);

		if (busy) {
			if (!~taskIndex) {
				this.busyTaskList.push(task);
			}

			if (!this.busy) {
				this.busy = true;

				// this.contentView.frameEl.removeChild(this.contentView.lineListEl);
				mUtils.dom.classAdd(this.bodyEl, 'busy');
			}
		}
		else {
			if (~taskIndex) {
				this.busyTaskList.splice(taskIndex, 1);
			}

			if (this.busyTaskList.length === 0) {
				this.busy = false;

				// this.contentView.frameEl.appendChild(this.contentView.lineListEl);
				mUtils.dom.classRemove(this.bodyEl, 'busy');
			}
		}

		return true;
	},

	/**
	 *
	 */
	toString: function ArmadillogCore_toString() {
		return 'ennovum.ArmadillogCore';
	}

};

/* ==================================================================================================== */
		return {
			'ArmadillogCore': ArmadillogCore,
			'iArmadillogCore': iArmadillogCore
		};
	});
