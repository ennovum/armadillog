'use strict';

define(
    [
        'ennovum.environment',
        'ennovum.dom',
        'ennovum.utils',
        './../views/input'
    ],
    function (
        environment,
        dom,
        utils,
        ArmadillogInputView
    ) {
        /**
         * ArmadillogInput constructor
         */
        var ArmadillogInput = function ArmadillogInput(config, application) {
            var itc = {
                config: undefined,
                application: undefined,

                bodyEl: undefined,
                boxEl: undefined,
                view: undefined,
                inputEls: undefined
            };

            init.call(this, itc, config, application);
        };

        //
        var HIDDEN_CLASS = 'hidden';

        /**
         * Initializes instance
         *
         * @param {object} config configuration object
         */
        var init = function ArmadillogInput_init(itc, config, application) {
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
        var configSet = function ArmadillogInput_configSet(itc, config) {
            switch (false) {
                case !!config:
                case typeof config === 'object':
                    console.error('ArmadillogInput', 'configSet', 'invalid input');
                    return false;
            };

            itc.config = {
                boxEl: config.inputBoxEl || null
            };

            return true;
        };

        /**
         * Initializes data
         */
        var dataInit = function ArmadillogInput_dataInit(itc, application) {
            itc.application = application;

            return true;
        };

        /**
         * Initializes view
         */
        var viewInit = function ArmadillogInput_viewInit(itc) {
            itc.bodyEl = itc.config.bodyEl;

            itc.boxEl = itc.config.boxEl;
            if (!itc.boxEl) {
                console.error('ArmadillogInput', 'viewInit', 'invalid boxEl');
                return false;
            };

            itc.view = new ArmadillogInputView();

            itc.inputEls = itc.view.inputCreate();
            itc.boxEl.appendChild(itc.inputEls.clearBoxEl);
            itc.boxEl.appendChild(itc.inputEls.fileBoxEl);
            itc.boxEl.appendChild(itc.inputEls.pasteBoxEl);
            itc.boxEl.appendChild(itc.inputEls.urlBoxEl);

            return true;
        };

        /**
         * Initializes UI
         */
        var uiInit = function ArmadillogInput_uiInit(itc) {
            dom.handle(
                itc.inputEls.clearButtonEl, 'click',
                function ArmadillogInput_uiInit_clearButtonElClickHandler(evt) {
                    if (!itc.application.busy.check() && confirm('Are you sure?')) {
                        itc.application.content.clear();
                    }
                },
                false, true, true, this);

            dom.handle(
                itc.inputEls.fileInputEl, 'change',
                function ArmadillogInput_uiInit_fileInputElChangeHandler(evt) {
                    if (!itc.application.busy.check()) {
                        var files = evt.target.files;
                        if (files.length) {
                            itc.application.content.clear();
                            itc.application.content.fileSet(files[0], files[0].name);
                        }
                    }
                },
                false, true, true, this);

            dom.handle(
                itc.inputEls.fileButtonEl, 'click',
                function ArmadillogInput_uiInit_fileButtonElClickHandler(evt) {
                    if (!itc.application.busy.check()) {
                        itc.inputEls.fileInputEl.click();
                    }
                },
                false, true, true, this);

            dom.handle(
                itc.inputEls.pasteButtonEl, 'click',
                function ArmadillogInput_uiInit_pasteButtonElClickHandler(evt) {
                    if (!itc.application.busy.check() && itc.inputEls.pasteInputEl.value) {
                        itc.application.content.clear();
                        itc.application.content.textSet(itc.inputEls.pasteInputEl.value, '(pasted text)');
                        itc.inputEls.pasteInputEl.value = '';
                    }
                },
                false, true, true, this);

            dom.handle(
                itc.inputEls.urlInputEl, 'keypress',
                function ArmadillogInput_uiInit_urlInputElKeypressHandler(evt) {
                    if (evt.keyCode === 13) {
                        itc.inputEls.urlButtonEl.click();

                        evt.preventDefault();
                        evt.stopPropagation();
                    }
                },
                false, false, false, this);

            dom.handle(
                itc.inputEls.urlButtonEl, 'click',
                function ArmadillogInput_uiInit_urlButtonElClickHandler(evt) {
                    if (!itc.application.busy.check() && itc.inputEls.urlInputEl.value) {
                        itc.application.content.clear();
                        itc.application.content.urlSet(itc.inputEls.urlInputEl.value, itc.inputEls.urlInputEl.value);
                        itc.inputEls.urlInputEl.value = '';
                    }
                },
                false, true, true, this);

            itc.application.content.on(
                'source-change',
                function ArmadillogInput_uiInit_applicationSourceChangeHandler(evt, data) {
                    clearLabelSet(itc, data.label);
                });

            return true;
        };

        /**
         *
         */
        var clearLabelSet = function ArmadillogInput_clearLabelSet(itc, value) {
            itc.inputEls.clearLabelEl.innerHTML = utils.escapeXML(value || '');
            dom.classDepend(itc.inputEls.clearBoxEl, HIDDEN_CLASS, value === null);

            return true;
        };

        //
        return ArmadillogInput;
    });
