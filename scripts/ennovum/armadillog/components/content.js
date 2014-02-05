'use strict';

define(
    [
        'ennovum.environment',
        'ennovum.dom',
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
        var ArmadillogContent = function ArmadillogContent() {
            var HIDDEN_CLASS = 'hidden';

            var CONTENT_SIZE_LIMIT = 10000000;
            var CONTENT_LINE_LIMIT = 10000;

            var OVERFLOW_CHUNK_SIZE = 5000;
            var OVERFLOW_DELAY = 500;

            var FILE_UPDATE_DELAY = 1000;
            var URL_UPDATE_DELAY = 1000;

            var observable;

            var config;
            var application;

            var lineMList;
            var lineEscapeRegexp;

            var file;
            var fileUpdateTimeout;

            var url;
            var urlUpdateTimeout;

            var dragging;

            var workerFileReader;
            var workerTextLineSplitter;

            var boxEl;
            var dropEl;
            var view;
            var contentEls;

            /**
             * Initializes instance
             *
             * @param {object} argConfig configuration object
             */
            var init = function ArmadillogContent_init(argConfig, argApplication) {
                observable = utils.obj.mixin(this, new Observable());

                switch (true) {
                    case !configSet(argConfig):
                    case !dataInit(argApplication):
                    case !viewInit():
                    case !uiInit():
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
            var configSet = function ArmadillogContent_configSet(argConfig) {
                switch (false) {
                    case !!argConfig:
                    case typeof argConfig === 'object':
                        console.error('ArmadillogContent', 'configSet', 'invalid input');
                        return false;
                };

                config = {
                    contentBoxEl: argConfig.contentBoxEl || null,
                    contentScrollEl: argConfig.contentScrollEl || null,
                    contentDropEl: argConfig.contentDropEl || null
                };

                return true;
            };

            /**
             * Initializes data
             */
            var dataInit = function ArmadillogContent_dataInit(argApplication) {
                application = argApplication;

                lineMList = new ModelList();

                lineEscapeRegexp = new RegExp(
                    [
                        application.filter.TAG_HIGHLIGHT_1_BEGIN_SYMBOL,
                        application.filter.TAG_HIGHLIGHT_1_END_SYMBOL,
                        application.filter.TAG_HIGHLIGHT_2_BEGIN_SYMBOL,
                        application.filter.TAG_HIGHLIGHT_2_END_SYMBOL,
                        application.filter.TAG_HIGHLIGHT_3_BEGIN_SYMBOL,
                        application.filter.TAG_HIGHLIGHT_3_END_SYMBOL,
                        application.filter.TAG_HIGHLIGHT_4_BEGIN_SYMBOL,
                        application.filter.TAG_HIGHLIGHT_4_END_SYMBOL,
                        application.filter.TAG_HIGHLIGHT_5_BEGIN_SYMBOL,
                        application.filter.TAG_HIGHLIGHT_5_END_SYMBOL,
                        application.filter.TAG_HIGHLIGHT_6_BEGIN_SYMBOL,
                        application.filter.TAG_HIGHLIGHT_6_END_SYMBOL,
                        application.filter.TAG_HIGHLIGHT_7_BEGIN_SYMBOL,
                        application.filter.TAG_HIGHLIGHT_7_END_SYMBOL,
                        application.filter.TAG_HIGHLIGHT_8_BEGIN_SYMBOL,
                        application.filter.TAG_HIGHLIGHT_8_END_SYMBOL,
                        application.filter.TAG_HIGHLIGHT_9_BEGIN_SYMBOL,
                        application.filter.TAG_HIGHLIGHT_9_END_SYMBOL,
                        application.filter.TAG_HIGHLIGHT_10_BEGIN_SYMBOL,
                        application.filter.TAG_HIGHLIGHT_10_END_SYMBOL,
                        application.filter.TAG_HIGHLIGHT_11_BEGIN_SYMBOL,
                        application.filter.TAG_HIGHLIGHT_11_END_SYMBOL,
                        application.filter.TAG_HIGHLIGHT_12_BEGIN_SYMBOL,
                        application.filter.TAG_HIGHLIGHT_12_END_SYMBOL
                    ].join('|'),
                    'gi'),

                file = null;
                fileUpdateTimeout = null;

                url = null;
                urlUpdateTimeout = null;

                dragging = false;

                workerFileReader = new WorkerDownloader();

                workerTextLineSplitter = new WorkerFunction(
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
            var viewInit = function ArmadillogContent_viewInit() {
                boxEl = config.contentBoxEl;
                if (!boxEl) {
                    console.error('ArmadillogContent', 'viewInit', 'invalid contentBoxEl');
                    return false;
                };

                dropEl = config.contentDropEl;

                view = new ArmadillogContentView();

                contentEls = view.contentCreate();
                boxEl.appendChild(contentEls.frameEl);

                return true;
            };

            /**
             * Initializes UI
             */
            var uiInit = function ArmadillogContent_uiInit() {
                dom.handle(
                    dropEl, 'dragstart',
                    function ArmadillogContent_uiInit_dropElDragstartHandler(evt) {
                        dragging = true;
                    },
                    false, false, true, this);

                dom.handle(
                    dropEl, 'dragover',
                    function ArmadillogContent_uiInit_dropElDragovertHandler(evt) {
                        evt.dataTransfer.dropEffect = dragging ? 'none' : 'copy';
                    },
                    false, true, true, this);

                dom.handle(
                    dropEl, 'dragend',
                    function ArmadillogContent_uiInit_dropElDragendHandler(evt) {
                        dragging = false;
                    },
                    false, true, true, this);

                dom.handle(
                    dropEl, 'drop',
                    function ArmadillogContent_uiInit_dropElDropHandler(evt) {
                        if (dragging) {
                            return;
                        }

                        var files = evt.dataTransfer.files;
                        if (files.length) {
                            clear();
                            fileSet(files[0], files[0].name);
                        }

                        var data = evt.dataTransfer.getData('text/plain');
                        if (data) {
                            clear();
                            textSet(data, '(dragged text)');
                        }
                    },
                    false, true, true, this);

                dom.handle(
                    contentEls.lineListEl, 'click',
                    function ArmadillogContent_uiInit_lineListElClickHandler(evt) {
                        var lineEl;

                        lineEl = evt.target;
                        while (lineEl && lineEl.parentNode !== contentEls.lineListEl) {
                            lineEl = lineEl.parentNode;
                        }
                        if (lineEl) {
                            if (dom.classContains(lineEl, 'selected')) {
                                dom.classRemove(lineEl, 'selected');

                                application.examine.clear();
                            }
                            else {
                                dom.classRemove(contentEls.lineListEl.querySelector('.selected'), 'selected');
                                dom.classAdd(lineEl, 'selected');

                                var lineItemMMap = lineMList.getAt(~~lineEl.getAttribute('data-ix'));
                                application.examine.set(lineItemMMap);
                            }
                        }
                    },
                    false, true, true, this);

                dom.handle(
                    contentEls.lineListEl, 'dblclick',
                    function ArmadillogContent_uiInit_lineListElDblclickHandler(evt) {
                        var lineEl;

                        lineEl = evt.target
                        while (lineEl && lineEl.parentNode !== contentEls.lineListEl) {
                            lineEl = lineEl.parentNode;
                        }
                        if (lineEl) {
                            dom.classToggle(lineEl, 'marked');
                        }
                    },
                    false, true, true, this);

                lineMList.on(
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

                        lineViewListInsert(lineViewList);
                        lineListFilter(lineList);
                    });

                lineMList.on(
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

                        lineViewListUpdate(lineViewList);
                        lineListFilter(lineList);
                    });

                lineMList.on(
                    'model-delete',
                    function ArmadillogContent_uiInit_lineMListDeleteHandler(evt, dataList) {
                        var lineViewList = [];

                        for (var i = 0, l = dataList.length; i < l; i++) {
                            lineViewList.push({
                                'lineIx': dataList[i].ix,
                                'lineItemMMap': dataList[i].valueOld
                            });
                        }

                        lineViewListDelete(lineViewList);
                    });

                lineMList.on(
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
                            lineViewListUpdate(lineViewList);
                        }
                        if (lineList.length) {
                            lineListFilter(lineList);
                        }
                    });

                application.filter.on(
                    ['list-insert', 'list-update', 'list-delete'],
                    function ArmadillogContent_uiInit_handlerFilterApplier(evt) {
                        filterApply();
                    });

                return true;
            };

            /**
             * Clears content
             */
            var clear = this.clear = function ArmadillogContent_clear() {
                file = null;
                fileUpdateUnschedule();

                url = null;
                urlUpdateUnschedule();

                lineMList.splice(0, lineMList.length());
                application.examine.clear();

                observable.trigger('source-change', {'label': null});

                return true;
            };

            /**
             * Sets a content file
             *
             * @param {object} file object (e. g. evt.target.files[0])
             * @param {string} label content's label
             */
            var fileSet = this.fileSet = function ArmadillogContent_fileSet(file, label) {
                file = file;

                workerFileReader.run(
                    {
                        'url': URL.createObjectURL(file),
                        'limit': 0 - CONTENT_SIZE_LIMIT
                    },
                    null,
                    function ArmadillogContent_fileSet_workerFileReaderSuccess(data, additional) {
                        URL.revokeObjectURL(data.url);
                        textSet(data.result, label);
                        fileUpdateSchedule();
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
            var fileUpdate = function ArmadillogContent_fileUpdate() {
                if (!file) {
                    return;
                }

                if (application.busy.check() || lineMList.queued()) {
                    fileUpdateSchedule();
                    return;
                }

                workerFileReader.run(
                    {
                        'url': URL.createObjectURL(file),
                        'limit': 0 - CONTENT_SIZE_LIMIT
                    },
                    null,
                    function ArmadillogContent_fileUpdate_workerFileReaderSuccess(data, additional) {
                        URL.revokeObjectURL(data.url);

                        if (file) {
                            textUpdate(data.result);
                            fileUpdateSchedule();
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
            var fileUpdateSchedule = function ArmadillogContent_fileUpdateSchedule() {
                if (FILE_UPDATE_DELAY > 0) {
                    fileUpdateTimeout = setTimeout(
                        fileUpdate,
                        FILE_UPDATE_DELAY);
                }

                return true;
            };

            /**
             * Unschedules a content file update
             */
            var fileUpdateUnschedule = function ArmadillogContent_fileUpdateUnschedule() {
                if (fileUpdateTimeout) {
                    clearTimeout(fileUpdateTimeout);
                    fileUpdateTimeout = null;
                }

                return true;
            };

            /**
             * Sets a content url
             *
             * @param {string} url content's url
             * @param {string} label content's label
             */
            var urlSet = this.urlSet = function ArmadillogContent_urlSet(url, label) {
                url = utils.url.validate(url);
                if (!url) {
                    alert('Invalid URL.');
                    return;
                }

                url = url;

                workerFileReader.run(
                    {
                        'url': url,
                        'limit': 0 - CONTENT_SIZE_LIMIT
                    },
                    null,
                    function ArmadillogContent_urlSet_workerFileReaderSuccess(data, additional) {
                        textSet(data.result, label);
                        urlUpdateSchedule();
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
            var urlUpdate = function ArmadillogContent_urlUpdate() {
                if (!url) {
                    return;
                }

                if (application.busy.check() || lineMList.queued()) {
                    urlUpdateSchedule();
                    return;
                }

                workerFileReader.run(
                    {
                        'url': url,
                        'limit': 0 - CONTENT_SIZE_LIMIT
                    },
                    null,
                    function ArmadillogContent_urlUpdate_workerFileReaderSuccess(data, additional) {
                        if (url) {
                            textUpdate(data.result);
                            urlUpdateSchedule();
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
            var urlUpdateSchedule = function ArmadillogContent_urlUpdateSchedule() {
                if (URL_UPDATE_DELAY > 0) {
                    urlUpdateTimeout = setTimeout(
                        urlUpdate,
                        URL_UPDATE_DELAY);
                }

                return true;
            };

            /**
             * Unschedules a content url update
             */
            var urlUpdateUnschedule = function ArmadillogContent_urlUpdateUnschedule() {
                if (urlUpdateTimeout) {
                    clearTimeout(urlUpdateTimeout);
                    urlUpdateTimeout = null;
                }

                return true;
            };

            /**
             * Sets a piece of content
             *
             * @param {string} text a piece of content
             * @param {string} label content's label
             */
            var textSet = this.textSet = function ArmadillogContent_textSet(text, label) {
                lineMList.queue('text-set');

                workerTextLineSplitter.run(
                    {
                        'text': text,
                        'limit': 0 - CONTENT_LINE_LIMIT
                    },
                    null,
                    function ArmadillogContent_textSet_workerTextLineSplitterSuccess(data, additional) {
                        if ('text' in data) {
                            var lineItemMMap = new ModelMap('textRaw', data.text, 'textFiltered', null, 'hidden', true, 'els', null);
                            lineMList.setAt(data.ix, lineItemMMap);
                        }

                        if ('count' in data) {
                            lineMList.dequeue('text-set');
                        }
                    },
                    null,
                    this);

                observable.trigger('source-change', {'label': label});

                return true;
            };

            /**
             * Updates the piece of content
             *
             * @param {string} text a piece of content
             */
            var textUpdate = function ArmadillogContent_textUpdate(text) {
                lineMList.queue('text-update');

                workerTextLineSplitter.run(
                    {
                        'text': text,
                        'limit': 0 - CONTENT_LINE_LIMIT
                    },
                    null,
                    function ArmadillogContent_textUpdate_workerTextLineSplitterSuccess(data, additional) {
                        if ('text' in data) {
                            var lineItemMMap = lineMList.getAt(data.ix);

                            if (lineItemMMap) {
                                lineItemMMap.set('textRaw', data.text);
                            }
                            else {
                                lineItemMMap = new ModelMap('textRaw', data.text, 'textFiltered', null, 'hidden', true, 'els', null);
                                lineMList.setAt(data.ix, lineItemMMap);
                            }
                        }

                        if ('count' in data) {
                            if (data.count < lineMList.length()) {
                                lineMList.splice(data.count);
                            }

                            lineMList.dequeue('text-update');
                        }
                    },
                    null,
                    this);

                return true;
            };

            /**
             * Applies filters to content
             */
            var filterApply = function ArmadillogContent_filterApply() {
                lineListFilter(lineMList.toArray());

                return true;
            };

            /**
             * Creates a content line view structure
             *
             * @param {number} lineIx index in result source
             * @param {object} lineItemMMap content line model object
             */
            var lineItemViewCreate = function ArmadillogContent_lineItemViewCreate(lineIx, lineItemMMap) {
                lineItemMMap.set(
                    'els',
                    view.contentLineItemCreate({
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
            var lineItemViewUpdate = function ArmadillogContent_lineItemViewUpdate(lineIx, lineItemMMap) {
                var lineEl = lineItemMMap.get('els').el;
                var textFiltered = lineItemMMap.get('textFiltered');

                if (textFiltered !== null) {
                    lineEl.innerHTML = utils.string.escapeXML(textFiltered).replace(
                        lineEscapeRegexp,
                        function (match) {
                            switch (match) {
                                case application.filter.TAG_HIGHLIGHT_1_BEGIN_SYMBOL: return '<span class= "highlight highlight-1">';
                                case application.filter.TAG_HIGHLIGHT_1_END_SYMBOL: return '</span>';
                                case application.filter.TAG_HIGHLIGHT_2_BEGIN_SYMBOL: return '<span class= "highlight highlight-2">';
                                case application.filter.TAG_HIGHLIGHT_2_END_SYMBOL: return '</span>';
                                case application.filter.TAG_HIGHLIGHT_3_BEGIN_SYMBOL: return '<span class= "highlight highlight-3">';
                                case application.filter.TAG_HIGHLIGHT_3_END_SYMBOL: return '</span>';
                                case application.filter.TAG_HIGHLIGHT_4_BEGIN_SYMBOL: return '<span class= "highlight highlight-4">';
                                case application.filter.TAG_HIGHLIGHT_4_END_SYMBOL: return '</span>';
                                case application.filter.TAG_HIGHLIGHT_5_BEGIN_SYMBOL: return '<span class= "highlight highlight-5">';
                                case application.filter.TAG_HIGHLIGHT_5_END_SYMBOL: return '</span>';
                                case application.filter.TAG_HIGHLIGHT_6_BEGIN_SYMBOL: return '<span class= "highlight highlight-6">';
                                case application.filter.TAG_HIGHLIGHT_6_END_SYMBOL: return '</span>';
                                case application.filter.TAG_HIGHLIGHT_7_BEGIN_SYMBOL: return '<span class= "highlight highlight-7">';
                                case application.filter.TAG_HIGHLIGHT_7_END_SYMBOL: return '</span>';
                                case application.filter.TAG_HIGHLIGHT_8_BEGIN_SYMBOL: return '<span class= "highlight highlight-8">';
                                case application.filter.TAG_HIGHLIGHT_8_END_SYMBOL: return '</span>';
                                case application.filter.TAG_HIGHLIGHT_9_BEGIN_SYMBOL: return '<span class= "highlight highlight-9">';
                                case application.filter.TAG_HIGHLIGHT_9_END_SYMBOL: return '</span>';
                                case application.filter.TAG_HIGHLIGHT_10_BEGIN_SYMBOL: return '<span class= "highlight highlight-10">';
                                case application.filter.TAG_HIGHLIGHT_10_END_SYMBOL: return '</span>';
                                case application.filter.TAG_HIGHLIGHT_11_BEGIN_SYMBOL: return '<span class= "highlight highlight-11">';
                                case application.filter.TAG_HIGHLIGHT_11_END_SYMBOL: return '</span>';
                                case application.filter.TAG_HIGHLIGHT_12_BEGIN_SYMBOL: return '<span class= "highlight highlight-12">';
                                case application.filter.TAG_HIGHLIGHT_12_END_SYMBOL: return '</span>';
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
            var lineViewListInsert = function ArmadillogContent_lineViewListInsert(lineViewList, chunkIx, chunkSize) {
                requestAnimationFrame(function ArmadillogContent_lineViewListInsert_animationFrame() {
                    application.busy.set(true, 'lineViewListInsert');

                    chunkIx = typeof chunkIx === 'undefined' ? 0 : chunkIx;
                    chunkSize = typeof chunkSize === 'undefined' ? lineViewList.length - chunkIx : Math.min(chunkSize, lineViewList.length - chunkIx);

                    var lineIx, lineItemMMap, lineItemView;
                    var documentFragment = document.createDocumentFragment();

                    for (var i = 0; i < chunkSize && i < OVERFLOW_CHUNK_SIZE; i++) {
                        lineIx = lineViewList[chunkIx + i].lineIx;
                        lineItemMMap = lineViewList[chunkIx + i].lineItemMMap;

                        lineItemViewCreate(lineIx, lineItemMMap);
                        lineItemView = lineItemMMap.get('els');

                        lineItemView.el.setAttribute('data-ix', lineIx);

                        lineItemViewUpdate(lineIx, lineItemMMap);

                        documentFragment.appendChild(lineItemView.el);
                    }

                    contentEls.lineListEl.insertBefore(
                        documentFragment,
                        contentEls.lineListEl.childNodes[lineViewList[chunkIx].lineIx] || null);

                    if (chunkSize > OVERFLOW_CHUNK_SIZE) {
                        setTimeout(
                            function ArmadillogContent_lineViewListInsert_overflowChunk() {
                                lineViewListInsert(lineViewList, chunkIx + OVERFLOW_CHUNK_SIZE);
                            },
                            OVERFLOW_DELAY);
                    }
                    else {
                        application.busy.set(false, 'lineViewListInsert');

                        observable.trigger('view-change');
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
            var lineViewListUpdate = function ArmadillogContent_lineViewListUpdate(lineViewList, chunkIx, chunkSize) {
                requestAnimationFrame(function ArmadillogContent_lineViewListUpdate_animationFrame() {
                    application.busy.set(true, 'lineViewListUpdate');

                    chunkIx = typeof chunkIx === 'undefined' ? 0 : chunkIx;
                    chunkSize = typeof chunkSize === 'undefined' ? lineViewList.length - chunkIx : Math.min(chunkSize, lineViewList.length - chunkIx);

                    var lineIx, lineItemMMap;

                    for (var i = 0; i < chunkSize && i < OVERFLOW_CHUNK_SIZE; i++) {
                        lineIx = lineViewList[chunkIx + i].lineIx;
                        lineItemMMap = lineViewList[chunkIx + i].lineItemMMap;

                        lineItemViewUpdate(lineIx, lineItemMMap);
                    }

                    if (chunkSize > OVERFLOW_CHUNK_SIZE) {
                        setTimeout(
                            function ArmadillogContent_lineViewListUpdate_overflowChunk() {
                                lineViewListUpdate(lineViewList, chunkIx + OVERFLOW_CHUNK_SIZE);
                            },
                            OVERFLOW_DELAY);
                    }
                    else {
                        application.busy.set(false, 'lineViewListUpdate');

                        observable.trigger('view-change');
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
            var lineViewListDelete = function ArmadillogContent_lineViewListDelete(lineViewList, chunkIx, chunkSize) {
                requestAnimationFrame(function ArmadillogContent_lineViewListDelete_animationFrame() {
                    application.busy.set(true, 'lineViewListDelete');

                    chunkIx = typeof chunkIx === 'undefined' ? 0 : chunkIx;
                    chunkSize = typeof chunkSize === 'undefined' ? lineViewList.length - chunkIx : Math.min(chunkSize, lineViewList.length - chunkIx);

                    var lineIx, lineItemMMap;

                    for (var i = 0; i < chunkSize && i < OVERFLOW_CHUNK_SIZE; i++) {
                        lineIx = lineViewList[chunkIx + i].lineIx;
                        lineItemMMap = lineViewList[chunkIx + i].lineItemMMap;

                        contentEls.lineListEl.removeChild(lineItemMMap.get('els').el);
                    }

                    if (chunkSize > OVERFLOW_CHUNK_SIZE) {
                        setTimeout(
                            function ArmadillogContent_lineViewListDelete_overflowChunk() {
                                lineViewListDelete(lineViewList, chunkIx + OVERFLOW_CHUNK_SIZE);
                            },
                            OVERFLOW_DELAY);
                    }
                    else {
                        application.busy.set(false, 'lineViewListDelete');

                        observable.trigger('view-change');
                    }
                });

                return true;
            };

            /**
             * Performs filtering of a line list
             *
             * @param {object} lineList content line list model object
             */
            var lineListFilter = function ArmadillogContent_lineListFilter(lineList) {
                application.busy.set(true, 'lineListFilter');

                var lineItemMMap;

                for (var i = 0, l = lineList.length; i < l; i++) {
                    lineItemMMap = lineList[i];

                    lineMList.queue('line-list-filter');

                    application.filter.filterText(
                        lineItemMMap.get('textRaw'),
                        function (lineItemMMap, result) {
                            lineItemMMap.set(
                                'textFiltered',
                                result.text,
                                'hidden',
                                result.hidden);

                            lineMList.dequeue('line-list-filter');
                        }.bind(this, lineItemMMap));
                }

                lineMList.queue(application.busy.set.bind(this, false, 'lineListFilter'), true, this);

                return true;
            };

            /**
             *
             */
            var toString = this.toString = function ArmadillogContent_toString() {
                return 'ennovum.ArmadillogContent';
            };

            //
            init.apply(this, arguments);
        };

        //
        return ArmadillogContent;
    });
