'use strict';

window.define && define(
    [
        'ennovum.environment',
        'ennovum.utils',
        'ennovum.Observable',
        'ennovum.model.ModelList',
        'ennovum.model.ModelMap',
        'ennovum.worker.WorkerFunction',
        './../views/filter'
    ],
    function (
        environment,
        utils,
        Observable,
        ModelList,
        ModelMap,
        WorkerFunction,
        ArmadillogFilterView
    ) {
        /**
         * ArmadillogFilter constructor
         */
        var ArmadillogFilter = function ArmadillogFilter() {

            var HIDDEN_CLASS = 'hidden';

            var AFFECT_TYPE_SHOW_LINE = '1';
            var AFFECT_TYPE_SHOW = '2';
            var AFFECT_TYPE_HIDE_LINE = '3';
            var AFFECT_TYPE_HIDE = '4';
            var AFFECT_TYPE_HIGHLIGHT_LINE = '5';
            var AFFECT_TYPE_HIGHLIGHT = '6';

            var VALUE_TYPE_TEXT = '1';
            var VALUE_TYPE_REGEXP = '2';

            var HIGHLIGHT_TYPE_0 = '';
            var HIGHLIGHT_TYPE_1 = '1';
            var HIGHLIGHT_TYPE_2 = '2';
            var HIGHLIGHT_TYPE_3 = '3';
            var HIGHLIGHT_TYPE_4 = '4';
            var HIGHLIGHT_TYPE_5 = '5';
            var HIGHLIGHT_TYPE_6 = '6';
            var HIGHLIGHT_TYPE_7 = '7';
            var HIGHLIGHT_TYPE_8 = '8';
            var HIGHLIGHT_TYPE_9 = '9';
            var HIGHLIGHT_TYPE_10 = '10';
            var HIGHLIGHT_TYPE_11 = '11';
            var HIGHLIGHT_TYPE_12 = '12';

            var TAG_HIGHLIGHT_1_BEGIN_SYMBOL = this.TAG_HIGHLIGHT_1_BEGIN_SYMBOL = '\uff00\uff80';
            var TAG_HIGHLIGHT_1_END_SYMBOL = this.TAG_HIGHLIGHT_1_END_SYMBOL = '\uff01\uff81';
            var TAG_HIGHLIGHT_2_BEGIN_SYMBOL = this.TAG_HIGHLIGHT_2_BEGIN_SYMBOL = '\uff02\uff82';
            var TAG_HIGHLIGHT_2_END_SYMBOL = this.TAG_HIGHLIGHT_2_END_SYMBOL = '\uff03\uff83';
            var TAG_HIGHLIGHT_3_BEGIN_SYMBOL = this.TAG_HIGHLIGHT_3_BEGIN_SYMBOL = '\uff04\uff84';
            var TAG_HIGHLIGHT_3_END_SYMBOL = this.TAG_HIGHLIGHT_3_END_SYMBOL = '\uff05\uff85';
            var TAG_HIGHLIGHT_4_BEGIN_SYMBOL = this.TAG_HIGHLIGHT_4_BEGIN_SYMBOL = '\uff06\uff86';
            var TAG_HIGHLIGHT_4_END_SYMBOL = this.TAG_HIGHLIGHT_4_END_SYMBOL = '\uff07\uff87';
            var TAG_HIGHLIGHT_5_BEGIN_SYMBOL = this.TAG_HIGHLIGHT_5_BEGIN_SYMBOL = '\uff08\uff88';
            var TAG_HIGHLIGHT_5_END_SYMBOL = this.TAG_HIGHLIGHT_5_END_SYMBOL = '\uff09\uff89';
            var TAG_HIGHLIGHT_6_BEGIN_SYMBOL = this.TAG_HIGHLIGHT_6_BEGIN_SYMBOL = '\uff0a\uff8a';
            var TAG_HIGHLIGHT_6_END_SYMBOL = this.TAG_HIGHLIGHT_6_END_SYMBOL = '\uff0b\uff8b';
            var TAG_HIGHLIGHT_7_BEGIN_SYMBOL = this.TAG_HIGHLIGHT_7_BEGIN_SYMBOL = '\uff0c\uff8c';
            var TAG_HIGHLIGHT_7_END_SYMBOL = this.TAG_HIGHLIGHT_7_END_SYMBOL = '\uff0d\uff8d';
            var TAG_HIGHLIGHT_8_BEGIN_SYMBOL = this.TAG_HIGHLIGHT_8_BEGIN_SYMBOL = '\uff0e\uff8e';
            var TAG_HIGHLIGHT_8_END_SYMBOL = this.TAG_HIGHLIGHT_8_END_SYMBOL = '\uff0f\uff8f';
            var TAG_HIGHLIGHT_9_BEGIN_SYMBOL = this.TAG_HIGHLIGHT_9_BEGIN_SYMBOL = '\uff10\uff90';
            var TAG_HIGHLIGHT_9_END_SYMBOL = this.TAG_HIGHLIGHT_9_END_SYMBOL = '\uff11\uff91';
            var TAG_HIGHLIGHT_10_BEGIN_SYMBOL = this.TAG_HIGHLIGHT_10_BEGIN_SYMBOL = '\uff12\uff92';
            var TAG_HIGHLIGHT_10_END_SYMBOL = this.TAG_HIGHLIGHT_10_END_SYMBOL = '\uff13\uff93';
            var TAG_HIGHLIGHT_11_BEGIN_SYMBOL = this.TAG_HIGHLIGHT_11_BEGIN_SYMBOL = '\uff14\uff94';
            var TAG_HIGHLIGHT_11_END_SYMBOL = this.TAG_HIGHLIGHT_11_END_SYMBOL = '\uff15\uff95';
            var TAG_HIGHLIGHT_12_BEGIN_SYMBOL = this.TAG_HIGHLIGHT_12_BEGIN_SYMBOL = '\uff16\uff96';
            var TAG_HIGHLIGHT_12_END_SYMBOL = this.TAG_HIGHLIGHT_12_END_SYMBOL = '\uff17\uff97';

            var LIST_STORAGE_NAME = 'filterList';

            var observable;

            var config;
            var application;

            var filterIdSeq;
            var filterMList;

            var affectTypes;
            var valueTypes;
            var highlightTypes;

            var armadillogView;
            var boxEl;
            var filterView;

            var workerFilter;

            /**
             * Initializes instance
             *
             * @param {object} argConfig configuration object
             */
            var init = function ArmadillogFilter_init(argConfig, argApplication) {
                observable = utils.obj.mixin(this, new Observable());

                switch (true) {
                    case !configSet(argConfig):
                    case !dataInit(argApplication):
                    case !viewInit():
                    case !uiInit():
                    case !storageInit():
                        return false;
                        break;
                }

                return true;
            };

            /**
             * Initializes config
             *
             * @param {object} argConfig configuration object
             */
            var configSet = function ArmadillogFilter_configSet(argConfig) {
                switch (false) {
                    case !!argConfig:
                    case typeof argConfig === 'object':
                        console.error('ArmadillogFilter', 'configSet', 'invalid input');
                        return false;
                };

                config = {
                    boxEl: argConfig.filterBoxEl || null
                };

                return true;
            };

            /**
             * Initializes data
             */
            var dataInit = function ArmadillogFilter_dataInit(argApplication) {
                application = argApplication;

                filterIdSeq = 1;

                filterMList = new ModelList();

                affectTypes = [
                    {
                        'value': AFFECT_TYPE_SHOW_LINE,
                        'label': 'Show only lines',
                        'default': true
                    },
                    {
                        'value': AFFECT_TYPE_SHOW,
                        'label': 'Show only fragments'
                    },
                    {
                        'value': AFFECT_TYPE_HIDE_LINE,
                        'label': 'Hide lines'
                    },
                    {
                        'value': AFFECT_TYPE_HIDE,
                        'label': 'Hide fragments'
                    },
                    {
                        'value': AFFECT_TYPE_HIGHLIGHT_LINE,
                        'label': 'Highlight line'
                    },
                    {
                        'value': AFFECT_TYPE_HIGHLIGHT,
                        'label': 'Highlight fragment'
                    }
                ];

                valueTypes = [
                    {
                        'value': VALUE_TYPE_TEXT,
                        'label': 'Plain text',
                        'default': true
                    },
                    {
                        'value': VALUE_TYPE_REGEXP,
                        'label': 'Regular expression'
                    }
                ];

                highlightTypes = [
                    {
                        'value': HIGHLIGHT_TYPE_0,
                        'class': 'highlight-none',
                        'label': 'No highlight'
                    },
                    {
                        'value': HIGHLIGHT_TYPE_1,
                        'class': 'highlight highlight-' + HIGHLIGHT_TYPE_1,
                        'label': 'Light blue'
                    },
                    {
                        'value': HIGHLIGHT_TYPE_2,
                        'class': 'highlight highlight-' + HIGHLIGHT_TYPE_2,
                        'label': 'Dark blue'
                    },
                    {
                        'value': HIGHLIGHT_TYPE_3,
                        'class': 'highlight highlight-' + HIGHLIGHT_TYPE_3,
                        'label': 'Light green'
                    },
                    {
                        'value': HIGHLIGHT_TYPE_4,
                        'class': 'highlight highlight-' + HIGHLIGHT_TYPE_4,
                        'label': 'Dark green'
                    },
                    {
                        'value': HIGHLIGHT_TYPE_5,
                        'class': 'highlight highlight-' + HIGHLIGHT_TYPE_5,
                        'label': 'Light red'
                    },
                    {
                        'value': HIGHLIGHT_TYPE_6,
                        'class': 'highlight highlight-' + HIGHLIGHT_TYPE_6,
                        'label': 'Dark red'
                    },
                    {
                        'value': HIGHLIGHT_TYPE_7,
                        'class': 'highlight highlight-' + HIGHLIGHT_TYPE_7,
                        'label': 'Light yellow'
                    },
                    {
                        'value': HIGHLIGHT_TYPE_8,
                        'class': 'highlight highlight-' + HIGHLIGHT_TYPE_8,
                        'label': 'Dark yellow'
                    },
                    {
                        'value': HIGHLIGHT_TYPE_9,
                        'class': 'highlight highlight-' + HIGHLIGHT_TYPE_9,
                        'label': 'Light magenta'
                    },
                    {
                        'value': HIGHLIGHT_TYPE_10,
                        'class': 'highlight highlight-' + HIGHLIGHT_TYPE_10,
                        'label': 'Dark magenta'
                    },
                    {
                        'value': HIGHLIGHT_TYPE_11,
                        'class': 'highlight highlight-' + HIGHLIGHT_TYPE_11,
                        'label': 'Light cyan'
                    },
                    {
                        'value': HIGHLIGHT_TYPE_12,
                        'class': 'highlight highlight-' + HIGHLIGHT_TYPE_12,
                        'label': 'Dark cyan'
                    }
                ];

                filterWorkerCreate();

                return true;
            };

            /**
             * Initializes view
             */
            var viewInit = function ArmadillogFilter_viewInit() {
                armadillogView = new ArmadillogFilterView();

                boxEl = config.boxEl;
                if (!boxEl) {
                    console.error('ArmadillogFilter', 'viewCreate', 'invalid boxEl');
                    return false;
                };

                filterView = armadillogView.filterViewGet();
                boxEl.appendChild(filterView.listEl);
                boxEl.appendChild(filterView.buttonBoxEl);

                return true;
            };

            /**
             * Initializes UI
             */
            var uiInit = function ArmadillogFilter_uiInit() {
                filterView.clearButtonEl.addEventListener(
                    'click',
                    function ArmadillogFilter_inputUiInit_clearButtonElClickHandler(evt) {
                        if (!application.busy.check() && confirm('Are you sure?')) {
                            clear();
                        }

                        evt.preventDefault();
                        evt.stopPropagation();
                    });

                filterView.createButtonEl.addEventListener(
                    'click',
                    function ArmadillogFilter_inputUiInit_filterCreateButtonElClickHandler(evt) {
                        if (!application.busy.check()) {
                            var filterItemMMap = filterItemCreate();
                            filterMList.push(filterItemMMap);

                            filterView.listEl.scrollTop = filterView.listEl.scrollHeight;
                            filterItemMMap.get('view').valueInputEl.focus();
                        }

                        evt.preventDefault();
                        evt.stopPropagation();
                    });

                filterView.submitButtonEl.addEventListener(
                    'click',
                    function ArmadillogFilter_inputUiInit_submitButtonElClickHandler(evt) {
                        if (!application.busy.check()) {
                            submit();
                        }

                        evt.preventDefault();
                        evt.stopPropagation();
                    });

                filterMList.on(
                    'model-insert',
                    function ArmadillogFilter_inputUiInit_filterMListInsertHandler(evt, dataList) {
                        var filterDataList = [];

                        for (var i = 0, l = dataList.length; i < l; i++) {
                            filterDataList.push({
                                'filterIndex': dataList[i].index,
                                'filterItemMMap': dataList[i].valueNew
                            });
                        }

                        filterViewListInsert(filterDataList);
                        observable.trigger('list-insert', {'count': dataList.length});
                    });

                filterMList.on(
                    'model-update',
                    function ArmadillogFilter_inputUiInit_filterMListUpdateHandler(evt, dataList) {
                        var filterDataList = [];

                        for (var i = 0, l = dataList.length; i < l; i++) {
                            filterDataList.push({
                                'filterIndex': dataList[i].index,
                                'filterItemMMap': dataList[i].valueNew
                            });
                        }

                        filterViewListUpdate(filterDataList);
                        observable.trigger('list-update', {'count': dataList.length});
                    });

                filterMList.on(
                    'model-delete',
                    function ArmadillogFilter_inputUiInit_filterMListDeleteHandler(evt, dataList) {
                        var filterDataList = [];

                        for (var i = 0, l = dataList.length; i < l; i++) {
                            filterDataList.push({
                                'filterIndex': dataList[i].index,
                                'filterItemMMap': dataList[i].valueOld
                            });
                        }

                        filterViewListDelete(filterDataList);
                        observable.trigger('list-delete', {'count': dataList.length});
                    });

                filterMList.on(
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
                            filterViewListUpdate(filterDataList);
                            observable.trigger('list-update', {'count': dataList.length});
                        }
                    });

                observable.on(
                    ['list-insert', 'list-delete'],
                    function ArmadillogFilter_inputUiInit_handlerListToggle() {
                        utils.dom.classDepend(filterView.listEl, HIDDEN_CLASS, filterMList.length() === 0);
                        utils.dom.classDepend(filterView.submitButtonEl, HIDDEN_CLASS, filterMList.length() === 0);
                        utils.dom.classDepend(filterView.clearButtonEl, HIDDEN_CLASS, filterMList.length() === 0);
                    });

                return true;
            };

            /**
             * Initializes storage
             */
            var storageInit = function ArmadillogFilter_storageInit() {
                storageLoad();

                return true;
            };

            /**
             * Creates a filter worker
             */
            var filterWorkerCreate = function ArmadillogFilter_filterWorkerCreate() {
                workerFilter = new WorkerFunction(
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
            };

            /**
             * Creates a filter item
             *
             * @param {object} data filter item data
             */
            var filterItemCreate = function ArmadillogFilter_filterItemCreate(data) {
                if (!data || typeof data !== 'object') {
                    data = {};
                }

                var filterItemMMap = new ModelMap();
                filterItemMMap.set(
                    'id',
                    filterIdSeq++,
                    'mute',
                    'mute' in data ? data.mute : false,
                    'affectType',
                    'affectType' in data ? data.affectType : AFFECT_TYPE_SHOW_LINE,
                    'value',
                    'value' in data ? data.value : '',
                    'valueType',
                    'valueType' in data ? data.valueType : VALUE_TYPE_TEXT,
                    'highlightType',
                    'highlightType' in data ? data.highlightType : HIGHLIGHT_TYPE_0);

                filterItemViewCreate(filterItemMMap);

                return filterItemMMap;
            };

            /**
             * Creates a filter item view structure
             *
             * @param {object} filterItemMMap filter item data
             */
            var filterItemViewCreate = function ArmadillogFilter_filterItemViewCreate(filterItemMMap) {
                filterItemMMap.set(
                    'view',
                    armadillogView.filterItemViewGet({
                        'id': filterItemMMap.get('id'),
                        'filterAffectTypes': affectTypes,
                        'filterValueTypes': valueTypes,
                        'filterHighlightTypes': highlightTypes
                    }));

                return true;
            };

            /**
             * Updates a filter item view structure
             *
             * @param {object} filterItemMMap filter item data
             */
            var filterItemViewUpdate = function ArmadillogFilter_filterItemViewUpdate(filterItemMMap) {
                utils.dom.classDepend(filterItemMMap.get('view').muteEl, HIDDEN_CLASS, filterItemMMap.get('mute'));
                utils.dom.classDepend(filterItemMMap.get('view').unmuteEl, HIDDEN_CLASS, !filterItemMMap.get('mute'));

                utils.dom.selectValue(filterItemMMap.get('view').affectTypeListSelectEl, filterItemMMap.get('affectType'));

                filterItemMMap.get('view').valueInputEl.value = filterItemMMap.get('value') || '';

                utils.dom.selectValue(filterItemMMap.get('view').valueTypeListSelectEl, filterItemMMap.get('valueType'));

                utils.dom.selectValue(filterItemMMap.get('view').highlightTypeListSelectEl, filterItemMMap.get('highlightType'));

                return true;
            };

            /**
             * Initializes filter item UI
             *
             * @param {object} filterItemMMap filter item data
             */
            var filterItemUiInit = function ArmadillogFilter_filterItemUiInit(filterItemMMap) {
                filterItemMMap.get('view').muteEl.addEventListener(
                    'click',
                    function ArmadillogFilter_filterItemUiInit_filterItemViewMuteElClickHandler(evt) {
                        filterMute(filterItemMMap);

                        evt.preventDefault();
                        evt.stopPropagation();
                    });

                filterItemMMap.get('view').unmuteEl.addEventListener(
                    'click',
                    function ArmadillogFilter_filterItemUiInit_filterItemViewUnmuteElClickHandler(evt) {
                        filterUnmute(filterItemMMap);

                        evt.preventDefault();
                        evt.stopPropagation();
                    });

                filterItemMMap.get('view').moveUpEl.addEventListener(
                    'click',
                    function ArmadillogFilter_filterItemUiInit_filterItemViewMoveUpElClickHandler(evt) {
                        filterItemMoveUp(filterItemMMap);

                        evt.preventDefault();
                        evt.stopPropagation();
                    });

                filterItemMMap.get('view').moveDownEl.addEventListener(
                    'click',
                    function ArmadillogFilter_filterItemUiInit_filterItemViewMoveDownElClickHandler(evt) {
                        filterItemMoveDown(filterItemMMap);

                        evt.preventDefault();
                        evt.stopPropagation();
                    });

                filterItemMMap.get('view').removeEl.addEventListener(
                    'click',
                    function ArmadillogFilter_filterItemUiInit_filterItemViewRemoveElClickHandler(evt) {
                        if (confirm('Are you sure?')) {
                            filterItemRemove(filterItemMMap);
                        }

                        evt.preventDefault();
                        evt.stopPropagation();
                    });

                filterItemMMap.get('view').valueInputEl.addEventListener(
                    'keypress',
                    function ArmadillogFilter_filterItemUiInit_filterItemViewValueInputElKeypressHandler(evt) {
                        if (evt.keyCode === 13) {
                            submit();
                            evt.target.blur();

                            evt.preventDefault();
                            evt.stopPropagation();
                        }
                    });

                return true;
            };

            /**
             * Mutes filter
             *
             * @param {object} filterItemMMap filter item data
             */
            var filterMute = function ArmadillogFilter_filterMute(filterItemMMap) {
                filterItemMMap.set('mute', true);

                utils.dom.classAdd(filterItemMMap.get('view').muteEl, HIDDEN_CLASS);
                utils.dom.classRemove(filterItemMMap.get('view').unmuteEl, HIDDEN_CLASS);

                return true;
            };

            /**
             * Unmutes filter
             *
             * @param {object} filterItemMMap filter item data
             */
            var filterUnmute = function ArmadillogFilter_filterUnmute(filterItemMMap) {
                filterItemMMap.set('mute', false);

                utils.dom.classRemove(filterItemMMap.get('view').muteEl, HIDDEN_CLASS);
                utils.dom.classAdd(filterItemMMap.get('view').unmuteEl, HIDDEN_CLASS);

                return true;
            };

            /**
             * Moves a filter item up
             *
             * @param {object} filterItemMMap filter item data
             */
            var filterItemMoveUp = function ArmadillogFilter_filterItemMoveUp(filterItemMMap) {
                var filterItemIdx = filterMList.indexOf(filterItemMMap);

                if (filterItemIdx === 0) {
                    return;
                }

                var filterItemIdxPrev = filterItemIdx - 1;
                var filterItemPrev = filterMList.getAt(filterItemIdxPrev);

                filterMList.setAt(filterItemIdxPrev, filterItemMMap, filterItemIdx, filterItemPrev);

                return true;
            };

            /**
             * Moves filter item down
             *
             * @param {object} filterItemMMap filter item data
             */
            var filterItemMoveDown = function ArmadillogFilter_filterItemMoveDown(filterItemMMap) {
                var filterItemIdx = filterMList.indexOf(filterItemMMap);

                if (filterItemIdx === filterMList.length() - 1) {
                    return;
                }

                var filterItemIdxNext = filterItemIdx + 1;
                var filterItemNext = filterMList.getAt(filterItemIdxNext);

                filterMList.setAt(filterItemIdxNext, filterItemMMap, filterItemIdx, filterItemNext);

                return true;
            };

            /**
             * Removes a filter item
             *
             * @param {object} filterItemMMap filter item data
             */
            var filterItemRemove = function ArmadillogFilter_filterItemRemove(filterItemMMap) {
                filterMList.splice(filterMList.indexOf(filterItemMMap), 1);

                return true;
            };

            /**
             * Removes a filter item
             *
             * @param {object} filterItemMMap filter item data
             */
            var clear = function ArmadillogFilter_clear() {
                filterMList.queue('filter-clear');

                while (filterMList.length()) {
                    filterItemRemove(filterMList.getAt(0));
                }

                filterMList.dequeue('filter-clear');

                return true;
            };

            /**
             * Submits the filter list
             */
            var submit = function ArmadillogFilter_submit() {
                var filterItemMMap;

                filterMList.queue('filter-submit');

                for (var i = 0, l = filterMList.length(); i < l; i++) {
                    filterItemMMap = filterMList.getAt(i);

                    filterItemMMap.queue('filter-submit');

                    filterItemMMap.set('affectType', utils.dom.selectValue(filterItemMMap.get('view').affectTypeListSelectEl));

                    if (filterItemMMap.get('affectType') === null) {
                        alert('You have to choose a filter affect type!');
                        return false;
                    }

                    filterItemMMap.set('value', filterItemMMap.get('view').valueInputEl.value || '');

                    filterItemMMap.set('valueType', utils.dom.selectValue(filterItemMMap.get('view').valueTypeListSelectEl));

                    if (filterItemMMap.get('valueType') === null) {
                        alert('You have to choose a filter value type!');
                        return false;
                    }

                    filterItemMMap.set('highlightType', utils.dom.selectValue(filterItemMMap.get('view').highlightTypeListSelectEl));

                    filterItemMMap.dequeue('filter-submit');
                }

                filterMList.dequeue('filter-submit');

                return true;
            };

            /**
             * Handles filter model insert event
             * @param {array} filterDataList model data list
             */
            var filterViewListInsert = function ArmadillogFilter_filterViewListInsert(filterDataList) {
                var filterIndex,
                    filterItemMMap;

                for (var i = 0, l = filterDataList.length; i < l; i++) {
                    filterIndex = filterDataList[i].filterIndex;
                    filterItemMMap = filterDataList[i].filterItemMMap;

                    filterItemUiInit(filterItemMMap);
                    filterItemViewUpdate(filterItemMMap);

                    filterView.listEl.insertBefore(
                        filterItemMMap.get('view').el,
                        filterView.listEl.childNodes[filterIndex] || null);
                }

                filterViewOrderApply();
                storageSave();

                return true;
            };

            /**
             * Handles filter model update event
             * @param {array} filterDataList model data list
             */
            var filterViewListUpdate = function ArmadillogFilter_filterViewListUpdate(filterDataList) {
                var filterIndex,
                    filterItemMMap;

                for (var i = 0, l = filterDataList.length; i < l; i++) {
                    filterIndex = filterDataList[i].filterIndex;
                    filterItemMMap = filterDataList[i].filterItemMMap;

                    filterItemViewUpdate(filterItemMMap);

                    filterView.listEl.insertBefore(
                        filterItemMMap.get('view').el,
                        filterView.listEl.childNodes[filterIndex] || null);
                }

                filterViewOrderApply();
                storageSave();

                return true;
            };

            /**
             * Handles filter model delete event
             * @param {array} filterDataList model data list
             */
            var filterViewListDelete = function ArmadillogFilter_filterViewListDelete(filterDataList) {
                var filterIndex,
                    filterItemMMap;

                for (var i = 0, l = filterDataList.length; i < l; i++) {
                    filterIndex = filterDataList[i].filterIndex;
                    filterItemMMap = filterDataList[i].filterItemMMap;

                    filterView.listEl.removeChild(filterItemMMap.get('view').el);
                }

                filterViewOrderApply();
                storageSave();

                return true;
            };

            /**
             * Applies necessary operations after filter order changed
             */
            var filterViewOrderApply = function ArmadillogFilter_filterViewOrderApply() {
                var filterItemMMap;

                for (var i = 0, l = filterMList.length(); i < l; i++) {
                    filterItemMMap = filterMList.getAt(i);

                    utils.dom.classDepend(filterItemMMap.get('view').moveUpEl, HIDDEN_CLASS, i === 0);
                    utils.dom.classDepend(filterItemMMap.get('view').moveDownEl, HIDDEN_CLASS, i === l - 1);
                }

                return true;
            };

            /**
             *
             */
            var storageLoad = function ArmadillogFilter_storageLoad() {
                var storageFilterList = [];
                var filterItemMMap;

                try {
                    storageFilterList = JSON.parse(localStorage.getItem(LIST_STORAGE_NAME) || []);
                }
                catch (err) {
                    // nothing
                }

                filterMList.queue('filter-storage-load');

                for (var i = 0, l = storageFilterList.length; i < l; i++) {
                    filterItemMMap = filterItemCreate(storageFilterList[i]);
                    filterMList.push(filterItemMMap);
                }

                filterMList.dequeue('filter-storage-load');

                return true;
            };

            /**
             *
             */
            var storageSave = function ArmadillogFilter_storageSave() {
                var storageFilterList = [];
                var filterItemMMap;

                for (var i = 0, l = filterMList.length(); i < l; i++) {
                    filterItemMMap = filterMList.getAt(i);

                    storageFilterList.push({
                        'mute': filterItemMMap.get('mute'),
                        'affectType': filterItemMMap.get('affectType'),
                        'value': filterItemMMap.get('value'),
                        'valueType': filterItemMMap.get('valueType'),
                        'highlightType': filterItemMMap.get('highlightType')
                    });
                }

                try {
                    localStorage.setItem(LIST_STORAGE_NAME, JSON.stringify(storageFilterList));
                }
                catch (err) {
                    // nothing
                }

                return true;
            };

            /**
             *
             */
            var filterText = this.filterText = function ArmadillogFilter_storageSave(text, onSuccess) {
                var filterItemMMap;
                var filterList = [], filterItem;

                for (var i = 0, l = filterMList.length(); i < l; i++) {
                    filterItemMMap = filterMList.getAt(i);

                    filterItem = {
                        'affectType': filterItemMMap.get('affectType'),
                        'highlightType': filterItemMMap.get('highlightType'),
                        'mute': filterItemMMap.get('mute')
                    };

                    switch (filterItemMMap.get('valueType')) {
                        case VALUE_TYPE_TEXT:
                            try {
                                filterItem.value = utils.regexp.escape(filterItemMMap.get('value'));
                            }
                            catch (err) {
                                // nothing
                            }
                            break;

                        case VALUE_TYPE_REGEXP:
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

                workerFilter.run(
                    {
                        'AFFECT_TYPE_SHOW_LINE': AFFECT_TYPE_SHOW_LINE,
                        'AFFECT_TYPE_SHOW': AFFECT_TYPE_SHOW,
                        'AFFECT_TYPE_HIDE_LINE': AFFECT_TYPE_HIDE_LINE,
                        'AFFECT_TYPE_HIDE': AFFECT_TYPE_HIDE,
                        'AFFECT_TYPE_HIGHLIGHT_LINE': AFFECT_TYPE_HIGHLIGHT_LINE,
                        'AFFECT_TYPE_HIGHLIGHT': AFFECT_TYPE_HIGHLIGHT,
                        'TAG_HIGHLIGHT_1_BEGIN_SYMBOL': TAG_HIGHLIGHT_1_BEGIN_SYMBOL,
                        'TAG_HIGHLIGHT_1_END_SYMBOL': TAG_HIGHLIGHT_1_END_SYMBOL,
                        'TAG_HIGHLIGHT_2_BEGIN_SYMBOL': TAG_HIGHLIGHT_2_BEGIN_SYMBOL,
                        'TAG_HIGHLIGHT_2_END_SYMBOL': TAG_HIGHLIGHT_2_END_SYMBOL,
                        'TAG_HIGHLIGHT_3_BEGIN_SYMBOL': TAG_HIGHLIGHT_3_BEGIN_SYMBOL,
                        'TAG_HIGHLIGHT_3_END_SYMBOL': TAG_HIGHLIGHT_3_END_SYMBOL,
                        'TAG_HIGHLIGHT_4_BEGIN_SYMBOL': TAG_HIGHLIGHT_4_BEGIN_SYMBOL,
                        'TAG_HIGHLIGHT_4_END_SYMBOL': TAG_HIGHLIGHT_4_END_SYMBOL,
                        'TAG_HIGHLIGHT_5_BEGIN_SYMBOL': TAG_HIGHLIGHT_5_BEGIN_SYMBOL,
                        'TAG_HIGHLIGHT_5_END_SYMBOL': TAG_HIGHLIGHT_5_END_SYMBOL,
                        'TAG_HIGHLIGHT_6_BEGIN_SYMBOL': TAG_HIGHLIGHT_6_BEGIN_SYMBOL,
                        'TAG_HIGHLIGHT_6_END_SYMBOL': TAG_HIGHLIGHT_6_END_SYMBOL,
                        'TAG_HIGHLIGHT_7_BEGIN_SYMBOL': TAG_HIGHLIGHT_7_BEGIN_SYMBOL,
                        'TAG_HIGHLIGHT_7_END_SYMBOL': TAG_HIGHLIGHT_7_END_SYMBOL,
                        'TAG_HIGHLIGHT_8_BEGIN_SYMBOL': TAG_HIGHLIGHT_8_BEGIN_SYMBOL,
                        'TAG_HIGHLIGHT_8_END_SYMBOL': TAG_HIGHLIGHT_8_END_SYMBOL,
                        'TAG_HIGHLIGHT_9_BEGIN_SYMBOL': TAG_HIGHLIGHT_9_BEGIN_SYMBOL,
                        'TAG_HIGHLIGHT_9_END_SYMBOL': TAG_HIGHLIGHT_9_END_SYMBOL,
                        'TAG_HIGHLIGHT_10_BEGIN_SYMBOL': TAG_HIGHLIGHT_10_BEGIN_SYMBOL,
                        'TAG_HIGHLIGHT_10_END_SYMBOL': TAG_HIGHLIGHT_10_END_SYMBOL,
                        'TAG_HIGHLIGHT_11_BEGIN_SYMBOL': TAG_HIGHLIGHT_11_BEGIN_SYMBOL,
                        'TAG_HIGHLIGHT_11_END_SYMBOL': TAG_HIGHLIGHT_11_END_SYMBOL,
                        'TAG_HIGHLIGHT_12_BEGIN_SYMBOL': TAG_HIGHLIGHT_12_BEGIN_SYMBOL,
                        'TAG_HIGHLIGHT_12_END_SYMBOL': TAG_HIGHLIGHT_12_END_SYMBOL,
                        'text': text,
                        'filterListJSON': filterListJSON
                    },
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
            };

            /**
             *
             */
            var toString = this.toString = function ArmadillogFilter_toString() {
                return 'ennovum.ArmadillogFilter';
            }

            //
            init.apply(this, arguments);
            // utils.debug.spy(this);
        };

        //
        return ArmadillogFilter;
    });
