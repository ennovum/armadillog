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
        'ennovum.worker.WorkerDownloader',
        './../views/content'
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
        WorkerDownloader,
        ArmadillogContentView
    ) {
        /**
         * ArmadillogContent constructor
         */
        var ArmadillogContent = function ArmadillogContent(config, application) {
            var itc = {
                observable: undefined,

                config: undefined,
                application: undefined,

                lineMList: undefined,
                lineEscapeRegexp: undefined,

                file: undefined,
                fileUpdateTimeout: undefined,

                url: undefined,
                urlUpdateTimeout: undefined,

                dragging: undefined,

                workerFileReader: undefined,
                workerTextLineSplitter: undefined,

                boxEl: undefined,
                dropEl: undefined,
                view: undefined,
                contentEls: undefined
            };

            this.clear = clear.bind(this, itc);
            this.fileSet = fileSet.bind(this, itc);
            this.urlSet = urlSet.bind(this, itc);
            this.textSet = textSet.bind(this, itc);

            init.call(this, itc, config, application);
        };

        //
        var HIDDEN_CLASS = 'hidden';

        //
        var CONTENT_SIZE_LIMIT = 10000000;
        var CONTENT_LINE_LIMIT = 10000;

        //
        var OVERFLOW_CHUNK_SIZE = 5000;
        var OVERFLOW_DELAY = 500;

        //
        var FILE_UPDATE_DELAY = 1000;
        var URL_UPDATE_DELAY = 1000;

        /**
         * Initializes instance
         *
         * @param {object} config configuration object
         */
        var init = function ArmadillogContent_init(itc, config, application) {
            itc.observable = composition.mixin(this, new Observable());

            switch (true) {
                case !configSet(itc, config):
                case !dataInit(itc, application):
                case !viewInit(itc):
                case !uiInit(itc):
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
        var configSet = function ArmadillogContent_configSet(itc, config) {
            switch (false) {
                case !!config:
                case typeof config === 'object':
                    console.error('ArmadillogContent', 'configSet', 'invalid input');
                    return false;
            };

            itc.config = {
                contentBoxEl: config.contentBoxEl || null,
                contentScrollEl: config.contentScrollEl || null,
                contentDropEl: config.contentDropEl || null
            };

            return true;
        };

        /**
         * Initializes data
         */
        var dataInit = function ArmadillogContent_dataInit(itc, application) {
            itc.application = application;

            itc.lineMList = new ModelList();

            itc.lineEscapeRegexp = new RegExp(
                [
                    itc.application.filter.TAG_HIGHLIGHT_1_BEGIN_SYMBOL,
                    itc.application.filter.TAG_HIGHLIGHT_1_END_SYMBOL,
                    itc.application.filter.TAG_HIGHLIGHT_2_BEGIN_SYMBOL,
                    itc.application.filter.TAG_HIGHLIGHT_2_END_SYMBOL,
                    itc.application.filter.TAG_HIGHLIGHT_3_BEGIN_SYMBOL,
                    itc.application.filter.TAG_HIGHLIGHT_3_END_SYMBOL,
                    itc.application.filter.TAG_HIGHLIGHT_4_BEGIN_SYMBOL,
                    itc.application.filter.TAG_HIGHLIGHT_4_END_SYMBOL,
                    itc.application.filter.TAG_HIGHLIGHT_5_BEGIN_SYMBOL,
                    itc.application.filter.TAG_HIGHLIGHT_5_END_SYMBOL,
                    itc.application.filter.TAG_HIGHLIGHT_6_BEGIN_SYMBOL,
                    itc.application.filter.TAG_HIGHLIGHT_6_END_SYMBOL,
                    itc.application.filter.TAG_HIGHLIGHT_7_BEGIN_SYMBOL,
                    itc.application.filter.TAG_HIGHLIGHT_7_END_SYMBOL,
                    itc.application.filter.TAG_HIGHLIGHT_8_BEGIN_SYMBOL,
                    itc.application.filter.TAG_HIGHLIGHT_8_END_SYMBOL,
                    itc.application.filter.TAG_HIGHLIGHT_9_BEGIN_SYMBOL,
                    itc.application.filter.TAG_HIGHLIGHT_9_END_SYMBOL,
                    itc.application.filter.TAG_HIGHLIGHT_10_BEGIN_SYMBOL,
                    itc.application.filter.TAG_HIGHLIGHT_10_END_SYMBOL,
                    itc.application.filter.TAG_HIGHLIGHT_11_BEGIN_SYMBOL,
                    itc.application.filter.TAG_HIGHLIGHT_11_END_SYMBOL,
                    itc.application.filter.TAG_HIGHLIGHT_12_BEGIN_SYMBOL,
                    itc.application.filter.TAG_HIGHLIGHT_12_END_SYMBOL
                ].join('|'),
                'gi'),

            itc.file = null;
            itc.fileUpdateTimeout = null;

            itc.url = null;
            itc.urlUpdateTimeout = null;

            itc.dragging = false;

            itc.workerFileReader = new WorkerDownloader();

            itc.workerTextLineSplitter = new WorkerFunction(
                function ArmadillogContent_dataInit_workerTextLineSplitter(data, success, error) {
                    var lineList = data.text.split(/\r?\n/g);
                    var ix = 0;
                    var length = lineList.length;
                    var lengthOriginal = length;

                    if (data.limit && length > Math.abs(data.limit)) {
                        if (data.limit < 0) {
                            ix = Math.max(0, lineList.length + data.limit);
                        }
                        else {
                            length = Math.min(lineList.length, data.limit);
                        }
                    }

                    for (var i = ix, l = length; i < l; i++) {
                        success(
                            {
                                'ix': i - ix,
                                'text': lineList[i]
                            },
                            null);
                    }

                    success(
                        {
                            'count': length - ix,
                            'countOriginal': lengthOriginal
                        },
                        null);
            });

            return true;
        };

        /**
         * Initializes view
         */
        var viewInit = function ArmadillogContent_viewInit(itc) {
            itc.boxEl = itc.config.contentBoxEl;
            if (!itc.boxEl) {
                console.error('ArmadillogContent', 'viewInit', 'invalid contentBoxEl');
                return false;
            };

            itc.dropEl = itc.config.contentDropEl;

            itc.view = new ArmadillogContentView();

            itc.contentEls = itc.view.contentCreate();
            itc.boxEl.appendChild(itc.contentEls.frameEl);

            return true;
        };

        /**
         * Initializes UI
         */
        var uiInit = function ArmadillogContent_uiInit(itc) {
            dom.handle(
                itc.dropEl, 'dragstart', false, false, true,
                function ArmadillogContent_uiInit_dropElDragstartHandler(evt) {
                    itc.dragging = true;
                },
                this);

            dom.handle(
                itc.dropEl, 'dragover', false, true, true,
                function ArmadillogContent_uiInit_dropElDragovertHandler(evt) {
                    evt.dataTransfer.dropEffect = itc.dragging ? 'none' : 'copy';
                },
                this);

            dom.handle(
                itc.dropEl, 'dragend', false, true, true,
                function ArmadillogContent_uiInit_dropElDragendHandler(evt) {
                    itc.dragging = false;
                },
                this);

            dom.handle(
                itc.dropEl, 'drop', false, true, true,
                function ArmadillogContent_uiInit_dropElDropHandler(evt) {
                    if (itc.dragging) {
                        return;
                    }

                    var files = evt.dataTransfer.files;
                    if (files.length) {
                        clear(itc);
                        fileSet(itc, files[0], files[0].name);
                    }

                    var data = evt.dataTransfer.getData('text/plain');
                    if (data) {
                        clear(itc);
                        textSet(itc, data, '(dragged text)');
                    }
                },
                this);

            dom.handle(
                itc.contentEls.lineListEl, 'click', false, true, true,
                function ArmadillogContent_uiInit_lineListElClickHandler(evt) {
                    var lineEl;

                    lineEl = evt.target;
                    while (lineEl && lineEl.parentNode !== itc.contentEls.lineListEl) {
                        lineEl = lineEl.parentNode;
                    }
                    if (lineEl) {
                        if (dom.classContains(lineEl, 'selected')) {
                            dom.classRemove(lineEl, 'selected');

                            itc.application.examine.clear();
                        }
                        else {
                            dom.classRemove(itc.contentEls.lineListEl.querySelector('.selected'), 'selected');
                            dom.classAdd(lineEl, 'selected');

                            var lineItemMMap = itc.lineMList.getAt(~~lineEl.getAttribute('data-ix'));
                            itc.application.examine.set(lineItemMMap);
                        }
                    }
                },
                this);

            dom.handle(
                itc.contentEls.lineListEl, 'dblclick', false, true, true,
                function ArmadillogContent_uiInit_lineListElDblclickHandler(evt) {
                    var lineEl;

                    lineEl = evt.target
                    while (lineEl && lineEl.parentNode !== itc.contentEls.lineListEl) {
                        lineEl = lineEl.parentNode;
                    }
                    if (lineEl) {
                        dom.classToggle(lineEl, 'marked');
                    }
                },
                this);

            itc.lineMList.handle(
                'model-insert',
                function ArmadillogContent_uiInit_lineMListInsertHandler(evt, dataList) {
                    var lineViewList = [];
                    var lineList = [];

                    for (var i = 0, l = dataList.length; i < l; i++) {
                        lineViewList.push({
                            'lineIx': dataList[i].ix,
                            'lineItemMMap': dataList[i].valueNew
                        });
                        lineList.push(dataList[i].valueNew);
                    }

                    lineViewListInsert(itc, lineViewList);
                    lineListFilter(itc, lineList);
                });

            itc.lineMList.handle(
                'model-update',
                function ArmadillogContent_uiInit_lineMListUpdateHandler(evt, dataList) {
                    var lineViewList = [];
                    var lineList = [];

                    for (var i = 0, l = dataList.length; i < l; i++) {
                        lineViewList.push({
                            'lineIx': dataList[i].ix,
                            'lineItemMMap': dataList[i].valueNew
                        });
                        lineList.push(dataList[i].valueNew);
                    }

                    lineViewListUpdate(itc, lineViewList);
                    lineListFilter(itc, lineList);
                });

            itc.lineMList.handle(
                'model-delete',
                function ArmadillogContent_uiInit_lineMListDeleteHandler(evt, dataList) {
                    var lineViewList = [];

                    for (var i = 0, l = dataList.length; i < l; i++) {
                        lineViewList.push({
                            'lineIx': dataList[i].ix,
                            'lineItemMMap': dataList[i].valueOld
                        });
                    }

                    lineViewListDelete(itc, lineViewList);
                });

            itc.lineMList.handle(
                'model-forward',
                function ArmadillogContent_uiInit_lineMListForwardHandler(evt, dataList) {
                    var lineViewList = [];
                    var lineList = [];

                    for (var i = 0, l = dataList.length; i < l; i++) {
                        if (
                            dataList[i].event === 'model-update' &&
                            dataList[i].dataList.some(function (dataItem) {
                                return ~['textFiltered', 'hidden'].indexOf(dataItem.key);
                            })
                        ) {
                            lineViewList.push({
                                'lineIx': dataList[i].ix,
                                'lineItemMMap': dataList[i].valueNew
                            });
                        }
                        if (
                            dataList[i].event === 'model-update' &&
                            dataList[i].dataList.some(function (dataItem) {
                                return ~['textRaw'].indexOf(dataItem.key);
                            })
                        ) {
                            lineList.push(dataList[i].valueNew);
                        }
                    }

                    if (lineViewList.length) {
                        lineViewListUpdate(itc, lineViewList);
                    }
                    if (lineList.length) {
                        lineListFilter(itc, lineList);
                    }
                });

            itc.application.filter.handle(
                ['list-insert', 'list-update', 'list-delete'],
                function ArmadillogContent_uiInit_handlerFilterApplier(evt) {
                    filterApply(itc);
                });

            return true;
        };

        /**
         * Clears content
         */
        var clear = function ArmadillogContent_clear(itc) {
            itc.file = null;
            fileUpdateUnschedule(itc);

            itc.url = null;
            urlUpdateUnschedule(itc);

            itc.lineMList.splice(0, itc.lineMList.length());
            itc.application.examine.clear();

            itc.observable.trigger('source-change', {'label': null});

            return true;
        };

        /**
         * Sets a content file
         *
         * @param {object} file object (e. g. evt.target.files[0])
         * @param {string} label content's label
         */
        var fileSet = function ArmadillogContent_fileSet(itc, file, label) {
            itc.file = file;

            itc.workerFileReader.run(
                {
                    'url': URL.createObjectURL(itc.file),
                    'limit': 0 - CONTENT_SIZE_LIMIT
                },
                null,
                function ArmadillogContent_fileSet_workerFileReaderSuccess(data, additional) {
                    URL.revokeObjectURL(data.url);
                    textSet(itc, data.result, label);
                    fileUpdateSchedule(itc);
                },
                function ArmadillogContent_fileSet_workerFileReaderFailure() {
                    alert('An error occured, please try another input method.');
                },
                this);

            return true;
        };

        /**
         * Updates the content file
         */
        var fileUpdate = function ArmadillogContent_fileUpdate(itc) {
            if (!itc.file) {
                return;
            }

            if (itc.application.busy.check() || itc.lineMList.queued()) {
                fileUpdateSchedule(itc);
                return;
            }

            itc.workerFileReader.run(
                {
                    'url': URL.createObjectURL(itc.file),
                    'limit': 0 - CONTENT_SIZE_LIMIT
                },
                null,
                function ArmadillogContent_fileUpdate_workerFileReaderSuccess(data, additional) {
                    URL.revokeObjectURL(data.url);

                    if (itc.file) {
                        textUpdate(itc, data.result);
                        fileUpdateSchedule(itc);
                    }
                },
                function ArmadillogContent_fileUpdate_workerFileReaderFailure() {
                    alert('An error occured, please try another input method.');
                },
                this);

            return true;
        };

        /**
         * Schedules a content file update
         */
        var fileUpdateSchedule = function ArmadillogContent_fileUpdateSchedule(itc) {
            if (FILE_UPDATE_DELAY > 0) {
                itc.fileUpdateTimeout = setTimeout(
                    fileUpdate.bind(this, itc),
                    FILE_UPDATE_DELAY);
            }

            return true;
        };

        /**
         * Unschedules a content file update
         */
        var fileUpdateUnschedule = function ArmadillogContent_fileUpdateUnschedule(itc) {
            if (itc.fileUpdateTimeout) {
                clearTimeout(itc.fileUpdateTimeout);
                itc.fileUpdateTimeout = null;
            }

            return true;
        };

        /**
         * Sets a content url
         *
         * @param {string} url content's url
         * @param {string} label content's label
         */
        var urlSet = function ArmadillogContent_urlSet(itc, url, label) {
            url = utils.validateUrl(url);
            if (!url) {
                alert('Invalid URL.');
                return;
            }

            itc.url = url;

            itc.workerFileReader.run(
                {
                    'url': itc.url,
                    'limit': 0 - CONTENT_SIZE_LIMIT
                },
                null,
                function ArmadillogContent_urlSet_workerFileReaderSuccess(data, additional) {
                    textSet(itc, data.result, label);
                    urlUpdateSchedule(itc);
                },
                function ArmadillogContent_urlSet_workerFileReaderFailure() {
                    alert('An error occured, please try another input method.');
                },
                this);

            return true;
        };

        /**
         * Updates the content url
         */
        var urlUpdate = function ArmadillogContent_urlUpdate(itc) {
            if (!itc.url) {
                return;
            }

            if (itc.application.busy.check() || itc.lineMList.queued()) {
                urlUpdateSchedule(itc);
                return;
            }

            itc.workerFileReader.run(
                {
                    'url': itc.url,
                    'limit': 0 - CONTENT_SIZE_LIMIT
                },
                null,
                function ArmadillogContent_urlUpdate_workerFileReaderSuccess(data, additional) {
                    if (itc.url) {
                        textUpdate(itc, data.result);
                        urlUpdateSchedule(itc);
                    }
                },
                function ArmadillogContent_urlUpdate_workerFileReaderFailure() {
                    alert('An error occured, please try another input method.');
                },
                this);

            return true;
        };

        /**
         * Schedules a content url update
         */
        var urlUpdateSchedule = function ArmadillogContent_urlUpdateSchedule(itc) {
            if (URL_UPDATE_DELAY > 0) {
                itc.urlUpdateTimeout = setTimeout(
                    urlUpdate.bind(this, itc),
                    URL_UPDATE_DELAY);
            }

            return true;
        };

        /**
         * Unschedules a content url update
         */
        var urlUpdateUnschedule = function ArmadillogContent_urlUpdateUnschedule(itc) {
            if (itc.urlUpdateTimeout) {
                clearTimeout(itc.urlUpdateTimeout);
                itc.urlUpdateTimeout = null;
            }

            return true;
        };

        /**
         * Sets a piece of content
         *
         * @param {string} text a piece of content
         * @param {string} label content's label
         */
        var textSet = function ArmadillogContent_textSet(itc, text, label) {
            itc.lineMList.pause();

            itc.workerTextLineSplitter.run(
                {
                    'text': text,
                    'limit': 0 - CONTENT_LINE_LIMIT
                },
                null,
                function ArmadillogContent_textSet_workerTextLineSplitterSuccess(data, additional) {
                    if ('text' in data) {
                        var lineItemMMap = new ModelMap('textRaw', data.text, 'textFiltered', null, 'hidden', true, 'els', null);
                        itc.lineMList.setAt(data.ix, lineItemMMap);
                    }

                    if ('count' in data) {
                        itc.lineMList.unpause();
                    }
                },
                null,
                this);

            itc.observable.trigger('source-change', {'label': label});

            return true;
        };

        /**
         * Updates the piece of content
         *
         * @param {string} text a piece of content
         */
        var textUpdate = function ArmadillogContent_textUpdate(itc, text) {
            itc.lineMList.pause();

            itc.workerTextLineSplitter.run(
                {
                    'text': text,
                    'limit': 0 - CONTENT_LINE_LIMIT
                },
                null,
                function ArmadillogContent_textUpdate_workerTextLineSplitterSuccess(data, additional) {
                    if ('text' in data) {
                        var lineItemMMap = itc.lineMList.getAt(data.ix);

                        if (lineItemMMap) {
                            lineItemMMap.set('textRaw', data.text);
                        }
                        else {
                            lineItemMMap = new ModelMap('textRaw', data.text, 'textFiltered', null, 'hidden', true, 'els', null);
                            itc.lineMList.setAt(data.ix, lineItemMMap);
                        }
                    }

                    if ('count' in data) {
                        if (data.count < itc.lineMList.length()) {
                            itc.lineMList.splice(data.count);
                        }

                        itc.lineMList.unpause();
                    }
                },
                null,
                this);

            return true;
        };

        /**
         * Applies filters to content
         */
        var filterApply = function ArmadillogContent_filterApply(itc) {
            lineListFilter(itc, itc.lineMList.toArray());

            return true;
        };

        /**
         * Creates a content line view structure
         *
         * @param {number} lineIx index in result source
         * @param {object} lineItemMMap content line model object
         */
        var lineItemViewCreate = function ArmadillogContent_lineItemViewCreate(itc, lineIx, lineItemMMap) {
            lineItemMMap.set(
                'els',
                itc.view.contentLineItemCreate({
                    'number': lineIx + 1
                }));

            return true;
        };

        /**
         * Updates a content line view structure
         *
         * @param {number} lineIx index in result source
         * @param {object} lineItemMMap content line model object
         */
        var lineItemViewUpdate = function ArmadillogContent_lineItemViewUpdate(itc, lineIx, lineItemMMap) {
            var lineEl = lineItemMMap.get('els').el;
            var textFiltered = lineItemMMap.get('textFiltered');

            if (textFiltered !== null) {
                lineEl.innerHTML = utils.escapeXML(textFiltered).replace(
                    itc.lineEscapeRegexp,
                    function (match) {
                        switch (match) {
                            case itc.application.filter.TAG_HIGHLIGHT_1_BEGIN_SYMBOL: return '<span class= "highlight highlight-1">';
                            case itc.application.filter.TAG_HIGHLIGHT_1_END_SYMBOL: return '</span>';
                            case itc.application.filter.TAG_HIGHLIGHT_2_BEGIN_SYMBOL: return '<span class= "highlight highlight-2">';
                            case itc.application.filter.TAG_HIGHLIGHT_2_END_SYMBOL: return '</span>';
                            case itc.application.filter.TAG_HIGHLIGHT_3_BEGIN_SYMBOL: return '<span class= "highlight highlight-3">';
                            case itc.application.filter.TAG_HIGHLIGHT_3_END_SYMBOL: return '</span>';
                            case itc.application.filter.TAG_HIGHLIGHT_4_BEGIN_SYMBOL: return '<span class= "highlight highlight-4">';
                            case itc.application.filter.TAG_HIGHLIGHT_4_END_SYMBOL: return '</span>';
                            case itc.application.filter.TAG_HIGHLIGHT_5_BEGIN_SYMBOL: return '<span class= "highlight highlight-5">';
                            case itc.application.filter.TAG_HIGHLIGHT_5_END_SYMBOL: return '</span>';
                            case itc.application.filter.TAG_HIGHLIGHT_6_BEGIN_SYMBOL: return '<span class= "highlight highlight-6">';
                            case itc.application.filter.TAG_HIGHLIGHT_6_END_SYMBOL: return '</span>';
                            case itc.application.filter.TAG_HIGHLIGHT_7_BEGIN_SYMBOL: return '<span class= "highlight highlight-7">';
                            case itc.application.filter.TAG_HIGHLIGHT_7_END_SYMBOL: return '</span>';
                            case itc.application.filter.TAG_HIGHLIGHT_8_BEGIN_SYMBOL: return '<span class= "highlight highlight-8">';
                            case itc.application.filter.TAG_HIGHLIGHT_8_END_SYMBOL: return '</span>';
                            case itc.application.filter.TAG_HIGHLIGHT_9_BEGIN_SYMBOL: return '<span class= "highlight highlight-9">';
                            case itc.application.filter.TAG_HIGHLIGHT_9_END_SYMBOL: return '</span>';
                            case itc.application.filter.TAG_HIGHLIGHT_10_BEGIN_SYMBOL: return '<span class= "highlight highlight-10">';
                            case itc.application.filter.TAG_HIGHLIGHT_10_END_SYMBOL: return '</span>';
                            case itc.application.filter.TAG_HIGHLIGHT_11_BEGIN_SYMBOL: return '<span class= "highlight highlight-11">';
                            case itc.application.filter.TAG_HIGHLIGHT_11_END_SYMBOL: return '</span>';
                            case itc.application.filter.TAG_HIGHLIGHT_12_BEGIN_SYMBOL: return '<span class= "highlight highlight-12">';
                            case itc.application.filter.TAG_HIGHLIGHT_12_END_SYMBOL: return '</span>';
                        }
                        return '';
                    });
            }

            dom.classDepend(lineEl, HIDDEN_CLASS, lineItemMMap.get('hidden'));

            return true;
        };

        /**
         * Inserts a line of source in view
         *
         * @param {array} lineViewList lineIx & lineItemMMap list
         * @param {number} chunkIx chunk index
         * @param {number} chunkSize chunk size
         */
        var lineViewListInsert = function ArmadillogContent_lineViewListInsert(itc, lineViewList, chunkIx, chunkSize) {
            requestAnimationFrame(function ArmadillogContent_lineViewListInsert_animationFrame() {
                itc.application.busy.set(true, 'lineViewListInsert');

                chunkIx = typeof chunkIx === 'undefined' ? 0 : chunkIx;
                chunkSize = typeof chunkSize === 'undefined' ? lineViewList.length - chunkIx : Math.min(chunkSize, lineViewList.length - chunkIx);

                var lineIx, lineItemMMap, lineItemView;
                var documentFragment = document.createDocumentFragment();

                for (var i = 0; i < chunkSize && i < OVERFLOW_CHUNK_SIZE; i++) {
                    lineIx = lineViewList[chunkIx + i].lineIx;
                    lineItemMMap = lineViewList[chunkIx + i].lineItemMMap;

                    lineItemViewCreate(itc, lineIx, lineItemMMap);
                    lineItemView = lineItemMMap.get('els');

                    lineItemView.el.setAttribute('data-ix', lineIx);

                    lineItemViewUpdate(itc, lineIx, lineItemMMap);

                    documentFragment.appendChild(lineItemView.el);
                }

                itc.contentEls.lineListEl.insertBefore(
                    documentFragment,
                    itc.contentEls.lineListEl.childNodes[lineViewList[chunkIx].lineIx] || null);

                if (chunkSize > OVERFLOW_CHUNK_SIZE) {
                    setTimeout(
                        function ArmadillogContent_lineViewListInsert_overflowChunk() {
                            lineViewListInsert(itc, lineViewList, chunkIx + OVERFLOW_CHUNK_SIZE);
                        },
                        OVERFLOW_DELAY);
                }
                else {
                    itc.application.busy.set(false, 'lineViewListInsert');

                    itc.observable.trigger('view-change');
                }
            });

            return true;
        };

        /**
         * Updates a line of source in view
         *
         * @param {array} lineViewList lineIx & lineItemMMap list
         * @param {number} chunkIx chunk index
         * @param {number} chunkSize chunk size
         */
        var lineViewListUpdate = function ArmadillogContent_lineViewListUpdate(itc, lineViewList, chunkIx, chunkSize) {
            requestAnimationFrame(function ArmadillogContent_lineViewListUpdate_animationFrame() {
                itc.application.busy.set(true, 'lineViewListUpdate');

                chunkIx = typeof chunkIx === 'undefined' ? 0 : chunkIx;
                chunkSize = typeof chunkSize === 'undefined' ? lineViewList.length - chunkIx : Math.min(chunkSize, lineViewList.length - chunkIx);

                var lineIx, lineItemMMap;

                for (var i = 0; i < chunkSize && i < OVERFLOW_CHUNK_SIZE; i++) {
                    lineIx = lineViewList[chunkIx + i].lineIx;
                    lineItemMMap = lineViewList[chunkIx + i].lineItemMMap;

                    lineItemViewUpdate(itc, lineIx, lineItemMMap);
                }

                if (chunkSize > OVERFLOW_CHUNK_SIZE) {
                    setTimeout(
                        function ArmadillogContent_lineViewListUpdate_overflowChunk() {
                            lineViewListUpdate(itc, lineViewList, chunkIx + OVERFLOW_CHUNK_SIZE);
                        },
                        OVERFLOW_DELAY);
                }
                else {
                    itc.application.busy.set(false, 'lineViewListUpdate');

                    itc.observable.trigger('view-change');
                }
            });

            return true;
        };

        /**
         * Deletes a line of source in view
         *
         * @param {array} lineViewList lineIx & lineItemMMap list
         * @param {number} chunkIx chunk index
         * @param {number} chunkSize chunk size
         */
        var lineViewListDelete = function ArmadillogContent_lineViewListDelete(itc, lineViewList, chunkIx, chunkSize) {
            requestAnimationFrame(function ArmadillogContent_lineViewListDelete_animationFrame() {
                itc.application.busy.set(true, 'lineViewListDelete');

                chunkIx = typeof chunkIx === 'undefined' ? 0 : chunkIx;
                chunkSize = typeof chunkSize === 'undefined' ? lineViewList.length - chunkIx : Math.min(chunkSize, lineViewList.length - chunkIx);

                var lineIx, lineItemMMap;

                for (var i = 0; i < chunkSize && i < OVERFLOW_CHUNK_SIZE; i++) {
                    lineIx = lineViewList[chunkIx + i].lineIx;
                    lineItemMMap = lineViewList[chunkIx + i].lineItemMMap;

                    itc.contentEls.lineListEl.removeChild(lineItemMMap.get('els').el);
                }

                if (chunkSize > OVERFLOW_CHUNK_SIZE) {
                    setTimeout(
                        function ArmadillogContent_lineViewListDelete_overflowChunk() {
                            lineViewListDelete(itc, lineViewList, chunkIx + OVERFLOW_CHUNK_SIZE);
                        },
                        OVERFLOW_DELAY);
                }
                else {
                    itc.application.busy.set(false, 'lineViewListDelete');

                    itc.observable.trigger('view-change');
                }
            });

            return true;
        };

        /**
         * Performs filtering of a line list
         *
         * @param {object} lineList content line list model object
         */
        var lineListFilter = function ArmadillogContent_lineListFilter(itc, lineList) {
            itc.application.busy.set(true, 'lineListFilter');

            var lineItemMMap;

            for (var i = 0, l = lineList.length; i < l; i++) {
                lineItemMMap = lineList[i];

                itc.lineMList.pause();

                itc.application.filter.filterText(
                    lineItemMMap.get('textRaw'),
                    function (lineItemMMap, result) {
                        lineItemMMap.set(
                            'textFiltered',
                            result.text,
                            'hidden',
                            result.hidden);

                        itc.lineMList.unpause();
                    }.bind(this, lineItemMMap));
            }

            itc.lineMList.queue(itc.application.busy.set, true, this, [false, 'lineListFilter']);

            return true;
        };

        //
        return ArmadillogContent;
    });
