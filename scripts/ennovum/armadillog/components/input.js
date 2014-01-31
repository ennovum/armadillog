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

            var view;
            var bodyEl;
            var boxEl;
            var inputView;

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
                view = new ArmadillogInputView();

                bodyEl = config.bodyEl;

                boxEl = config.boxEl;
                if (!boxEl) {
                    console.error('ArmadillogInput', 'viewInit', 'invalid boxEl');
                    return false;
                };

                inputView = view.inputViewGet();
                boxEl.appendChild(inputView.clearBoxEl);
                boxEl.appendChild(inputView.fileBoxEl);
                boxEl.appendChild(inputView.pasteBoxEl);
                boxEl.appendChild(inputView.urlBoxEl);

                return true;
            };

            /**
             * Initializes UI
             */
            var uiInit = function ArmadillogInput_uiInit() {
                inputView.clearButtonEl.addEventListener(
                    'click',
                    function ArmadillogInput_uiInit_clearButtonElClickHandler(evt) {
                        if (!application.busy.check() && confirm('Are you sure?')) {
                            application.content.clear();
                        }

                        evt.preventDefault();
                        evt.stopPropagation();
                    });

                inputView.fileInputEl.addEventListener(
                    'change',
                    function ArmadillogInput_uiInit_fileInputElChangeHandler(evt) {
                        if (!application.busy.check()) {
                            var files = evt.target.files;
                            if (files.length) {
                                application.content.clear();
                                application.content.fileSet(files[0], files[0].name);
                            }
                        }

                        evt.preventDefault();
                        evt.stopPropagation();
                    });

                inputView.fileButtonEl.addEventListener(
                    'click',
                    function ArmadillogInput_uiInit_fileButtonElClickHandler(evt) {
                        if (!application.busy.check()) {
                            inputView.fileInputEl.click();
                        }

                        evt.preventDefault();
                        evt.stopPropagation();
                    });

                inputView.pasteButtonEl.addEventListener(
                    'click',
                    function ArmadillogInput_uiInit_pasteButtonElClickHandler(evt) {
                        if (!application.busy.check() && inputView.pasteInputEl.value) {
                            application.content.clear();
                            application.content.textSet(inputView.pasteInputEl.value, '(pasted text)');
                            inputView.pasteInputEl.value = '';
                        }

                        evt.preventDefault();
                        evt.stopPropagation();
                    });

                inputView.urlInputEl.addEventListener(
                    'keypress',
                    function ArmadillogInput_uiInit_urlInputElKeypressHandler(evt) {
                        if (evt.keyCode === 13) {
                            inputView.urlButtonEl.click();

                            evt.preventDefault();
                            evt.stopPropagation();
                        }
                    });

                inputView.urlButtonEl.addEventListener(
                    'click',
                    function ArmadillogInput_uiInit_urlButtonElClickHandler(evt) {
                        if (!application.busy.check() && inputView.urlInputEl.value) {
                            application.content.clear();
                            application.content.urlSet(inputView.urlInputEl.value, inputView.urlInputEl.value);
                            inputView.urlInputEl.value = '';
                        }

                        evt.preventDefault();
                        evt.stopPropagation();
                    });

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
                inputView.clearLabelEl.innerHTML = utils.string.escapeXML(value || '');
                dom.classDepend(inputView.clearBoxEl, HIDDEN_CLASS, value === null);

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
            // utils.debug.spy(this);
        };

        //
        return ArmadillogInput;
    });
