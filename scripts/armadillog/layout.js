'use strict';

define(
    [
        'ennovum.environment',
        'ennovum.dom',
        'ennovum.utils'
    ],
    function (
        environment,
        dom,
        utils
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
                dom.handle(config.mainmenuInputEl, 'click', inputToggle, false, true, false, this);
                dom.handle(config.inputFoldEl, 'click', inputToggle, false, true, false, this);
                dom.handle(config.mainmenuFilterEl, 'click', filterToggle, false, true, false, this);
                dom.handle(config.filterFoldEl, 'click', filterToggle, false, true, false, this);
                dom.handle(config.mainmenuExamineEl, 'click', examineToggle, false, true, false, this);
                dom.handle(config.examineFoldEl, 'click', examineToggle, false, true, false, this);
                dom.handle(config.mainmenuManualEl, 'click', manualToggle, false, true, false, this);
                dom.handle(config.manualFoldEl, 'click', manualToggle, false, true, false, this);

                return true;
            };

            /**
             *
             */
            var keyboardInit = function Layout_keyboardInit() {
                dom.handle(
                    document, 'keyup',
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
                    },
                    false, false, false, this);

                return true;
            };

            /**
             *
             */
            var inputHide = function Layout_inputHide() {
                dom.classRemove(config.mainmenuInputEl, 'pressed');

                dom.classAdd(config.inputWrapperEl, 'hidden');

                return true;
            };

            /**
             *
             */
            var inputToggle = function Layout_inputToggle() {
                dom.classToggle(config.mainmenuInputEl, 'pressed');
                dom.classRemove(config.mainmenuFilterEl, 'pressed')
                dom.classRemove(config.mainmenuExamineEl, 'pressed')
                dom.classRemove(config.mainmenuManualEl, 'pressed')

                dom.classToggle(config.inputWrapperEl, 'hidden');
                dom.classAdd(config.filterWrapperEl, 'hidden');
                dom.classAdd(config.examineWrapperEl, 'hidden');
                dom.classAdd(config.manualWrapperEl, 'hidden');

                return true;
            };

            /**
             *
             */
            var filterHide = function Layout_filterHide() {
                dom.classRemove(config.mainmenuFilterEl, 'pressed')

                dom.classAdd(config.filterWrapperEl, 'hidden');

                return true;
            };

            /**
             *
             */
            var filterToggle = function Layout_filterToggle() {
                dom.classRemove(config.mainmenuInputEl, 'pressed');
                dom.classToggle(config.mainmenuFilterEl, 'pressed')
                dom.classRemove(config.mainmenuExamineEl, 'pressed')
                dom.classRemove(config.mainmenuManualEl, 'pressed')

                dom.classAdd(config.inputWrapperEl, 'hidden');
                dom.classToggle(config.filterWrapperEl, 'hidden');
                dom.classAdd(config.examineWrapperEl, 'hidden');
                dom.classAdd(config.manualWrapperEl, 'hidden');

                return true;
            };

            /**
             *
             */
            var examineHide = function Layout_examineHide() {
                dom.classRemove(config.mainmenuExamineEl, 'pressed')

                dom.classAdd(config.examineWrapperEl, 'hidden');

                return true;
            };

            /**
             *
             */
            var examineToggle = function Layout_examineToggle() {
                dom.classRemove(config.mainmenuInputEl, 'pressed');
                dom.classRemove(config.mainmenuFilterEl, 'pressed')
                dom.classToggle(config.mainmenuExamineEl, 'pressed')
                dom.classRemove(config.mainmenuManualEl, 'pressed')

                dom.classAdd(config.inputWrapperEl, 'hidden');
                dom.classAdd(config.filterWrapperEl, 'hidden');
                dom.classToggle(config.examineWrapperEl, 'hidden');
                dom.classAdd(config.manualWrapperEl, 'hidden');

                return true;
            };

            /**
             *
             */
            var manualHide = function Layout_manualHide() {
                dom.classRemove(config.mainmenuManualEl, 'pressed')

                dom.classAdd(config.manualWrapperEl, 'hidden');

                return true;
            };

            /**
             *
             */
            var manualToggle = function Layout_manualToggle() {
                dom.classRemove(config.mainmenuInputEl, 'pressed');
                dom.classRemove(config.mainmenuFilterEl, 'pressed')
                dom.classRemove(config.mainmenuExamineEl, 'pressed')
                dom.classToggle(config.mainmenuManualEl, 'pressed')

                dom.classAdd(config.inputWrapperEl, 'hidden');
                dom.classAdd(config.filterWrapperEl, 'hidden');
                dom.classAdd(config.examineWrapperEl, 'hidden');
                dom.classToggle(config.manualWrapperEl, 'hidden');

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
        };

        //
        return Layout;
    });
