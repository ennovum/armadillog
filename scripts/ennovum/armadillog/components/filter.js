'use strict';

window.define && define(
    [
        'ennovum.Environment',
        'ennovum.Utils',
        'ennovum.Observable',
        'ennovum.Model',
        'ennovum.Worker',
        './../views/filter'
    ],
    function (
        mEnvironment,
        mUtils,
        mObservable,
        mModel,
        mWorker,
        mArmadillogFilterView
    ) {
/* ==================================================================================================== */

// debug spy switch
var DEBUG = false;

/**
 * ArmadillogFilter static
 */
var armadillogFilterStatic = {
    TAG_HIGHLIGHT_1_BEGIN_SYMBOL: '\uff00\uff80',
    TAG_HIGHLIGHT_1_END_SYMBOL: '\uff01\uff81',
    TAG_HIGHLIGHT_2_BEGIN_SYMBOL: '\uff02\uff82',
    TAG_HIGHLIGHT_2_END_SYMBOL: '\uff03\uff83',
    TAG_HIGHLIGHT_3_BEGIN_SYMBOL: '\uff04\uff84',
    TAG_HIGHLIGHT_3_END_SYMBOL: '\uff05\uff85',
    TAG_HIGHLIGHT_4_BEGIN_SYMBOL: '\uff06\uff86',
    TAG_HIGHLIGHT_4_END_SYMBOL: '\uff07\uff87',
    TAG_HIGHLIGHT_5_BEGIN_SYMBOL: '\uff08\uff88',
    TAG_HIGHLIGHT_5_END_SYMBOL: '\uff09\uff89',
    TAG_HIGHLIGHT_6_BEGIN_SYMBOL: '\uff0a\uff8a',
    TAG_HIGHLIGHT_6_END_SYMBOL: '\uff0b\uff8b',
    TAG_HIGHLIGHT_7_BEGIN_SYMBOL: '\uff0c\uff8c',
    TAG_HIGHLIGHT_7_END_SYMBOL: '\uff0d\uff8d',
    TAG_HIGHLIGHT_8_BEGIN_SYMBOL: '\uff0e\uff8e',
    TAG_HIGHLIGHT_8_END_SYMBOL: '\uff0f\uff8f',
    TAG_HIGHLIGHT_9_BEGIN_SYMBOL: '\uff10\uff90',
    TAG_HIGHLIGHT_9_END_SYMBOL: '\uff11\uff91',
    TAG_HIGHLIGHT_10_BEGIN_SYMBOL: '\uff12\uff92',
    TAG_HIGHLIGHT_10_END_SYMBOL: '\uff13\uff93',
    TAG_HIGHLIGHT_11_BEGIN_SYMBOL: '\uff14\uff94',
    TAG_HIGHLIGHT_11_END_SYMBOL: '\uff15\uff95',
    TAG_HIGHLIGHT_12_BEGIN_SYMBOL: '\uff16\uff96',
    TAG_HIGHLIGHT_12_END_SYMBOL: '\uff17\uff97'
};

/**
 * ArmadillogFilter interface
 */
var armadillogFilterInterface = {
    launch: function () {},

    filterText: function (text, onSuccess) {}
};

/**
 * ArmadillogFilter constructor
 */
var ArmadillogFilter = function ArmadillogFilter() {
    this.init.apply(this, arguments);
    DEBUG && mUtils.debug.spy(this);
    return mUtils.obj.implement({}, this, [armadillogFilterInterface, mObservable.iObservable]);
};

/**
 * ArmadillogFilter prototype
 */
ArmadillogFilter.prototype = {

    HIDDEN_CLASS: 'hidden',

    AFFECT_TYPE_SHOW_LINE: '1',
    AFFECT_TYPE_SHOW: '2',
    AFFECT_TYPE_HIDE_LINE: '3',
    AFFECT_TYPE_HIDE: '4',
    AFFECT_TYPE_HIGHLIGHT_LINE: '5',
    AFFECT_TYPE_HIGHLIGHT: '6',

    VALUE_TYPE_TEXT: '1',
    VALUE_TYPE_REGEXP: '2',

    HIGHLIGHT_TYPE_0: '',
    HIGHLIGHT_TYPE_1: '1',
    HIGHLIGHT_TYPE_2: '2',
    HIGHLIGHT_TYPE_3: '3',
    HIGHLIGHT_TYPE_4: '4',
    HIGHLIGHT_TYPE_5: '5',
    HIGHLIGHT_TYPE_6: '6',
    HIGHLIGHT_TYPE_7: '7',
    HIGHLIGHT_TYPE_8: '8',
    HIGHLIGHT_TYPE_9: '9',
    HIGHLIGHT_TYPE_10: '10',
    HIGHLIGHT_TYPE_11: '11',
    HIGHLIGHT_TYPE_12: '12',

    LIST_STORAGE_NAME: 'filterList',

    /**
     * Initializes instance
     *
     * @param {object} config configuration object
     */
    init: function ArmadillogFilter_init(config, application) {
        this.oObservable = mUtils.obj.mixin(this, new mObservable.Observable());

        switch (true) {
            case !this.configSet(config):
            case !this.dataInit(application):
            case !this.viewInit():
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
    configSet: function ArmadillogFilter_configSet(config) {
        switch (false) {
            case !!config:
            case typeof config === 'object':
                console.error('ArmadillogFilter', 'configSet', 'invalid input');
                return false;
        };

        this.config = {
            boxEl: config.filterBoxEl || null
        };

        return true;
    },

    /**
     * Launches component
     */
    launch: function ArmadillogFilter_launch() {
        switch (true) {
            case !this.uiInit():
            case !this.storageInit():
                return false;
                break;
        }

        return true;
    },

    /**
     * Initializes data
     */
    dataInit: function ArmadillogFilter_dataInit(application) {
        this.application = application;

        this.filterIdSeq = 1;

        this.filterMList = new mModel.ModelList();

        this.affectTypes = [
            {
                'value': this.AFFECT_TYPE_SHOW_LINE,
                'label': 'Show only lines',
                'default': true
            },
            {
                'value': this.AFFECT_TYPE_SHOW,
                'label': 'Show only fragments'
            },
            {
                'value': this.AFFECT_TYPE_HIDE_LINE,
                'label': 'Hide lines'
            },
            {
                'value': this.AFFECT_TYPE_HIDE,
                'label': 'Hide fragments'
            },
            {
                'value': this.AFFECT_TYPE_HIGHLIGHT_LINE,
                'label': 'Highlight line'
            },
            {
                'value': this.AFFECT_TYPE_HIGHLIGHT,
                'label': 'Highlight fragment'
            }
        ];

        this.valueTypes = [
            {
                'value': this.VALUE_TYPE_TEXT,
                'label': 'Plain text',
                'default': true
            },
            {
                'value': this.VALUE_TYPE_REGEXP,
                'label': 'Regular expression'
            }
        ];

        this.highlightTypes = [
            {
                'value': this.HIGHLIGHT_TYPE_0,
                'class': null,
                'label': 'No style'
            },
            {
                'value': this.HIGHLIGHT_TYPE_1,
                'class': 'highlight highlight-' + this.HIGHLIGHT_TYPE_1,
                'label': 'Style 1'
            },
            {
                'value': this.HIGHLIGHT_TYPE_2,
                'class': 'highlight highlight-' + this.HIGHLIGHT_TYPE_2,
                'label': 'Style 2'
            },
            {
                'value': this.HIGHLIGHT_TYPE_3,
                'class': 'highlight highlight-' + this.HIGHLIGHT_TYPE_3,
                'label': 'Style 3'
            },
            {
                'value': this.HIGHLIGHT_TYPE_4,
                'class': 'highlight highlight-' + this.HIGHLIGHT_TYPE_4,
                'label': 'Style 4'
            },
            {
                'value': this.HIGHLIGHT_TYPE_5,
                'class': 'highlight highlight-' + this.HIGHLIGHT_TYPE_5,
                'label': 'Style 5'
            },
            {
                'value': this.HIGHLIGHT_TYPE_6,
                'class': 'highlight highlight-' + this.HIGHLIGHT_TYPE_6,
                'label': 'Style 6'
            },
            {
                'value': this.HIGHLIGHT_TYPE_7,
                'class': 'highlight highlight-' + this.HIGHLIGHT_TYPE_7,
                'label': 'Style 7'
            },
            {
                'value': this.HIGHLIGHT_TYPE_8,
                'class': 'highlight highlight-' + this.HIGHLIGHT_TYPE_8,
                'label': 'Style 8'
            },
            {
                'value': this.HIGHLIGHT_TYPE_9,
                'class': 'highlight highlight-' + this.HIGHLIGHT_TYPE_9,
                'label': 'Style 9'
            },
            {
                'value': this.HIGHLIGHT_TYPE_10,
                'class': 'highlight highlight-' + this.HIGHLIGHT_TYPE_10,
                'label': 'Style 10'
            },
            {
                'value': this.HIGHLIGHT_TYPE_11,
                'class': 'highlight highlight-' + this.HIGHLIGHT_TYPE_11,
                'label': 'Style 11'
            },
            {
                'value': this.HIGHLIGHT_TYPE_12,
                'class': 'highlight highlight-' + this.HIGHLIGHT_TYPE_12,
                'label': 'Style 12'
            }
        ];

        this.filterWorkerCreate();

        return true;
    },

    /**
     * Initializes view
     */
    viewInit: function ArmadillogFilter_viewInit() {
        this.armadillogView = new mArmadillogFilterView.ArmadillogFilterView();

        this.boxEl = this.config.boxEl;
        if (!this.boxEl) {
            console.error('ArmadillogFilter', 'viewCreate', 'invalid boxEl');
            return false;
        };

        this.view = this.armadillogView.filterViewGet();
        this.boxEl.appendChild(this.view.listEl);
        this.boxEl.appendChild(this.view.buttonBoxEl);

        return true;
    },

    /**
     * Initializes UI
     */
    uiInit: function ArmadillogFilter_uiInit() {
        this.view.clearButtonEl.addEventListener(
            'click',
            function ArmadillogFilter_inputUiInit_clearButtonElClickHandler(evt) {
                if (!this.application.busy.check() && confirm('Are you sure?')) {
                    this.clear();
                }

                evt.preventDefault();
                evt.stopPropagation();
            }.bind(this));

        this.view.addButtonEl.addEventListener(
            'click',
            function ArmadillogFilter_inputUiInit_filterAddButtonElClickHandler(evt) {
                if (!this.application.busy.check()) {
                    var filterItemMMap = this.filterItemCreate();
                    this.filterMList.push(filterItemMMap);

                    this.view.listEl.scrollTop = this.view.listEl.scrollHeight;
                    filterItemMMap.get('view').valueInputEl.focus();
                }

                evt.preventDefault();
                evt.stopPropagation();
            }.bind(this));

        this.view.submitButtonEl.addEventListener(
            'click',
            function ArmadillogFilter_inputUiInit_submitButtonElClickHandler(evt) {
                if (!this.application.busy.check()) {
                    this.submit();
                }

                evt.preventDefault();
                evt.stopPropagation();
            }.bind(this));

        this.filterMList.on(
            'model-insert',
            function ArmadillogFilter_inputUiInit_filterMListInsertHandler(evt, dataList) {
                var filterDataList = [];

                for (var i = 0, l = dataList.length; i < l; i++) {
                    filterDataList.push({
                        'filterIndex': dataList[i].index,
                        'filterItemMMap': dataList[i].valueNew
                    });
                }

                this.viewListInsert(filterDataList);
                this.trigger('list-insert', {'count': dataList.length});
            }.bind(this));

        this.filterMList.on(
            'model-update',
            function ArmadillogFilter_inputUiInit_filterMListUpdateHandler(evt, dataList) {
                var filterDataList = [];

                for (var i = 0, l = dataList.length; i < l; i++) {
                    filterDataList.push({
                        'filterIndex': dataList[i].index,
                        'filterItemMMap': dataList[i].valueNew
                    });
                }

                this.viewListUpdate(filterDataList);
                this.trigger('list-update', {'count': dataList.length});
            }.bind(this));

        this.filterMList.on(
            'model-delete',
            function ArmadillogFilter_inputUiInit_filterMListDeleteHandler(evt, dataList) {
                var filterDataList = [];

                for (var i = 0, l = dataList.length; i < l; i++) {
                    filterDataList.push({
                        'filterIndex': dataList[i].index,
                        'filterItemMMap': dataList[i].valueOld
                    });
                }

                this.viewListDelete(filterDataList);
                this.trigger('list-delete', {'count': dataList.length});
            }.bind(this));

        this.filterMList.on(
            'model-forward',
            function ArmadillogFilter_inputUiInit_filterMListForwardHandler(evt, dataList) {
                var filterDataList = [];

                for (var i = 0, l = dataList.length; i < l; i++) {
                    if (
                        dataList[i].event === 'model-update' &&
                        dataList[i].dataList.some(function (dataItem) {
                            return ~['mute', 'affectType', 'value', 'valueType', 'highlightType'].indexOf(dataItem.key);
                        })
                    ) {
                        filterDataList.push({
                            'filterIndex': dataList[i].index,
                            'filterItemMMap': dataList[i].valueNew
                        });
                    }
                }

                if (filterDataList.length) {
                    this.viewListUpdate(filterDataList);
                    this.trigger('list-update', {'count': dataList.length});
                }
            }.bind(this));

        this.on(
            ['list-insert', 'list-delete'],
            function ArmadillogFilter_inputUiInit_handlerListToggler() {
                mUtils.dom.classDepend(this.view.listEl, this.HIDDEN_CLASS, this.filterMList.length() === 0);
            }.bind(this));

        return true;
    },

    /**
     * Initializes storage
     */
    storageInit: function ArmadillogFilter_storageInit() {
        this.storageLoad();

        return true;
    },

    /**
     * Creates a filter worker
     */
    filterWorkerCreate: function ArmadillogFilter_filterWorkerCreate() {
        this.workerFilter = new mWorker.WorkerFunction(
            function ArmadillogFilter_filterWorkerCreate_workerFilter(data, success, error) {
                var textFiltered = data.text;
                var filterList = JSON.parse(data.filterListJSON);

                var hidden = false;
                var filterItem;
                var regexp, match;

                for (var i = 0, l = filterList.length; i < l; i++) {
                    filterItem = filterList[i];

                    if (filterItem.mute || !filterItem.value || hidden) {
                        continue;
                    }

                    var tagBeginSymbol = filterItem.highlightType ? data['TAG_HIGHLIGHT_' + filterItem.highlightType + '_BEGIN_SYMBOL'] || '' : '';
                    var tagEndSymbol = filterItem.highlightType ? data['TAG_HIGHLIGHT_' + filterItem.highlightType + '_END_SYMBOL'] || '' : '';

                    regexp = new RegExp('(' + filterItem.value + ')', 'gi');
                    match = textFiltered.match(regexp);

                    switch (filterItem.affectType) {
                        case data.AFFECT_TYPE_SHOW_LINE:
                            if (match) {
                                textFiltered = textFiltered.replace(regexp, tagBeginSymbol + '$1' + tagEndSymbol);
                            }
                            else {
                                hidden = true;
                            }
                            break;

                        case data.AFFECT_TYPE_SHOW:
                            if (match) {
                                textFiltered = tagBeginSymbol + match.join(tagEndSymbol + ' ' + tagBeginSymbol) + tagEndSymbol;
                            }
                            else {
                                hidden = true;
                            }
                            break;

                        case data.AFFECT_TYPE_HIDE_LINE:
                            if (match) {
                                hidden = true;
                            }
                            break;

                        case data.AFFECT_TYPE_HIDE:
                            if (match) {
                                textFiltered = textFiltered.replace(regexp, '');
                            }
                            break;

                        case data.AFFECT_TYPE_HIGHLIGHT_LINE:
                            if (match) {
                                textFiltered = tagBeginSymbol + textFiltered + tagEndSymbol;
                            }
                            break;

                        case data.AFFECT_TYPE_HIGHLIGHT:
                            if (match) {
                                textFiltered = textFiltered.replace(regexp, tagBeginSymbol + '$1' + tagEndSymbol);
                            }
                            break;
                    }
                }

                success(
                    {
                        'text': textFiltered,
                        'hidden': hidden
                    },
                    null);
        });

        return true;
    },

    /**
     * Creates a filter item
     *
     * @param {object} data filter item data
     */
    filterItemCreate: function ArmadillogFilter_filterItemCreate(data) {
        if (!data || typeof data !== 'object') {
            data = {};
        }

        var filterItemMMap = new mModel.ModelMap();
        filterItemMMap.set(
            'id',
            this.filterIdSeq++,
            'mute',
            'mute' in data ? data.mute : false,
            'affectType',
            'affectType' in data ? data.affectType : this.AFFECT_TYPE_SHOW_LINE,
            'value',
            'value' in data ? data.value : '',
            'valueType',
            'valueType' in data ? data.valueType : this.VALUE_TYPE_TEXT,
            'highlightType',
            'highlightType' in data ? data.highlightType : this.HIGHLIGHT_TYPE_0);

        this.filterItemViewCreate(filterItemMMap);

        return filterItemMMap;
    },

    /**
     * Creates a filter item view structure
     *
     * @param {object} filterItemMMap filter item data
     */
    filterItemViewCreate: function ArmadillogFilter_filterItemViewCreate(filterItemMMap) {
        filterItemMMap.set(
            'view',
            this.armadillogView.filterItemViewGet({
                'id': filterItemMMap.get('id'),
                'filterAffectTypes': this.affectTypes,
                'filterValueTypes': this.valueTypes,
                'filterHighlightTypes': this.highlightTypes
            }));

        return true;
    },

    /**
     * Updates a filter item view structure
     *
     * @param {object} filterItemMMap filter item data
     */
    filterItemViewUpdate: function ArmadillogFilter_filterItemViewUpdate(filterItemMMap) {
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

        var filterItemHighlightTypeList = filterItemMMap.get('view').highlightTypeList;
        var filterItemHighlightTypeItem;

        for (var j = 0, m = filterItemHighlightTypeList.length; j < m; j++) {
            filterItemHighlightTypeItem = filterItemHighlightTypeList[j];
            filterItemHighlightTypeItem.radioEl.checked = (filterItemMMap.get('highlightType') === filterItemHighlightTypeItem.radioEl.value);
        }

        return true;
    },

    /**
     * Initializes filter item UI
     *
     * @param {object} filterItemMMap filter item data
     */
    filterItemUiInit: function ArmadillogFilter_filterItemUiInit(filterItemMMap) {
        filterItemMMap.get('view').moveUpEl.addEventListener(
            'click',
            function ArmadillogFilter_filterItemUiInit_filterItemViewMoveUpElClickHandler(evt) {
                this.filterItemMoveUp(filterItemMMap);

                evt.preventDefault();
                evt.stopPropagation();
            }.bind(this));

        filterItemMMap.get('view').moveDownEl.addEventListener(
            'click',
            function ArmadillogFilter_filterItemUiInit_filterItemViewMoveDownElClickHandler(evt) {
                this.filterItemMoveDown(filterItemMMap);

                evt.preventDefault();
                evt.stopPropagation();
            }.bind(this));

        filterItemMMap.get('view').removeEl.addEventListener(
            'click',
            function ArmadillogFilter_filterItemUiInit_filterItemViewRemoveElClickHandler(evt) {
                if (confirm('Are you sure?')) {
                    this.filterItemRemove(filterItemMMap);
                }

                evt.preventDefault();
                evt.stopPropagation();
            }.bind(this));

        filterItemMMap.get('view').valueInputEl.addEventListener(
            'keypress',
            function ArmadillogFilter_filterItemUiInit_filterItemViewValueInputElKeypressHandler(evt) {
                if (evt.keyCode === 13) {
                    this.submit();
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
    filterItemMoveUp: function ArmadillogFilter_filterItemMoveUp(filterItemMMap) {
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
    filterItemMoveDown: function ArmadillogFilter_filterItemMoveDown(filterItemMMap) {
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
    filterItemRemove: function ArmadillogFilter_filterItemRemove(filterItemMMap) {
        this.filterMList.splice(this.filterMList.indexOf(filterItemMMap), 1);

        return true;
    },

    /**
     * Removes a filter item
     *
     * @param {object} filterItemMMap filter item data
     */
    clear: function ArmadillogFilter_clear() {
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
    submit: function ArmadillogFilter_submit() {
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

            var filterItemHighlightTypeList = filterItemMMap.get('view').highlightTypeList;
            var filterItemHighlightTypeItem;

            for (var j = 0, m = filterItemHighlightTypeList.length; j < m; j++) {
                filterItemHighlightTypeItem = filterItemHighlightTypeList[j];

                if (filterItemHighlightTypeItem.radioEl.checked) {
                    filterItemMMap.set('highlightType', filterItemHighlightTypeItem.radioEl.value);
                }
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
    viewListInsert: function ArmadillogFilter_viewListInsert(filterDataList) {
        var filterIndex,
            filterItemMMap;

        for (var i = 0, l = filterDataList.length; i < l; i++) {
            filterIndex = filterDataList[i].filterIndex;
            filterItemMMap = filterDataList[i].filterItemMMap;

            this.filterItemUiInit(filterItemMMap);
            this.filterItemViewUpdate(filterItemMMap);

            this.view.listEl.insertBefore(
                filterItemMMap.get('view').el,
                this.view.listEl.childNodes[filterIndex] || null);
        }

        this.storageSave();

        return true;
    },

    /**
     * Handles filter model update event
     * @param {array} filterDataList model data list
     */
    viewListUpdate: function ArmadillogFilter_viewListUpdate(filterDataList) {
        var filterIndex,
            filterItemMMap;

        for (var i = 0, l = filterDataList.length; i < l; i++) {
            filterIndex = filterDataList[i].filterIndex;
            filterItemMMap = filterDataList[i].filterItemMMap;

            this.filterItemViewUpdate(filterItemMMap);

            this.view.listEl.insertBefore(
                filterItemMMap.get('view').el,
                this.view.listEl.childNodes[filterIndex] || null);
        }

        this.storageSave();

        return true;
    },

    /**
     * Handles filter model delete event
     * @param {array} filterDataList model data list
     */
    viewListDelete: function ArmadillogFilter_viewListDelete(filterDataList) {
        var filterIndex,
            filterItemMMap;

        for (var i = 0, l = filterDataList.length; i < l; i++) {
            filterIndex = filterDataList[i].filterIndex;
            filterItemMMap = filterDataList[i].filterItemMMap;

            this.view.listEl.removeChild(filterItemMMap.get('view').el);
        }

        this.storageSave();

        return true;
    },

    /**
     *
     */
    storageLoad: function ArmadillogFilter_storageLoad() {
        var storageFilterList = [];
        var filterItemMMap;

        try {
            storageFilterList = JSON.parse(localStorage.getItem(this.LIST_STORAGE_NAME) || []);
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
    storageSave: function ArmadillogFilter_storageSave() {
        var storageFilterList = [];
        var filterItemMMap;

        for (var i = 0, l = this.filterMList.length(); i < l; i++) {
            filterItemMMap = this.filterMList.getAt(i);

            storageFilterList.push({
                'mute': filterItemMMap.get('mute'),
                'affectType': filterItemMMap.get('affectType'),
                'value': filterItemMMap.get('value'),
                'valueType': filterItemMMap.get('valueType'),
                'highlightType': filterItemMMap.get('highlightType')
            });
        }

        try {
            localStorage.setItem(this.LIST_STORAGE_NAME, JSON.stringify(storageFilterList));
        }
        catch (err) {
            // nothing
        }

        return true;
    },

    /**
     *
     */
    filterText: function ArmadillogFilter_storageSave(text, onSuccess) {
        var filterItemMMap;
        var filterList = [], filterItem;

        for (var i = 0, l = this.filterMList.length(); i < l; i++) {
            filterItemMMap = this.filterMList.getAt(i);

            filterItem = {
                'affectType': filterItemMMap.get('affectType'),
                'highlightType': filterItemMMap.get('highlightType'),
                'mute': filterItemMMap.get('mute')
            };

            switch (filterItemMMap.get('valueType')) {
                case this.VALUE_TYPE_TEXT:
                    try {
                        filterItem.value = mUtils.regexp.escape(filterItemMMap.get('value'));
                    }
                    catch (err) {
                        // nothing
                    }
                    break;

                case this.VALUE_TYPE_REGEXP:
                    try {
                        filterItem.value = filterItemMMap.get('value');
                    }
                    catch (err) {
                        // nothing
                    }
                    break;
                }

            filterList.push(filterItem);
        }

        var filterListJSON = JSON.stringify(filterList);

        this.workerFilter.run(
            {
                'AFFECT_TYPE_SHOW_LINE': this.AFFECT_TYPE_SHOW_LINE,
                'AFFECT_TYPE_SHOW': this.AFFECT_TYPE_SHOW,
                'AFFECT_TYPE_HIDE_LINE': this.AFFECT_TYPE_HIDE_LINE,
                'AFFECT_TYPE_HIDE': this.AFFECT_TYPE_HIDE,
                'AFFECT_TYPE_HIGHLIGHT_LINE': this.AFFECT_TYPE_HIGHLIGHT_LINE,
                'AFFECT_TYPE_HIGHLIGHT': this.AFFECT_TYPE_HIGHLIGHT,
                'TAG_HIGHLIGHT_1_BEGIN_SYMBOL': armadillogFilterStatic.TAG_HIGHLIGHT_1_BEGIN_SYMBOL,
                'TAG_HIGHLIGHT_1_END_SYMBOL': armadillogFilterStatic.TAG_HIGHLIGHT_1_END_SYMBOL,
                'TAG_HIGHLIGHT_2_BEGIN_SYMBOL': armadillogFilterStatic.TAG_HIGHLIGHT_2_BEGIN_SYMBOL,
                'TAG_HIGHLIGHT_2_END_SYMBOL': armadillogFilterStatic.TAG_HIGHLIGHT_2_END_SYMBOL,
                'TAG_HIGHLIGHT_3_BEGIN_SYMBOL': armadillogFilterStatic.TAG_HIGHLIGHT_3_BEGIN_SYMBOL,
                'TAG_HIGHLIGHT_3_END_SYMBOL': armadillogFilterStatic.TAG_HIGHLIGHT_3_END_SYMBOL,
                'TAG_HIGHLIGHT_4_BEGIN_SYMBOL': armadillogFilterStatic.TAG_HIGHLIGHT_4_BEGIN_SYMBOL,
                'TAG_HIGHLIGHT_4_END_SYMBOL': armadillogFilterStatic.TAG_HIGHLIGHT_4_END_SYMBOL,
                'TAG_HIGHLIGHT_5_BEGIN_SYMBOL': armadillogFilterStatic.TAG_HIGHLIGHT_5_BEGIN_SYMBOL,
                'TAG_HIGHLIGHT_5_END_SYMBOL': armadillogFilterStatic.TAG_HIGHLIGHT_5_END_SYMBOL,
                'TAG_HIGHLIGHT_6_BEGIN_SYMBOL': armadillogFilterStatic.TAG_HIGHLIGHT_6_BEGIN_SYMBOL,
                'TAG_HIGHLIGHT_6_END_SYMBOL': armadillogFilterStatic.TAG_HIGHLIGHT_6_END_SYMBOL,
                'TAG_HIGHLIGHT_7_BEGIN_SYMBOL': armadillogFilterStatic.TAG_HIGHLIGHT_7_BEGIN_SYMBOL,
                'TAG_HIGHLIGHT_7_END_SYMBOL': armadillogFilterStatic.TAG_HIGHLIGHT_7_END_SYMBOL,
                'TAG_HIGHLIGHT_8_BEGIN_SYMBOL': armadillogFilterStatic.TAG_HIGHLIGHT_8_BEGIN_SYMBOL,
                'TAG_HIGHLIGHT_8_END_SYMBOL': armadillogFilterStatic.TAG_HIGHLIGHT_8_END_SYMBOL,
                'TAG_HIGHLIGHT_9_BEGIN_SYMBOL': armadillogFilterStatic.TAG_HIGHLIGHT_9_BEGIN_SYMBOL,
                'TAG_HIGHLIGHT_9_END_SYMBOL': armadillogFilterStatic.TAG_HIGHLIGHT_9_END_SYMBOL,
                'TAG_HIGHLIGHT_10_BEGIN_SYMBOL': armadillogFilterStatic.TAG_HIGHLIGHT_10_BEGIN_SYMBOL,
                'TAG_HIGHLIGHT_10_END_SYMBOL': armadillogFilterStatic.TAG_HIGHLIGHT_10_END_SYMBOL,
                'TAG_HIGHLIGHT_11_BEGIN_SYMBOL': armadillogFilterStatic.TAG_HIGHLIGHT_11_BEGIN_SYMBOL,
                'TAG_HIGHLIGHT_11_END_SYMBOL': armadillogFilterStatic.TAG_HIGHLIGHT_11_END_SYMBOL,
                'TAG_HIGHLIGHT_12_BEGIN_SYMBOL': armadillogFilterStatic.TAG_HIGHLIGHT_12_BEGIN_SYMBOL,
                'TAG_HIGHLIGHT_12_END_SYMBOL': armadillogFilterStatic.TAG_HIGHLIGHT_12_END_SYMBOL,
                'text': text,
                'filterListJSON': filterListJSON
            },
            null,
            null,
            function ArmadillogFilter_filterText_workerFilterSuccess(data) {
                onSuccess({
                    'text': data.text,
                    'hidden': data.hidden
                });
            },
            null,
            this);


        return true;
    },

    /**
     *
     */
    toString: function ArmadillogFilter_toString() {
        return 'ennovum.ArmadillogFilter';
    }

};

/* ==================================================================================================== */
        return {
            'armadillogFilterStatic': armadillogFilterStatic,
            'armadillogFilterInterface': armadillogFilterInterface,
            'ArmadillogFilter': ArmadillogFilter
        };
    });
