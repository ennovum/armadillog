'use strict';

define(
    [
        'ennovum.environment',
        'ennovum.dom',
        'ennovum.composition',
        'ennovum.utils',
        'ennovum.Observable',
        'ennovum.model.ModelList',
        'ennovum.model.ModelMap',
        'ennovum.worker.WorkerFunction',
        './../views/filter'
    ],
    function (
        environment,
        dom,
        composition,
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
        var ArmadillogFilter = function ArmadillogFilter(config, application) {
            var itc = {
                observable: undefined,

                config: undefined,
                application: undefined,

                filterIdSeq: undefined,
                filterMList: undefined,

                affectTypes: undefined,
                valueTypes: undefined,
                highlightTypes: undefined,

                boxEl: undefined,
                view: undefined,
                filterEls: undefined,

                workerFilter: undefined
            };

            this.TAG_HIGHLIGHT_1_BEGIN_SYMBOL = TAG_HIGHLIGHT_1_BEGIN_SYMBOL;
            this.TAG_HIGHLIGHT_1_END_SYMBOL = TAG_HIGHLIGHT_1_END_SYMBOL;
            this.TAG_HIGHLIGHT_2_BEGIN_SYMBOL = TAG_HIGHLIGHT_2_BEGIN_SYMBOL;
            this.TAG_HIGHLIGHT_2_END_SYMBOL = TAG_HIGHLIGHT_2_END_SYMBOL;
            this.TAG_HIGHLIGHT_3_BEGIN_SYMBOL = TAG_HIGHLIGHT_3_BEGIN_SYMBOL;
            this.TAG_HIGHLIGHT_3_END_SYMBOL = TAG_HIGHLIGHT_3_END_SYMBOL;
            this.TAG_HIGHLIGHT_4_BEGIN_SYMBOL = TAG_HIGHLIGHT_4_BEGIN_SYMBOL;
            this.TAG_HIGHLIGHT_4_END_SYMBOL = TAG_HIGHLIGHT_4_END_SYMBOL;
            this.TAG_HIGHLIGHT_5_BEGIN_SYMBOL = TAG_HIGHLIGHT_5_BEGIN_SYMBOL;
            this.TAG_HIGHLIGHT_5_END_SYMBOL = TAG_HIGHLIGHT_5_END_SYMBOL;
            this.TAG_HIGHLIGHT_6_BEGIN_SYMBOL = TAG_HIGHLIGHT_6_BEGIN_SYMBOL;
            this.TAG_HIGHLIGHT_6_END_SYMBOL = TAG_HIGHLIGHT_6_END_SYMBOL;
            this.TAG_HIGHLIGHT_7_BEGIN_SYMBOL = TAG_HIGHLIGHT_7_BEGIN_SYMBOL;
            this.TAG_HIGHLIGHT_7_END_SYMBOL = TAG_HIGHLIGHT_7_END_SYMBOL;
            this.TAG_HIGHLIGHT_8_BEGIN_SYMBOL = TAG_HIGHLIGHT_8_BEGIN_SYMBOL;
            this.TAG_HIGHLIGHT_8_END_SYMBOL = TAG_HIGHLIGHT_8_END_SYMBOL;
            this.TAG_HIGHLIGHT_9_BEGIN_SYMBOL = TAG_HIGHLIGHT_9_BEGIN_SYMBOL;
            this.TAG_HIGHLIGHT_9_END_SYMBOL = TAG_HIGHLIGHT_9_END_SYMBOL;
            this.TAG_HIGHLIGHT_10_BEGIN_SYMBOL = TAG_HIGHLIGHT_10_BEGIN_SYMBOL;
            this.TAG_HIGHLIGHT_10_END_SYMBOL = TAG_HIGHLIGHT_10_END_SYMBOL;
            this.TAG_HIGHLIGHT_11_BEGIN_SYMBOL = TAG_HIGHLIGHT_11_BEGIN_SYMBOL;
            this.TAG_HIGHLIGHT_11_END_SYMBOL = TAG_HIGHLIGHT_11_END_SYMBOL;
            this.TAG_HIGHLIGHT_12_BEGIN_SYMBOL = TAG_HIGHLIGHT_12_BEGIN_SYMBOL;
            this.TAG_HIGHLIGHT_12_END_SYMBOL = TAG_HIGHLIGHT_12_END_SYMBOL;

            this.filterText = filterText.bind(this, itc);

            this.toString = toString.bind(this, itc);

            init.call(this, itc, config, application);
        };

        //
        var HIDDEN_CLASS = 'hidden';

        //
        var AFFECT_TYPE_SHOW_LINE = '1';
        var AFFECT_TYPE_SHOW = '2';
        var AFFECT_TYPE_HIDE_LINE = '3';
        var AFFECT_TYPE_HIDE = '4';
        var AFFECT_TYPE_HIGHLIGHT_LINE = '5';
        var AFFECT_TYPE_HIGHLIGHT = '6';

        //
        var VALUE_TYPE_TEXT = '1';
        var VALUE_TYPE_REGEXP = '2';

        //
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

        //
        var TAG_HIGHLIGHT_1_BEGIN_SYMBOL = '\uff00\uff80';
        var TAG_HIGHLIGHT_1_END_SYMBOL = '\uff01\uff81';
        var TAG_HIGHLIGHT_2_BEGIN_SYMBOL = '\uff02\uff82';
        var TAG_HIGHLIGHT_2_END_SYMBOL = '\uff03\uff83';
        var TAG_HIGHLIGHT_3_BEGIN_SYMBOL = '\uff04\uff84';
        var TAG_HIGHLIGHT_3_END_SYMBOL = '\uff05\uff85';
        var TAG_HIGHLIGHT_4_BEGIN_SYMBOL = '\uff06\uff86';
        var TAG_HIGHLIGHT_4_END_SYMBOL = '\uff07\uff87';
        var TAG_HIGHLIGHT_5_BEGIN_SYMBOL = '\uff08\uff88';
        var TAG_HIGHLIGHT_5_END_SYMBOL = '\uff09\uff89';
        var TAG_HIGHLIGHT_6_BEGIN_SYMBOL = '\uff0a\uff8a';
        var TAG_HIGHLIGHT_6_END_SYMBOL = '\uff0b\uff8b';
        var TAG_HIGHLIGHT_7_BEGIN_SYMBOL = '\uff0c\uff8c';
        var TAG_HIGHLIGHT_7_END_SYMBOL = '\uff0d\uff8d';
        var TAG_HIGHLIGHT_8_BEGIN_SYMBOL = '\uff0e\uff8e';
        var TAG_HIGHLIGHT_8_END_SYMBOL = '\uff0f\uff8f';
        var TAG_HIGHLIGHT_9_BEGIN_SYMBOL = '\uff10\uff90';
        var TAG_HIGHLIGHT_9_END_SYMBOL = '\uff11\uff91';
        var TAG_HIGHLIGHT_10_BEGIN_SYMBOL = '\uff12\uff92';
        var TAG_HIGHLIGHT_10_END_SYMBOL = '\uff13\uff93';
        var TAG_HIGHLIGHT_11_BEGIN_SYMBOL = '\uff14\uff94';
        var TAG_HIGHLIGHT_11_END_SYMBOL = '\uff15\uff95';
        var TAG_HIGHLIGHT_12_BEGIN_SYMBOL = '\uff16\uff96';
        var TAG_HIGHLIGHT_12_END_SYMBOL = '\uff17\uff97';

        //
        var LIST_STORAGE_NAME = 'filterList';

        /**
         * Initializes instance
         *
         * @param {object} config configuration object
         */
        var init = function ArmadillogFilter_init(itc, config, application) {
            itc.observable = composition.mixin(this, new Observable());

            switch (true) {
                case !configSet(itc, config):
                case !dataInit(itc, application):
                case !viewInit(itc):
                case !uiInit(itc):
                case !storageInit(itc):
                    return false;
                    break;
            }

            return true;
        };

        /**
         * Initializes config
         *
         * @param {object} config configuration object
         */
        var configSet = function ArmadillogFilter_configSet(itc, config) {
            switch (false) {
                case !!config:
                case typeof config === 'object':
                    console.error('ArmadillogFilter', 'configSet', 'invalid input');
                    return false;
            };

            itc.config = {
                boxEl: config.filterBoxEl || null
            };

            return true;
        };

        /**
         * Initializes data
         */
        var dataInit = function ArmadillogFilter_dataInit(itc, application) {
            itc.application = application;

            itc.filterIdSeq = 1;

            itc.filterMList = new ModelList();

            itc.affectTypes = [
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

            itc.valueTypes = [
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

            itc.highlightTypes = [
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

            filterWorkerCreate(itc);

            return true;
        };

        /**
         * Initializes view
         */
        var viewInit = function ArmadillogFilter_viewInit(itc) {
            itc.boxEl = itc.config.boxEl;
            if (!itc.boxEl) {
                console.error('ArmadillogFilter', 'viewCreate', 'invalid boxEl');
                return false;
            };

            itc.view = new ArmadillogFilterView();

            itc.filterEls = itc.view.filterCreate();
            itc.boxEl.appendChild(itc.filterEls.listEl);
            itc.boxEl.appendChild(itc.filterEls.buttonBoxEl);

            return true;
        };

        /**
         * Initializes UI
         */
        var uiInit = function ArmadillogFilter_uiInit(itc) {
            dom.handle(
                itc.filterEls.clearButtonEl, 'click',
                function ArmadillogFilter_inputUiInit_clearButtonElClickHandler(evt) {
                    if (!itc.application.busy.check() && confirm('Are you sure?')) {
                        clear(itc);
                    }
                },
                false, true, true, this);

            dom.handle(
                itc.filterEls.createButtonEl, 'click',
                function ArmadillogFilter_inputUiInit_filterCreateButtonElClickHandler(evt) {
                    if (!itc.application.busy.check()) {
                        var filterItemMMap = filterItemCreate(itc);
                        itc.filterMList.push(filterItemMMap);

                        itc.filterEls.listEl.scrollTop = itc.filterEls.listEl.scrollHeight;
                        filterItemMMap.get('els').valueInputEl.focus();
                    }
                },
                false, true, true, this);

            dom.handle(
                itc.filterEls.submitButtonEl, 'click',
                function ArmadillogFilter_inputUiInit_submitButtonElClickHandler(evt) {
                    if (!itc.application.busy.check()) {
                        submit(itc);
                    }
                },
                false, true, true, this);

            itc.filterMList.on(
                'model-insert',
                function ArmadillogFilter_inputUiInit_filterMListInsertHandler(evt, dataList) {
                    var filterDataList = [];

                    for (var i = 0, l = dataList.length; i < l; i++) {
                        filterDataList.push({
                            'filterIx': dataList[i].ix,
                            'filterItemMMap': dataList[i].valueNew
                        });
                    }

                    filterViewListInsert(itc, filterDataList);
                    itc.observable.trigger('list-insert', {'count': dataList.length});
                });

            itc.filterMList.on(
                'model-update',
                function ArmadillogFilter_inputUiInit_filterMListUpdateHandler(evt, dataList) {
                    var filterDataList = [];

                    for (var i = 0, l = dataList.length; i < l; i++) {
                        filterDataList.push({
                            'filterIx': dataList[i].ix,
                            'filterItemMMap': dataList[i].valueNew
                        });
                    }

                    filterViewListUpdate(itc, filterDataList);
                    itc.observable.trigger('list-update', {'count': dataList.length});
                });

            itc.filterMList.on(
                'model-delete',
                function ArmadillogFilter_inputUiInit_filterMListDeleteHandler(evt, dataList) {
                    var filterDataList = [];

                    for (var i = 0, l = dataList.length; i < l; i++) {
                        filterDataList.push({
                            'filterIx': dataList[i].ix,
                            'filterItemMMap': dataList[i].valueOld
                        });
                    }

                    filterViewListDelete(itc, filterDataList);
                    itc.observable.trigger('list-delete', {'count': dataList.length});
                });

            itc.filterMList.on(
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
                                'filterIx': dataList[i].ix,
                                'filterItemMMap': dataList[i].valueNew
                            });
                        }
                    }

                    if (filterDataList.length) {
                        filterViewListUpdate(itc, filterDataList);
                        itc.observable.trigger('list-update', {'count': dataList.length});
                    }
                });

            itc.observable.on(
                ['list-insert', 'list-delete'],
                function ArmadillogFilter_inputUiInit_handlerListToggle() {
                    dom.classDepend(itc.filterEls.listEl, HIDDEN_CLASS, itc.filterMList.length() === 0);
                    dom.classDepend(itc.filterEls.submitButtonEl, HIDDEN_CLASS, itc.filterMList.length() === 0);
                    dom.classDepend(itc.filterEls.clearButtonEl, HIDDEN_CLASS, itc.filterMList.length() === 0);
                });

            return true;
        };

        /**
         * Initializes storage
         */
        var storageInit = function ArmadillogFilter_storageInit(itc) {
            storageLoad(itc);

            return true;
        };

        /**
         * Creates a filter worker
         */
        var filterWorkerCreate = function ArmadillogFilter_filterWorkerCreate(itc) {
            itc.workerFilter = new WorkerFunction(
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
        var filterItemCreate = function ArmadillogFilter_filterItemCreate(itc, data) {
            if (!data || typeof data !== 'object') {
                data = {};
            }

            var filterItemMMap = new ModelMap(
                'id',
                itc.filterIdSeq++,
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

            filterItemViewCreate(itc, filterItemMMap);

            return filterItemMMap;
        };

        /**
         * Creates a filter item view structure
         *
         * @param {object} filterItemMMap filter item data
         */
        var filterItemViewCreate = function ArmadillogFilter_filterItemViewCreate(itc, filterItemMMap) {
            filterItemMMap.set(
                'els',
                itc.view.filterItemCreate({
                    'id': filterItemMMap.get('id'),
                    'filterAffectTypes': itc.affectTypes,
                    'filterValueTypes': itc.valueTypes,
                    'filterHighlightTypes': itc.highlightTypes
                }));

            return true;
        };

        /**
         * Updates a filter item view structure
         *
         * @param {object} filterItemMMap filter item data
         */
        var filterItemViewUpdate = function ArmadillogFilter_filterItemViewUpdate(itc, filterItemMMap) {
            var filterItemView = filterItemMMap.get('els');

            dom.classDepend(filterItemView.muteEl, HIDDEN_CLASS, filterItemMMap.get('mute'));
            dom.classDepend(filterItemView.unmuteEl, HIDDEN_CLASS, !filterItemMMap.get('mute'));

            dom.selectValue(filterItemView.affectTypeListSelectEl, filterItemMMap.get('affectType'));

            filterItemView.valueInputEl.value = filterItemMMap.get('value') || '';

            dom.selectValue(filterItemView.valueTypeListSelectEl, filterItemMMap.get('valueType'));

            dom.selectValue(filterItemView.highlightTypeListSelectEl, filterItemMMap.get('highlightType'));

            return true;
        };

        /**
         * Initializes filter item UI
         *
         * @param {object} filterItemMMap filter item data
         */
        var filterItemUiInit = function ArmadillogFilter_filterItemUiInit(itc, filterItemMMap) {
            var filterItemView = filterItemMMap.get('els');

            dom.handle(filterItemView.muteEl, 'click', filterMute, false, true, true, this, [itc, filterItemMMap]);
            dom.handle(filterItemView.unmuteEl, 'click', filterUnmute, false, true, true, this, [itc, filterItemMMap]);
            dom.handle(filterItemView.moveUpEl, 'click', filterItemMoveUp, false, true, true, this, [itc, filterItemMMap]);
            dom.handle(filterItemView.moveDownEl, 'click', filterItemMoveDown, false, true, true, this, [itc, filterItemMMap]);

            dom.handle(
                filterItemView.removeEl, 'click',
                function ArmadillogFilter_filterItemUiInit_filterItemViewRemoveElClickHandler(evt) {
                    if (confirm('Are you sure?')) {
                        filterItemRemove(itc, filterItemMMap);
                    }
                }, false, true, true, this);

            dom.handle(
                filterItemView.valueInputEl, 'keypress',
                function ArmadillogFilter_filterItemUiInit_filterItemViewValueInputElKeypressHandler(evt) {
                    if (evt.keyCode === 13) {
                        submit(itc);
                        evt.target.blur();

                        evt.preventDefault();
                        evt.stopPropagation();
                    }
                },
                false, false, false, this);

            return true;
        };

        /**
         * Mutes filter
         *
         * @param {object} filterItemMMap filter item data
         */
        var filterMute = function ArmadillogFilter_filterMute(itc, filterItemMMap) {
            filterItemMMap.set('mute', true);

            var filterItemView = filterItemMMap.get('els');
            dom.classAdd(filterItemView.muteEl, HIDDEN_CLASS);
            dom.classRemove(filterItemView.unmuteEl, HIDDEN_CLASS);

            return true;
        };

        /**
         * Unmutes filter
         *
         * @param {object} filterItemMMap filter item data
         */
        var filterUnmute = function ArmadillogFilter_filterUnmute(itc, filterItemMMap) {
            filterItemMMap.set('mute', false);

            var filterItemView = filterItemMMap.get('els');
            dom.classRemove(filterItemView.muteEl, HIDDEN_CLASS);
            dom.classAdd(filterItemView.unmuteEl, HIDDEN_CLASS);

            return true;
        };

        /**
         * Moves a filter item up
         *
         * @param {object} filterItemMMap filter item data
         */
        var filterItemMoveUp = function ArmadillogFilter_filterItemMoveUp(itc, filterItemMMap) {
            var filterItemIdx = itc.filterMList.indexOf(filterItemMMap);

            if (filterItemIdx === 0) {
                return;
            }

            var filterItemIdxPrev = filterItemIdx - 1;
            var filterItemPrev = itc.filterMList.getAt(filterItemIdxPrev);

            itc.filterMList.setAt(filterItemIdxPrev, filterItemMMap, filterItemIdx, filterItemPrev);

            return true;
        };

        /**
         * Moves filter item down
         *
         * @param {object} filterItemMMap filter item data
         */
        var filterItemMoveDown = function ArmadillogFilter_filterItemMoveDown(itc, filterItemMMap) {
            var filterItemIdx = itc.filterMList.indexOf(filterItemMMap);

            if (filterItemIdx === itc.filterMList.length() - 1) {
                return;
            }

            var filterItemIdxNext = filterItemIdx + 1;
            var filterItemNext = itc.filterMList.getAt(filterItemIdxNext);

            itc.filterMList.setAt(filterItemIdxNext, filterItemMMap, filterItemIdx, filterItemNext);

            return true;
        };

        /**
         * Removes a filter item
         *
         * @param {object} filterItemMMap filter item data
         */
        var filterItemRemove = function ArmadillogFilter_filterItemRemove(itc, filterItemMMap) {
            itc.filterMList.splice(itc.filterMList.indexOf(filterItemMMap), 1);

            return true;
        };

        /**
         * Removes a filter item
         *
         * @param {object} filterItemMMap filter item data
         */
        var clear = function ArmadillogFilter_clear(itc) {
            itc.filterMList.pause();

            while (itc.filterMList.length()) {
                filterItemRemove(itc, itc.filterMList.getAt(0));
            }

            itc.filterMList.unpause();

            return true;
        };

        /**
         * Submits the filter list
         */
        var submit = function ArmadillogFilter_submit(itc) {
            var filterItemMMap;
            var filterItemView;

            itc.filterMList.pause();

            for (var i = 0, l = itc.filterMList.length(); i < l; i++) {
                filterItemMMap = itc.filterMList.getAt(i);
                filterItemView = filterItemMMap.get('els');

                filterItemMMap.set(
                    'affectType',
                    dom.selectValue(filterItemView.affectTypeListSelectEl),
                    'value',
                    filterItemView.valueInputEl.value || '',
                    'valueType',
                    dom.selectValue(filterItemView.valueTypeListSelectEl),
                    'highlightType',
                    dom.selectValue(filterItemView.highlightTypeListSelectEl));
            }

            itc.filterMList.unpause();

            return true;
        };

        /**
         * Handles filter model insert event
         * @param {array} filterDataList model data list
         */
        var filterViewListInsert = function ArmadillogFilter_filterViewListInsert(itc, filterDataList) {
            var filterIx,
                filterItemMMap;

            for (var i = 0, l = filterDataList.length; i < l; i++) {
                filterIx = filterDataList[i].filterIx;
                filterItemMMap = filterDataList[i].filterItemMMap;

                filterItemUiInit(itc, filterItemMMap);
                filterItemViewUpdate(itc, filterItemMMap);

                itc.filterEls.listEl.insertBefore(
                    filterItemMMap.get('els').el,
                    itc.filterEls.listEl.childNodes[filterIx] || null);
            }

            filterViewOrderApply(itc);
            storageSave(itc);

            return true;
        };

        /**
         * Handles filter model update event
         * @param {array} filterDataList model data list
         */
        var filterViewListUpdate = function ArmadillogFilter_filterViewListUpdate(itc, filterDataList) {
            var filterIx,
                filterItemMMap;

            for (var i = 0, l = filterDataList.length; i < l; i++) {
                filterIx = filterDataList[i].filterIx;
                filterItemMMap = filterDataList[i].filterItemMMap;

                filterItemViewUpdate(itc, filterItemMMap);

                itc.filterEls.listEl.insertBefore(
                    filterItemMMap.get('els').el,
                    itc.filterEls.listEl.childNodes[filterIx] || null);
            }

            filterViewOrderApply(itc);
            storageSave(itc);

            return true;
        };

        /**
         * Handles filter model delete event
         * @param {array} filterDataList model data list
         */
        var filterViewListDelete = function ArmadillogFilter_filterViewListDelete(itc, filterDataList) {
            var filterIx,
                filterItemMMap;

            for (var i = 0, l = filterDataList.length; i < l; i++) {
                filterIx = filterDataList[i].filterIx;
                filterItemMMap = filterDataList[i].filterItemMMap;

                itc.filterEls.listEl.removeChild(filterItemMMap.get('els').el);
            }

            filterViewOrderApply(itc);
            storageSave(itc);

            return true;
        };

        /**
         * Applies necessary operations after filter order changed
         */
        var filterViewOrderApply = function ArmadillogFilter_filterViewOrderApply(itc) {
            var filterItemMMap;
            var filterItemView;

            for (var i = 0, l = itc.filterMList.length(); i < l; i++) {
                filterItemMMap = itc.filterMList.getAt(i);
                filterItemView = filterItemMMap.get('els');

                dom.classDepend(filterItemView.moveUpEl, HIDDEN_CLASS, i === 0);
                dom.classDepend(filterItemView.moveDownEl, HIDDEN_CLASS, i === l - 1);
            }

            return true;
        };

        /**
         *
         */
        var storageLoad = function ArmadillogFilter_storageLoad(itc) {
            var storageFilterList = [];
            var filterItemMMap;

            try {
                storageFilterList = JSON.parse(localStorage.getItem(LIST_STORAGE_NAME) || []);
            }
            catch (err) {
                // nothing
            }

            itc.filterMList.pause();

            for (var i = 0, l = storageFilterList.length; i < l; i++) {
                filterItemMMap = filterItemCreate(itc, storageFilterList[i]);
                itc.filterMList.push(filterItemMMap);
            }

            itc.filterMList.unpause();

            return true;
        };

        /**
         *
         */
        var storageSave = function ArmadillogFilter_storageSave(itc) {
            var storageFilterList = [];
            var filterItemMMap;

            for (var i = 0, l = itc.filterMList.length(); i < l; i++) {
                filterItemMMap = itc.filterMList.getAt(i);

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
        var filterText = function ArmadillogFilter_filterText(itc, text, onSuccess) {
            var filterItemMMap;
            var filterList = [], filterItem;

            for (var i = 0, l = itc.filterMList.length(); i < l; i++) {
                filterItemMMap = itc.filterMList.getAt(i);

                filterItem = {
                    'affectType': filterItemMMap.get('affectType'),
                    'highlightType': filterItemMMap.get('highlightType'),
                    'mute': filterItemMMap.get('mute')
                };

                switch (filterItemMMap.get('valueType')) {
                    case VALUE_TYPE_TEXT:
                        try {
                            filterItem.value = utils.escapeRegexp(filterItemMMap.get('value'));
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

            itc.workerFilter.run(
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
        var toString = function ArmadillogFilter_toString(itc) {
            return 'ennovum.ArmadillogFilter';
        }

        //
        return ArmadillogFilter;
    });
