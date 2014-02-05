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
        var ArmadillogInput = function ArmadillogInput() {
            var HIDDEN_CLASS = 'hidden';

            var config;
            var application;

            var bodyEl;
            var boxEl;
            var view;
            var inputEls;

            /**
             * Initializes instance
             *
             * @param {object} argConfig configuration object
             */
            var init = function ArmadillogInput_init(argConfig, argApplication) {
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
            var configSet = function ArmadillogInput_configSet(argConfig) {
                switch (false) {
                    case !!argConfig:
                    case typeof argConfig === 'object':
                        console.error('ArmadillogInput', 'configSet', 'invalid input');
                        return false;
                };

                config = {
                    boxEl: argConfig.inputBoxEl || null
                };

                return true;
            };

            /**
             * Initializes data
             */
            var dataInit = function ArmadillogInput_dataInit(argApplication) {
                application = argApplication;

                return true;
            };

            /**
             * Initializes view
             */
            var viewInit = function ArmadillogInput_viewInit() {
                bodyEl = config.bodyEl;

                boxEl = config.boxEl;
                if (!boxEl) {
                    console.error('ArmadillogInput', 'viewInit', 'invalid boxEl');
                    return false;
                };

                view = new ArmadillogInputView();

                inputEls = view.inputCreate();
                boxEl.appendChild(inputEls.clearBoxEl);
                boxEl.appendChild(inputEls.fileBoxEl);
                boxEl.appendChild(inputEls.pasteBoxEl);
                boxEl.appendChild(inputEls.urlBoxEl);

                return true;
            };

            /**
             * Initializes UI
             */
            var uiInit = function ArmadillogInput_uiInit() {
                dom.handle(
                    inputEls.clearButtonEl, 'click',
                    function ArmadillogInput_uiInit_clearButtonElClickHandler(evt) {
                        if (!application.busy.check() && confirm('Are you sure?')) {
                            application.content.clear();
                        }
                    },
                    false, true, true, this);

                dom.handle(
                    inputEls.fileInputEl, 'change',
                    function ArmadillogInput_uiInit_fileInputElChangeHandler(evt) {
                        if (!application.busy.check()) {
                            var files = evt.target.files;
                            if (files.length) {
                                application.content.clear();
                                application.content.fileSet(files[0], files[0].name);
                            }
                        }
                    },
                    false, true, true, this);

                dom.handle(
                    inputEls.fileButtonEl, 'click',
                    function ArmadillogInput_uiInit_fileButtonElClickHandler(evt) {
                        if (!application.busy.check()) {
                            inputEls.fileInputEl.click();
                        }
                    },
                    false, true, true, this);

                dom.handle(
                    inputEls.pasteButtonEl, 'click',
                    function ArmadillogInput_uiInit_pasteButtonElClickHandler(evt) {
                        if (!application.busy.check() && inputEls.pasteInputEl.value) {
                            application.content.clear();
                            application.content.textSet(inputEls.pasteInputEl.value, '(pasted text)');
                            inputEls.pasteInputEl.value = '';
                        }
                    },
                    false, true, true, this);

                dom.handle(
                    inputEls.urlInputEl, 'keypress',
                    function ArmadillogInput_uiInit_urlInputElKeypressHandler(evt) {
                        if (evt.keyCode === 13) {
                            inputEls.urlButtonEl.click();

                            evt.preventDefault();
                            evt.stopPropagation();
                        }
                    },
                    false, false, false, this);

                dom.handle(
                    inputEls.urlButtonEl, 'click',
                    function ArmadillogInput_uiInit_urlButtonElClickHandler(evt) {
                        if (!application.busy.check() && inputEls.urlInputEl.value) {
                            application.content.clear();
                            application.content.urlSet(inputEls.urlInputEl.value, inputEls.urlInputEl.value);
                            inputEls.urlInputEl.value = '';
                        }
                    },
                    false, true, true, this);

                application.content.on(
                    'source-change',
                    function ArmadillogInput_uiInit_applicationSourceChangeHandler(evt, data) {
                        clearLabelSet(data.label);
                    });

                return true;
            };

            /**
             *
             */
            var clearLabelSet = function ArmadillogInput_clearLabelSet(value) {
                inputEls.clearLabelEl.innerHTML = utils.string.escapeXML(value || '');
                dom.classDepend(inputEls.clearBoxEl, HIDDEN_CLASS, value === null);

                return true;
            };

            /**
             *
             */
            var toString = this.toString = function ArmadillogInput_toString() {
                return 'ennovum.ArmadillogInput';
            };

            //
            init.apply(this, arguments);
        };

        //
        return ArmadillogInput;
    });
