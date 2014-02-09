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
        var Layout = function Layout(config) {
            var itc = {
                config: undefined
            };

            init.call(this, itc, config);
        };

        /**
         * Initializes instance
         *
         * @param {object} config configuration object
         */
        var init = function Layout_init(itc, config) {
            switch (true) {
                case !configSet(itc, config):
                case !viewInit(itc):
                case !uiInit(itc):
                case !keyboardInit(itc):
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
        var configSet = function Layout_configSet(itc, config) {
            switch (false) {
                case !!config:
                case typeof config === 'object':
                    console.error('Layout', 'configSet', 'invalid input');
                    return false;
            };

            itc.config = {
                mainmenuInputEl: config.mainmenuInputEl || null,
                inputWrapperEl: config.inputWrapperEl || null,
                inputFoldEl: config.inputFoldEl || null,
                mainmenuFilterEl: config.mainmenuFilterEl || null,
                filterWrapperEl: config.filterWrapperEl || null,
                filterFoldEl: config.filterFoldEl || null,
                mainmenuExamineEl: config.mainmenuExamineEl || null,
                examineWrapperEl: config.examineWrapperEl || null,
                examineFoldEl: config.examineFoldEl || null,
                mainmenuManualEl: config.mainmenuManualEl || null,
                manualWrapperEl: config.manualWrapperEl || null,
                manualFoldEl: config.manualFoldEl || null,
                contentBoxEl: config.contentBoxEl || null
            };

            return true;
        };

        /**
         * Initializes view
         */
        var viewInit = function Layout_viewInit(itc) {
            // nothing

            return true;
        };

        /**
         * Initializes UI
         */
        var uiInit = function Layout_uiInit(itc) {
            dom.handle(itc.config.mainmenuInputEl, 'click', inputToggle, false, true, false, this, [itc]);
            dom.handle(itc.config.inputFoldEl, 'click', inputToggle, false, true, false, this, [itc]);
            dom.handle(itc.config.mainmenuFilterEl, 'click', filterToggle, false, true, false, this, [itc]);
            dom.handle(itc.config.filterFoldEl, 'click', filterToggle, false, true, false, this, [itc]);
            dom.handle(itc.config.mainmenuExamineEl, 'click', examineToggle, false, true, false, this, [itc]);
            dom.handle(itc.config.examineFoldEl, 'click', examineToggle, false, true, false, this, [itc]);
            dom.handle(itc.config.mainmenuManualEl, 'click', manualToggle, false, true, false, this, [itc]);
            dom.handle(itc.config.manualFoldEl, 'click', manualToggle, false, true, false, this, [itc]);

            return true;
        };

        /**
         *
         */
        var keyboardInit = function Layout_keyboardInit(itc) {
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
                            inputToggle(itc);
                            itc.config.mainmenuInputEl.focus();
                            break;

                        case evt.keyCode === 70 && !evt.ctrlKey && !evt.altKey && !evt.shiftKey: // f
                            filterToggle(itc);
                            itc.config.mainmenuFilterEl.focus();
                            break;

                        case evt.keyCode === 69 && !evt.ctrlKey && !evt.altKey && !evt.shiftKey: // e
                            examineToggle(itc);
                            itc.config.mainmenuExamineEl.focus();
                            break;

                        case evt.keyCode === 77 && !evt.ctrlKey && !evt.altKey && !evt.shiftKey: // m
                            manualToggle(itc);
                            itc.config.mainmenuManualEl.focus();
                            break;

                        case evt.keyCode === 27 && !evt.ctrlKey && !evt.altKey && !evt.shiftKey: // esc
                            inputHide(itc);
                            filterHide(itc);
                            examineHide(itc);
                            manualHide(itc);
                            break;
                    }
                },
                false, false, false, this);

            return true;
        };

        /**
         *
         */
        var inputHide = function Layout_inputHide(itc) {
            dom.classRemove(itc.config.mainmenuInputEl, 'pressed');

            dom.classAdd(itc.config.inputWrapperEl, 'hidden');

            return true;
        };

        /**
         *
         */
        var inputToggle = function Layout_inputToggle(itc) {
            dom.classToggle(itc.config.mainmenuInputEl, 'pressed');
            dom.classRemove(itc.config.mainmenuFilterEl, 'pressed')
            dom.classRemove(itc.config.mainmenuExamineEl, 'pressed')
            dom.classRemove(itc.config.mainmenuManualEl, 'pressed')

            dom.classToggle(itc.config.inputWrapperEl, 'hidden');
            dom.classAdd(itc.config.filterWrapperEl, 'hidden');
            dom.classAdd(itc.config.examineWrapperEl, 'hidden');
            dom.classAdd(itc.config.manualWrapperEl, 'hidden');

            return true;
        };

        /**
         *
         */
        var filterHide = function Layout_filterHide(itc) {
            dom.classRemove(itc.config.mainmenuFilterEl, 'pressed')

            dom.classAdd(itc.config.filterWrapperEl, 'hidden');

            return true;
        };

        /**
         *
         */
        var filterToggle = function Layout_filterToggle(itc) {
            dom.classRemove(itc.config.mainmenuInputEl, 'pressed');
            dom.classToggle(itc.config.mainmenuFilterEl, 'pressed')
            dom.classRemove(itc.config.mainmenuExamineEl, 'pressed')
            dom.classRemove(itc.config.mainmenuManualEl, 'pressed')

            dom.classAdd(itc.config.inputWrapperEl, 'hidden');
            dom.classToggle(itc.config.filterWrapperEl, 'hidden');
            dom.classAdd(itc.config.examineWrapperEl, 'hidden');
            dom.classAdd(itc.config.manualWrapperEl, 'hidden');

            return true;
        };

        /**
         *
         */
        var examineHide = function Layout_examineHide(itc) {
            dom.classRemove(itc.config.mainmenuExamineEl, 'pressed')

            dom.classAdd(itc.config.examineWrapperEl, 'hidden');

            return true;
        };

        /**
         *
         */
        var examineToggle = function Layout_examineToggle(itc) {
            dom.classRemove(itc.config.mainmenuInputEl, 'pressed');
            dom.classRemove(itc.config.mainmenuFilterEl, 'pressed')
            dom.classToggle(itc.config.mainmenuExamineEl, 'pressed')
            dom.classRemove(itc.config.mainmenuManualEl, 'pressed')

            dom.classAdd(itc.config.inputWrapperEl, 'hidden');
            dom.classAdd(itc.config.filterWrapperEl, 'hidden');
            dom.classToggle(itc.config.examineWrapperEl, 'hidden');
            dom.classAdd(itc.config.manualWrapperEl, 'hidden');

            return true;
        };

        /**
         *
         */
        var manualHide = function Layout_manualHide(itc) {
            dom.classRemove(itc.config.mainmenuManualEl, 'pressed')

            dom.classAdd(itc.config.manualWrapperEl, 'hidden');

            return true;
        };

        /**
         *
         */
        var manualToggle = function Layout_manualToggle(itc) {
            dom.classRemove(itc.config.mainmenuInputEl, 'pressed');
            dom.classRemove(itc.config.mainmenuFilterEl, 'pressed')
            dom.classRemove(itc.config.mainmenuExamineEl, 'pressed')
            dom.classToggle(itc.config.mainmenuManualEl, 'pressed')

            dom.classAdd(itc.config.inputWrapperEl, 'hidden');
            dom.classAdd(itc.config.filterWrapperEl, 'hidden');
            dom.classAdd(itc.config.examineWrapperEl, 'hidden');
            dom.classToggle(itc.config.manualWrapperEl, 'hidden');

            return true;
        };

        //
        return Layout;
    });
