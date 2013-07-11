'use strict';

window.define && define(
    [
        'ennovum.Environment',
        'ennovum.Utils',
        'ennovum.Model',
        'ennovum.Worker',
        './../views/content'
    ],
    function (
        mEnvironment,
        mUtils,
        mModel,
        mWorker,
        mArmadillogContentView
    ) {
/* ==================================================================================================== */

// debug console logs switch
var DEBUG = false;

/**
 * ArmadillogContent static
 */
var armadillogContentStatic = {
};

/**
 * ArmadillogContent interface
 */
var armadillogContentInterface = {
    clear: function () {},

    textSet: function (text, label) {},
    fileSet: function (file, label) {},
    urlSet: function (url, label) {},

    filterApply: function () {}
};

/**
 * ArmadillogContent constructor
 */
var ArmadillogContent = function ArmadillogContent() {
    this.init.apply(this, arguments);
    return mUtils.obj.implement({}, this, armadillogContentInterface);
};

/**
 * ArmadillogContent prototype
 */
ArmadillogContent.prototype = {

    HIDDEN_CLASS: 'hidden',

    OVERFLOW_CHUNK_SIZE: 5000,
    OVERFLOW_DELAY: 500,

    FILE_UPDATE_DELAY: 1000,
    URL_UPDATE_DELAY: 1000,

    /**
     * Initializes instance
     *
     * @param {object} config configuration object
     */
    init: function ArmadillogContent_init(config, application) {
        DEBUG && console.log('ArmadillogContent', 'init', arguments);

        switch (true) {
            case !this.configSet(config):
            case !this.dataInit(application):
            case !this.viewInit():
            case !this.uiInit():
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
    configSet: function ArmadillogContent_configSet(config) {
        DEBUG && console.log('ArmadillogContent', 'configSet', arguments);

        switch (false) {
            case !!config:
            case typeof config === 'object':
                console.error('ArmadillogContent', 'configSet', 'invalid input');
                return false;
        };

        this.config = {
            contentBoxEl: config.contentBoxEl || null,
            contentScrollEl: config.contentScrollEl || null,
            contentDropEl: config.contentDropEl || null
        };

        return true;
    },

    /**
     * Initializes data
     */
    dataInit: function ArmadillogContent_dataInit(application) {
        DEBUG && console.log('ArmadillogContent', 'dataInit', arguments);

        this.application = application;

        this.lineMList = new mModel.ModelList();

        this.lineEscapeRegexp = new RegExp(
            [
                this.application.filterStatic.TAG_HIGHLIGHT_1_BEGIN_SYMBOL,
                this.application.filterStatic.TAG_HIGHLIGHT_1_END_SYMBOL,
                this.application.filterStatic.TAG_HIGHLIGHT_2_BEGIN_SYMBOL,
                this.application.filterStatic.TAG_HIGHLIGHT_2_END_SYMBOL,
                this.application.filterStatic.TAG_HIGHLIGHT_3_BEGIN_SYMBOL,
                this.application.filterStatic.TAG_HIGHLIGHT_3_END_SYMBOL,
                this.application.filterStatic.TAG_HIGHLIGHT_4_BEGIN_SYMBOL,
                this.application.filterStatic.TAG_HIGHLIGHT_4_END_SYMBOL,
                this.application.filterStatic.TAG_HIGHLIGHT_5_BEGIN_SYMBOL,
                this.application.filterStatic.TAG_HIGHLIGHT_5_END_SYMBOL,
                this.application.filterStatic.TAG_HIGHLIGHT_6_BEGIN_SYMBOL,
                this.application.filterStatic.TAG_HIGHLIGHT_6_END_SYMBOL,
                this.application.filterStatic.TAG_HIGHLIGHT_7_BEGIN_SYMBOL,
                this.application.filterStatic.TAG_HIGHLIGHT_7_END_SYMBOL,
                this.application.filterStatic.TAG_HIGHLIGHT_8_BEGIN_SYMBOL,
                this.application.filterStatic.TAG_HIGHLIGHT_8_END_SYMBOL,
                this.application.filterStatic.TAG_HIGHLIGHT_9_BEGIN_SYMBOL,
                this.application.filterStatic.TAG_HIGHLIGHT_9_END_SYMBOL,
                this.application.filterStatic.TAG_HIGHLIGHT_10_BEGIN_SYMBOL,
                this.application.filterStatic.TAG_HIGHLIGHT_10_END_SYMBOL,
                this.application.filterStatic.TAG_HIGHLIGHT_11_BEGIN_SYMBOL,
                this.application.filterStatic.TAG_HIGHLIGHT_11_END_SYMBOL,
                this.application.filterStatic.TAG_HIGHLIGHT_12_BEGIN_SYMBOL,
                this.application.filterStatic.TAG_HIGHLIGHT_12_END_SYMBOL
            ].join('|'),
            'gi'),

        this.file = null;
        this.fileUpdateTimeout = null;

        this.url = null;
        this.urlUpdateTimeout = null;

        this.dragging = false;

        this.workerFileReader = new mWorker.WorkerDownloader();
        this.workerTextLineSplitter = new mWorker.WorkerFunction(
            function ArmadillogContent_dataInit_workerTextLineSplitter(data, success, error) {
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

        return true;
    },

    /**
     * Initializes view
     */
    viewInit: function ArmadillogContent_viewInit() {
        DEBUG && console.log('ArmadillogContent', 'viewInit', arguments);

        this.armadillogView = new mArmadillogContentView.ArmadillogContentView();

        this.boxEl = this.config.contentBoxEl;
        if (!this.boxEl) {
            console.error('ArmadillogContent', 'viewInit', 'invalid contentBoxEl');
            return false;
        };

        this.dropEl = this.config.contentDropEl;

        this.view = this.armadillogView.contentViewGet();
        this.boxEl.appendChild(this.view.frameEl);

        return true;
    },

    /**
     * Initializes UI
     */
    uiInit: function ArmadillogContent_uiInit() {
        DEBUG && console.log('ArmadillogContent', 'uiInit', arguments);

        this.dropEl.addEventListener(
            'dragstart',
            function ArmadillogContent_uiInit_dropElDragstartHandler(evt) {
                this.dragging = true;

                // evt.preventDefault();
                evt.stopPropagation();
            }.bind(this),
            false);

        this.dropEl.addEventListener(
            'dragover',
            function ArmadillogContent_uiInit_dropElDragoverHandler(evt) {
                evt.dataTransfer.dropEffect = this.dragging ? 'none' : 'copy';

                evt.preventDefault();
                evt.stopPropagation();
            }.bind(this),
            false);

        this.dropEl.addEventListener(
            'dragend',
            function ArmadillogContent_uiInit_dropElDragendHandler(evt) {
                this.dragging = false;

                evt.preventDefault();
                evt.stopPropagation();
            }.bind(this),
            false);

        this.dropEl.addEventListener(
            'drop',
            function ArmadillogContent_uiInit_dropElDropHandler(evt) {
                if (!this.dragging) {
                    var files = evt.dataTransfer.files;
                    if (files.length) {
                        this.clear();
                        this.fileSet(files[0], files[0].name);
                    }

                    var data = evt.dataTransfer.getData('text/plain');
                    if (data) {
                        this.clear();
                        this.textSet(data, '(dragged text)');
                    }
                }

                evt.preventDefault();
                evt.stopPropagation();
            }.bind(this),
            false);

        this.view.lineListEl.addEventListener(
            'click',
            function ArmadillogContent_uiInit_lineListElClickHandler(evt) {
                var lineEl;

                lineEl = evt.target;
                while (lineEl && lineEl.parentNode !== this.view.lineListEl) {
                    lineEl = lineEl.parentNode;
                }
                if (lineEl) {
                    if (mUtils.dom.classContains(lineEl, 'selected')) {
                        mUtils.dom.classRemove(lineEl, 'selected');

                        this.application.examine.clear();
                    }
                    else {
                        mUtils.dom.classRemove(this.view.lineListEl.querySelector('.selected'), 'selected');
                        mUtils.dom.classAdd(lineEl, 'selected');

                        var lineItemMMap = this.lineMList.getAt(~~lineEl.getAttribute('data-index'));
                        this.application.examine.set(lineItemMMap);
                    }
                }

                evt.preventDefault();
                evt.stopPropagation();
            }.bind(this));

        this.view.lineListEl.addEventListener(
            'dblclick',
            function ArmadillogContent_uiInit_lineListElDblclickHandler(evt) {
                var lineEl;

                lineEl = evt.target
                while (lineEl && lineEl.parentNode !== this.view.lineListEl) {
                    lineEl = lineEl.parentNode;
                }
                if (lineEl) {
                    mUtils.dom.classToggle(lineEl, 'marked');
                }

                evt.preventDefault();
                evt.stopPropagation();
            }.bind(this));

        this.lineMList.on(
            'model-insert',
            function ArmadillogContent_uiInit_lineMListInsertHandler(evt, dataList) {
                var lineViewList = [];
                var lineList = [];

                for (var i = 0, l = dataList.length; i < l; i++) {
                    lineViewList.push({
                        'lineIndex': dataList[i].index,
                        'lineItemMMap': dataList[i].valueNew
                    });
                    lineList.push(dataList[i].valueNew);
                }

                this.lineViewListInsert(lineViewList);
                this.lineListFilter(lineList);
            }.bind(this));

        this.lineMList.on(
            'model-update',
            function ArmadillogContent_uiInit_lineMListUpdateHandler(evt, dataList) {
                var lineViewList = [];
                var lineList = [];

                for (var i = 0, l = dataList.length; i < l; i++) {
                    lineViewList.push({
                        'lineIndex': dataList[i].index,
                        'lineItemMMap': dataList[i].valueNew
                    });
                    lineList.push(dataList[i].valueNew);
                }

                this.lineViewListUpdate(lineViewList);
                this.lineListFilter(lineList);
            }.bind(this));

        this.lineMList.on(
            'model-delete',
            function ArmadillogContent_uiInit_lineMListDeleteHandler(evt, dataList) {
                var lineViewList = [];

                for (var i = 0, l = dataList.length; i < l; i++) {
                    lineViewList.push({
                        'lineIndex': dataList[i].index,
                        'lineItemMMap': dataList[i].valueOld
                    });
                }

                this.lineViewListDelete(lineViewList);
            }.bind(this));

        this.lineMList.on(
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
                            'lineIndex': dataList[i].index,
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
                    this.lineViewListUpdate(lineViewList);
                }
                if (lineList.length) {
                    this.lineListFilter(lineList);
                }
            }.bind(this));

        return true;
    },

    /**
     * Clears content
     */
    clear: function ArmadillogContent_clear() {
        DEBUG && console.log('ArmadillogContent', 'clear', arguments);

        this.file = null;
        this.fileUpdateUnschedule();

        this.url = null;
        this.urlUpdateUnschedule();

        this.lineMList.splice(0, this.lineMList.length());
        this.application.examine.clear();

        this.application.input.clearLabelSet('(empty)');

        return true;
    },

    /**
     * Sets a content file
     *
     * @param {object} file object (e. g. evt.target.files[0])
     * @param {string} label content's label
     */
    fileSet: function ArmadillogContent_fileSet(file, label) {
        DEBUG && console.log('ArmadillogContent', 'fileSet', arguments);

        this.file = file;

        this.workerFileReader.run(
            {
                'url': URL.createObjectURL(file)
            },
            null,
            null,
            function ArmadillogContent_fileSet_workerFileReaderSuccess(data, additional) {
                URL.revokeObjectURL(data.url);
                this.textSet(data.result, label);
                this.fileUpdateSchedule();
            },
            function ArmadillogContent_fileSet_workerFileReaderFailure() {
                alert('An error occured, please try another input method.');
            },
            this);

        return true;
    },

    /**
     * Updates the content file
     */
    fileUpdate: function ArmadillogContent_fileUpdate() {
        DEBUG && console.log('ArmadillogContent', 'fileUpdate', arguments);

        if (!this.file) {
            return;
        }

        if (this.busy || this.lineMList.queued()) {
            this.fileUpdateSchedule();
            return;
        }

        this.workerFileReader.run(
            {
                'url': URL.createObjectURL(this.file)
            },
            null,
            null,
            function ArmadillogContent_fileUpdate_workerFileReaderSuccess(data, additional) {
                URL.revokeObjectURL(data.url);

                if (this.file) {
                    this.textUpdate(data.result);
                    this.fileUpdateSchedule();
                }
            },
            function ArmadillogContent_fileUpdate_workerFileReaderFailure() {
                alert('An error occured, please try another input method.');
            },
            this);

        return true;
    },

    /**
     * Schedules a content file update
     */
    fileUpdateSchedule: function ArmadillogContent_fileUpdateSchedule() {
        DEBUG && console.log('ArmadillogContent', 'fileUpdateSchedule', arguments);

        if (this.FILE_UPDATE_DELAY > 0) {
            this.fileUpdateTimeout = setTimeout(
                this.fileUpdate.bind(this),
                this.FILE_UPDATE_DELAY);
        }

        return true;
    },

    /**
     * Unschedules a content file update
     */
    fileUpdateUnschedule: function ArmadillogContent_fileUpdateUnschedule() {
        DEBUG && console.log('ArmadillogContent', 'fileUpdateUnschedule', arguments);

        if (this.fileUpdateTimeout) {
            clearTimeout(this.fileUpdateTimeout);
            this.fileUpdateTimeout = null;
        }

        return true;
    },

    /**
     * Sets a content url
     *
     * @param {string} url content's url
     * @param {string} label content's label
     */
    urlSet: function ArmadillogContent_urlSet(url, label) {
        DEBUG && console.log('ArmadillogContent', 'urlSet', arguments);

        url = mUtils.url.validate(url);
        if (!url) {
            alert('Invalid URL.');
            return;
        }

        this.url = url;

        this.workerFileReader.run(
            {
                'url': url
            },
            null,
            null,
            function ArmadillogContent_urlSet_workerFileReaderSuccess(data, additional) {
                this.textSet(data.result, label);
                this.urlUpdateSchedule();
            },
            function ArmadillogContent_urlSet_workerFileReaderFailure() {
                alert('An error occured, please try another input method.');
            },
            this);

        return true;
    },

    /**
     * Updates the content url
     */
    urlUpdate: function ArmadillogContent_urlUpdate() {
        DEBUG && console.log('ArmadillogContent', 'urlUpdate', arguments);

        if (!this.url) {
            return;
        }

        if (this.busy || this.lineMList.queued()) {
            this.urlUpdateSchedule();
            return;
        }

        this.workerFileReader.run(
            {
                'url': this.url
            },
            null,
            null,
            function ArmadillogContent_urlUpdate_workerFileReaderSuccess(data, additional) {
                if (this.url) {
                    this.textUpdate(data.result);
                    this.urlUpdateSchedule();
                }
            },
            function ArmadillogContent_urlUpdate_workerFileReaderFailure() {
                alert('An error occured, please try another input method.');
            },
            this);

        return true;
    },

    /**
     * Schedules a content url update
     */
    urlUpdateSchedule: function ArmadillogContent_urlUpdateSchedule() {
        DEBUG && console.log('ArmadillogContent', 'urlUpdateSchedule', arguments);

        if (this.URL_UPDATE_DELAY > 0) {
            this.urlUpdateTimeout = setTimeout(
                this.urlUpdate.bind(this),
                this.URL_UPDATE_DELAY);
        }

        return true;
    },

    /**
     * Unschedules a content url update
     */
    urlUpdateUnschedule: function ArmadillogContent_urlUpdateUnschedule() {
        DEBUG && console.log('ArmadillogContent', 'urlUpdateUnschedule', arguments);

        if (this.urlUpdateTimeout) {
            clearTimeout(this.urlUpdateTimeout);
            this.urlUpdateTimeout = null;
        }

        return true;
    },

    /**
     * Sets a piece of content
     *
     * @param {string} text a piece of content
     * @param {string} label content's label
     */
    textSet: function ArmadillogContent_textSet(text, label) {
        DEBUG && console.log('ArmadillogContent', 'textSet', arguments);

        this.lineMList.queue('text-set');

        this.workerTextLineSplitter.run(
            {
                'text': text
            },
            null,
            null,
            function ArmadillogContent_textSet_workerTextLineSplitterSuccess(data, additional) {
                if ('text' in data) {
                    var lineItemMMap = new mModel.ModelMap(
                        'textRaw',
                        data.text,
                        'textFiltered',
                        null,
                        'hidden',
                        true,
                        'view',
                        null);

                    this.lineMList.setAt(data.index, lineItemMMap);
                }

                if ('count' in data) {
                    this.application.input.clearLabelSet(mUtils.string.escapeXML(label) || '(unknown)');

                    this.lineMList.dequeue('text-set');
                }
            },
            null,
            this);

        return true;
    },

    /**
     * Updates the piece of content
     *
     * @param {string} text a piece of content
     */
    textUpdate: function ArmadillogContent_textUpdate(text) {
        DEBUG && console.log('ArmadillogContent', 'textUpdate', arguments);

        this.lineMList.queue('text-update');

        this.workerTextLineSplitter.run(
            {
                'text': text
            },
            null,
            null,
            function ArmadillogContent_textUpdate_workerTextLineSplitterSuccess(data, additional) {
                if ('text' in data) {
                    var lineItemMMap = this.lineMList.getAt(data.index);

                    if (lineItemMMap) {
                        if (lineItemMMap.get('textRaw') !== data.text) {
                            lineItemMMap.set(
                                'textRaw',
                                data.text);
                        }
                    }
                    else {
                        lineItemMMap = new mModel.ModelMap(
                            'textRaw',
                            data.text,
                            'textFiltered',
                            null,
                            'hidden',
                            true,
                            'view',
                            null);
                    }

                    this.lineMList.setAt(data.index, lineItemMMap);
                }

                if ('count' in data) {
                    if (data.count < this.lineMList.length()) {
                        this.lineMList.splice(data.count);
                    }

                    this.lineMList.dequeue('text-update');
                }
            },
            null,
            this);

        return true;
    },

    /**
     * Applies filters to content
     */
    filterApply: function ArmadillogContent_filterApply() {
        DEBUG && console.log('ArmadillogContent', 'filterApply', arguments);

        this.lineListFilter(this.lineMList.toArray());

        return true;
    },

    /**
     * Creates a content line view structure
     *
     * @param {number} lineIndex index in result source
     * @param {object} lineItemMMap content line model object
     */
    lineItemViewCreate: function ArmadillogContent_lineItemViewCreate(lineIndex, lineItemMMap) {
        DEBUG && console.log('ArmadillogContent', 'lineItemViewCreate', arguments);

        lineItemMMap.set(
            'view',
            this.armadillogView.contentLineItemViewGet({
                'number': lineIndex + 1
            }));

        return true;
    },

    /**
     * Updates a content line view structure
     *
     * @param {number} lineIndex index in result source
     * @param {object} lineItemMMap content line model object
     */
    lineItemViewUpdate: function ArmadillogContent_lineItemViewUpdate(lineIndex, lineItemMMap) {
        DEBUG && console.log('ArmadillogContent', 'lineItemViewUpdate', arguments);

        var lineEl = lineItemMMap.get('view').el;
        var textFiltered = lineItemMMap.get('textFiltered');

        if (textFiltered !== null) {
            lineEl.innerHTML = mUtils.string.escapeXML(textFiltered).replace(
                this.lineEscapeRegexp,
                function (match) {
                    switch (match) {
                        case this.application.filterStatic.TAG_HIGHLIGHT_1_BEGIN_SYMBOL: return '<span class="highlight highlight-1">';
                        case this.application.filterStatic.TAG_HIGHLIGHT_1_END_SYMBOL: return '</span>';
                        case this.application.filterStatic.TAG_HIGHLIGHT_2_BEGIN_SYMBOL: return '<span class="highlight highlight-2">';
                        case this.application.filterStatic.TAG_HIGHLIGHT_2_END_SYMBOL: return '</span>';
                        case this.application.filterStatic.TAG_HIGHLIGHT_3_BEGIN_SYMBOL: return '<span class="highlight highlight-3">';
                        case this.application.filterStatic.TAG_HIGHLIGHT_3_END_SYMBOL: return '</span>';
                        case this.application.filterStatic.TAG_HIGHLIGHT_4_BEGIN_SYMBOL: return '<span class="highlight highlight-4">';
                        case this.application.filterStatic.TAG_HIGHLIGHT_4_END_SYMBOL: return '</span>';
                        case this.application.filterStatic.TAG_HIGHLIGHT_5_BEGIN_SYMBOL: return '<span class="highlight highlight-5">';
                        case this.application.filterStatic.TAG_HIGHLIGHT_5_END_SYMBOL: return '</span>';
                        case this.application.filterStatic.TAG_HIGHLIGHT_6_BEGIN_SYMBOL: return '<span class="highlight highlight-6">';
                        case this.application.filterStatic.TAG_HIGHLIGHT_6_END_SYMBOL: return '</span>';
                        case this.application.filterStatic.TAG_HIGHLIGHT_7_BEGIN_SYMBOL: return '<span class="highlight highlight-7">';
                        case this.application.filterStatic.TAG_HIGHLIGHT_7_END_SYMBOL: return '</span>';
                        case this.application.filterStatic.TAG_HIGHLIGHT_8_BEGIN_SYMBOL: return '<span class="highlight highlight-8">';
                        case this.application.filterStatic.TAG_HIGHLIGHT_8_END_SYMBOL: return '</span>';
                        case this.application.filterStatic.TAG_HIGHLIGHT_9_BEGIN_SYMBOL: return '<span class="highlight highlight-9">';
                        case this.application.filterStatic.TAG_HIGHLIGHT_9_END_SYMBOL: return '</span>';
                        case this.application.filterStatic.TAG_HIGHLIGHT_10_BEGIN_SYMBOL: return '<span class="highlight highlight-10">';
                        case this.application.filterStatic.TAG_HIGHLIGHT_10_END_SYMBOL: return '</span>';
                        case this.application.filterStatic.TAG_HIGHLIGHT_11_BEGIN_SYMBOL: return '<span class="highlight highlight-11">';
                        case this.application.filterStatic.TAG_HIGHLIGHT_11_END_SYMBOL: return '</span>';
                        case this.application.filterStatic.TAG_HIGHLIGHT_12_BEGIN_SYMBOL: return '<span class="highlight highlight-12">';
                        case this.application.filterStatic.TAG_HIGHLIGHT_12_END_SYMBOL: return '</span>';
                    }
                    return '';
                }.bind(this));
        }

        mUtils.dom.classDepend(lineEl, this.HIDDEN_CLASS, lineItemMMap.get('hidden'));

        return true;
    },

    /**
     * Inserts a line of source in view
     *
     * @param {array} lineViewList lineIndex & lineItemMMap list
     * @param {number} chunkIndex chunk index
     * @param {number} chunkSize chunk size
     */
    lineViewListInsert: function ArmadillogContent_lineViewListInsert(lineViewList, chunkIndex, chunkSize) {
        DEBUG && console.log('ArmadillogContent', 'lineViewListInsert', arguments);

        requestAnimationFrame(function ArmadillogContent_lineViewListInsert_animationFrame() {
            this.application.busy.set(true, 'lineViewListInsert');

            chunkIndex = typeof chunkIndex === 'undefined' ? 0 : chunkIndex;
            chunkSize = typeof chunkSize === 'undefined' ? lineViewList.length - chunkIndex : Math.min(chunkSize, lineViewList.length - chunkIndex);

            var lineIndex, lineItemMMap, lineItemView;
            var documentFragment = document.createDocumentFragment();

            for (var i = 0; i < chunkSize && i < this.OVERFLOW_CHUNK_SIZE; i++) {
                lineIndex = lineViewList[chunkIndex + i].lineIndex;
                lineItemMMap = lineViewList[chunkIndex + i].lineItemMMap;

                this.lineItemViewCreate(lineIndex, lineItemMMap);
                lineItemView = lineItemMMap.get('view');

                lineItemView.el.setAttribute('data-index', lineIndex);

                this.lineItemViewUpdate(lineIndex, lineItemMMap);

                documentFragment.appendChild(lineItemView.el);
            }

            this.view.lineListEl.insertBefore(
                documentFragment,
                this.view.lineListEl.childNodes[lineViewList[chunkIndex].lineIndex] || null);

            if (chunkSize > this.OVERFLOW_CHUNK_SIZE) {
                setTimeout(
                    function ArmadillogContent_lineViewListInsert_overflowChunk() {
                        this.lineViewListInsert(lineViewList, chunkIndex + this.OVERFLOW_CHUNK_SIZE);
                    }.bind(this),
                    this.OVERFLOW_DELAY);
            }
            else {
                this.application.busy.set(false, 'lineViewListInsert');

                this.application.tailing.execute();
            }
        }.bind(this));

        return true;
    },

    /**
     * Updates a line of source in view
     *
     * @param {array} lineViewList lineIndex & lineItemMMap list
     * @param {number} chunkIndex chunk index
     * @param {number} chunkSize chunk size
     */
    lineViewListUpdate: function ArmadillogContent_lineViewListUpdate(lineViewList, chunkIndex, chunkSize) {
        DEBUG && console.log('ArmadillogContent', 'lineViewListUpdate', arguments);

        requestAnimationFrame(function ArmadillogContent_lineViewListUpdate_animationFrame() {
            this.application.busy.set(true, 'lineViewListUpdate');

            chunkIndex = typeof chunkIndex === 'undefined' ? 0 : chunkIndex;
            chunkSize = typeof chunkSize === 'undefined' ? lineViewList.length - chunkIndex : Math.min(chunkSize, lineViewList.length - chunkIndex);

            var lineIndex, lineItemMMap;

            for (var i = 0; i < chunkSize && i < this.OVERFLOW_CHUNK_SIZE; i++) {
                lineIndex = lineViewList[chunkIndex + i].lineIndex;
                lineItemMMap = lineViewList[chunkIndex + i].lineItemMMap;

                this.lineItemViewUpdate(lineIndex, lineItemMMap);
            }

            if (chunkSize > this.OVERFLOW_CHUNK_SIZE) {
                setTimeout(
                    function ArmadillogContent_lineViewListUpdate_overflowChunk() {
                        this.lineViewListUpdate(lineViewList, chunkIndex + this.OVERFLOW_CHUNK_SIZE);
                    }.bind(this),
                    this.OVERFLOW_DELAY);
            }
            else {
                this.application.busy.set(false, 'lineViewListUpdate');

                this.application.tailing.execute();
            }
        }.bind(this));

        return true;
    },

    /**
     * Deletes a line of source in view
     *
     * @param {array} lineViewList lineIndex & lineItemMMap list
     * @param {number} chunkIndex chunk index
     * @param {number} chunkSize chunk size
     */
    lineViewListDelete: function ArmadillogContent_lineViewListDelete(lineViewList, chunkIndex, chunkSize) {
        DEBUG && console.log('ArmadillogContent', 'lineViewListDelete', arguments);

        requestAnimationFrame(function ArmadillogContent_lineViewListDelete_animationFrame() {
            this.application.busy.set(true, 'lineViewListDelete');

            chunkIndex = typeof chunkIndex === 'undefined' ? 0 : chunkIndex;
            chunkSize = typeof chunkSize === 'undefined' ? lineViewList.length - chunkIndex : Math.min(chunkSize, lineViewList.length - chunkIndex);

            var lineIndex, lineItemMMap;

            for (var i = 0; i < chunkSize && i < this.OVERFLOW_CHUNK_SIZE; i++) {
                lineIndex = lineViewList[chunkIndex + i].lineIndex;
                lineItemMMap = lineViewList[chunkIndex + i].lineItemMMap;

                this.view.lineListEl.removeChild(lineItemMMap.get('view').el);
            }

            if (chunkSize > this.OVERFLOW_CHUNK_SIZE) {
                setTimeout(
                    function ArmadillogContent_lineViewListDelete_overflowChunk() {
                        this.lineViewListDelete(lineViewList, chunkIndex + this.OVERFLOW_CHUNK_SIZE);
                    }.bind(this),
                    this.OVERFLOW_DELAY);
            }
            else {
                this.application.busy.set(false, 'lineViewListDelete');

                this.application.tailing.execute();
            }
        }.bind(this));

        return true;
    },

    /**
     * Performs filtering of a line list
     *
     * @param {object} lineList content line list model object
     */
    lineListFilter: function ArmadillogContent_lineListFilter(lineList) {
        DEBUG && console.log('ArmadillogContent', 'lineListFilter', arguments);

        this.application.busy.set(true, 'lineListFilter');

        var lineItemMMap;

        for (var i = 0, l = lineList.length; i < l; i++) {
            lineItemMMap = lineList[i];

            this.lineMList.queue('line-list-filter');

            this.application.filter.filterText(
                lineItemMMap.get('textRaw'),
                function (lineItemMMap, result) {
                    lineItemMMap.set(
                        'textFiltered',
                        result.text,
                        'hidden',
                        result.hidden);

                    this.lineMList.dequeue('line-list-filter');
                }.bind(this, lineItemMMap));
        }

        this.lineMList.queue(function () {
            this.application.busy.set(false, 'lineListFilter');

            this.lineMList.dequeue();
        }.bind(this));

        return true;
    },

    /**
     *
     */
    toString: function ArmadillogContent_toString() {
        return 'ennovum.ArmadillogContent';
    }

};

/* ==================================================================================================== */
        return {
            'armadillogContentStatic': armadillogContentStatic,
            'armadillogContentInterface': armadillogContentInterface,
            'ArmadillogContent': ArmadillogContent
        };
    });
