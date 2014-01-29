'use strict';

window.define && define(
    [
        'ennovum.Environment',
        'ennovum.Utils'
    ],
    function (
        mEnvironment,
        mUtils
    ) {
        /**
         * Layout constructor
         */
        var Layout = function Layout() {
            var config;

            /**
             * Initializes instance
             *
             * @param {object} argConfig configuration object
             */
            var init = function Layout_init(argConfig) {
                switch (true) {
                    case !configSet(argConfig):
                    case !viewInit():
                    case !uiInit():
                    case !keyboardInit():
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
            var configSet = function Layout_configSet(argConfig) {
                switch (false) {
                    case !!argConfig:
                    case typeof argConfig === 'object':
                        console.error('Layout', 'configSet', 'invalid input');
                        return false;
                };

                config = {
                    mainmenuInputEl: argConfig.mainmenuInputEl || null,
                    inputWrapperEl: argConfig.inputWrapperEl || null,
                    inputFoldEl: argConfig.inputFoldEl || null,
                    mainmenuFilterEl: argConfig.mainmenuFilterEl || null,
                    filterWrapperEl: argConfig.filterWrapperEl || null,
                    filterFoldEl: argConfig.filterFoldEl || null,
                    mainmenuExamineEl: argConfig.mainmenuExamineEl || null,
                    examineWrapperEl: argConfig.examineWrapperEl || null,
                    examineFoldEl: argConfig.examineFoldEl || null,
                    mainmenuManualEl: argConfig.mainmenuManualEl || null,
                    manualWrapperEl: argConfig.manualWrapperEl || null,
                    manualFoldEl: argConfig.manualFoldEl || null,
                    contentBoxEl: argConfig.contentBoxEl || null
                };

                return true;
            };

            /**
             * Initializes view
             */
            var viewInit = function Layout_viewInit() {
                // nothing

                return true;
            };

            /**
             * Initializes UI
             */
            var uiInit = function Layout_uiInit() {
                config.mainmenuInputEl.addEventListener(
                    'click',
                    function (evt) {
                        inputToggle();
                        evt.preventDefault();
                    });

                config.inputFoldEl.addEventListener(
                    'click',
                    function (evt) {
                        inputToggle();
                        evt.preventDefault();
                    });

                config.mainmenuFilterEl.addEventListener(
                    'click',
                    function (evt) {
                        filterToggle();
                        evt.preventDefault();
                    });

                config.filterFoldEl.addEventListener(
                    'click',
                    function (evt) {
                        filterToggle();
                        evt.preventDefault();
                    });

                config.mainmenuExamineEl.addEventListener(
                    'click',
                    function (evt) {
                        examineToggle();
                        evt.preventDefault();
                    });

                config.examineFoldEl.addEventListener(
                    'click',
                    function (evt) {
                        examineToggle();
                        evt.preventDefault();
                    });

                config.mainmenuManualEl.addEventListener(
                    'click',
                    function (evt) {
                        manualToggle();
                        evt.preventDefault();
                    });

                config.manualFoldEl.addEventListener(
                    'click',
                    function (evt) {
                        manualToggle();
                        evt.preventDefault();
                    });

                return true;
            };

            /**
             *
             */
            var keyboardInit = function Layout_keyboardInit() {
                document.addEventListener(
                    'keyup',
                    function (evt) {
                        switch (evt.target.tagName.toLowerCase()) {
                            case 'input':
                            case 'textarea':
                                return;
                                break;
                        }

                        switch (true) {
                            case evt.keyCode === 73 && !evt.ctrlKey && !evt.altKey && !evt.shiftKey: // i
                                inputToggle();
                                config.mainmenuInputEl.focus();
                                break;

                            case evt.keyCode === 70 && !evt.ctrlKey && !evt.altKey && !evt.shiftKey: // f
                                filterToggle();
                                config.mainmenuFilterEl.focus();
                                break;

                            case evt.keyCode === 69 && !evt.ctrlKey && !evt.altKey && !evt.shiftKey: // e
                                examineToggle();
                                config.mainmenuExamineEl.focus();
                                break;

                            case evt.keyCode === 77 && !evt.ctrlKey && !evt.altKey && !evt.shiftKey: // m
                                manualToggle();
                                config.mainmenuManualEl.focus();
                                break;

                            case evt.keyCode === 27 && !evt.ctrlKey && !evt.altKey && !evt.shiftKey: // esc
                                inputHide();
                                filterHide();
                                examineHide();
                                manualHide();
                                break;
                        }
                    });

                return true;
            };

            /**
             *
             */
            var inputHide = function Layout_inputHide() {
                mUtils.dom.classRemove(config.mainmenuInputEl, 'pressed');

                mUtils.dom.classAdd(config.inputWrapperEl, 'hidden');

                return true;
            };

            /**
             *
             */
            var inputToggle = function Layout_inputToggle() {
                mUtils.dom.classToggle(config.mainmenuInputEl, 'pressed');
                mUtils.dom.classRemove(config.mainmenuFilterEl, 'pressed')
                mUtils.dom.classRemove(config.mainmenuExamineEl, 'pressed')
                mUtils.dom.classRemove(config.mainmenuManualEl, 'pressed')

                mUtils.dom.classToggle(config.inputWrapperEl, 'hidden');
                mUtils.dom.classAdd(config.filterWrapperEl, 'hidden');
                mUtils.dom.classAdd(config.examineWrapperEl, 'hidden');
                mUtils.dom.classAdd(config.manualWrapperEl, 'hidden');

                return true;
            };

            /**
             *
             */
            var filterHide = function Layout_filterHide() {
                mUtils.dom.classRemove(config.mainmenuFilterEl, 'pressed')

                mUtils.dom.classAdd(config.filterWrapperEl, 'hidden');

                return true;
            };

            /**
             *
             */
            var filterToggle = function Layout_filterToggle() {
                mUtils.dom.classRemove(config.mainmenuInputEl, 'pressed');
                mUtils.dom.classToggle(config.mainmenuFilterEl, 'pressed')
                mUtils.dom.classRemove(config.mainmenuExamineEl, 'pressed')
                mUtils.dom.classRemove(config.mainmenuManualEl, 'pressed')

                mUtils.dom.classAdd(config.inputWrapperEl, 'hidden');
                mUtils.dom.classToggle(config.filterWrapperEl, 'hidden');
                mUtils.dom.classAdd(config.examineWrapperEl, 'hidden');
                mUtils.dom.classAdd(config.manualWrapperEl, 'hidden');

                return true;
            };

            /**
             *
             */
            var examineHide = function Layout_examineHide() {
                mUtils.dom.classRemove(config.mainmenuExamineEl, 'pressed')

                mUtils.dom.classAdd(config.examineWrapperEl, 'hidden');

                return true;
            };

            /**
             *
             */
            var examineToggle = function Layout_examineToggle() {
                mUtils.dom.classRemove(config.mainmenuInputEl, 'pressed');
                mUtils.dom.classRemove(config.mainmenuFilterEl, 'pressed')
                mUtils.dom.classToggle(config.mainmenuExamineEl, 'pressed')
                mUtils.dom.classRemove(config.mainmenuManualEl, 'pressed')

                mUtils.dom.classAdd(config.inputWrapperEl, 'hidden');
                mUtils.dom.classAdd(config.filterWrapperEl, 'hidden');
                mUtils.dom.classToggle(config.examineWrapperEl, 'hidden');
                mUtils.dom.classAdd(config.manualWrapperEl, 'hidden');

                return true;
            };

            /**
             *
             */
            var manualHide = function Layout_manualHide() {
                mUtils.dom.classRemove(config.mainmenuManualEl, 'pressed')

                mUtils.dom.classAdd(config.manualWrapperEl, 'hidden');

                return true;
            };

            /**
             *
             */
            var manualToggle = function Layout_manualToggle() {
                mUtils.dom.classRemove(config.mainmenuInputEl, 'pressed');
                mUtils.dom.classRemove(config.mainmenuFilterEl, 'pressed')
                mUtils.dom.classRemove(config.mainmenuExamineEl, 'pressed')
                mUtils.dom.classToggle(config.mainmenuManualEl, 'pressed')

                mUtils.dom.classAdd(config.inputWrapperEl, 'hidden');
                mUtils.dom.classAdd(config.filterWrapperEl, 'hidden');
                mUtils.dom.classAdd(config.examineWrapperEl, 'hidden');
                mUtils.dom.classToggle(config.manualWrapperEl, 'hidden');

                return true;
            };

            /**
             *
             */
            var toString = function Layout_toString() {
                return 'ennovum.Layout';
            };

            //
            init.apply(this, arguments);
            // mUtils.debug.spy(this);
        };

        //
        return {
            'Layout': Layout
        };
    });
