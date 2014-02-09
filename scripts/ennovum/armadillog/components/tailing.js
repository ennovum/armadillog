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
         * ArmadillogTailing constructor
         */
        var ArmadillogTailing = function ArmadillogTailing(argConfig, argApplication) {
            var itc = {
                config: undefined,
                application: undefined,

                tailing: undefined,

                scrollEl: undefined
            };

            init.call(this, itc, argConfig, argApplication);
        };

        /**
         * Initializes instance
         *
         * @param {object} argConfig configuration object
         */
        var init = function ArmadillogTailing_init(itc, argConfig, argApplication) {
            switch (true) {
                case !configSet(itc, argConfig):
                case !dataInit(itc, argApplication):
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
         * @param {object} argConfig configuration object
         */
        var configSet = function ArmadillogTailing_configSet(itc, argConfig) {
            switch (false) {
                case !!argConfig:
                case typeof argConfig === 'object':
                    console.error('ArmadillogTailing', 'configSet', 'invalid input');
                    return false;
            };

            itc.config = {
                scrollEl: argConfig.contentScrollEl || null
            };

            return true;
        };

        /**
         * Initializes data
         */
        var dataInit = function ArmadillogTailing_dataInit(itc, argApplication) {
            itc.application = argApplication;

            itc.tailing = false;

            return true;
        };

        /**
         * Initializes view
         */
        var viewInit = function ArmadillogTailing_viewInit(itc) {
            itc.scrollEl = itc.config.scrollEl;

            return true;
        };

        /**
         * Initializes UI
         */
        var uiInit = function ArmadillogTailing_uiInit(itc) {
            dom.handle(window, 'load', false, false, false, check, this, [itc]);
            dom.handle(itc.scrollEl, 'scroll', false, true, true, check, this, [itc]);

            itc.application.content.handle('view-change', execute, this, [itc]);

            return true;
        };

        /**
         * Checks whether to do tailing
         */
        var check = function ArmadillogTailing_check(itc) {
            if (itc.scrollEl === window) {
                itc.tailing = window.scrollY >= window.scrollMaxY
            }
            else {
                itc.tailing = itc.scrollEl.scrollTop > 0 && itc.scrollEl.scrollTop + itc.scrollEl.offsetHeight >= itc.scrollEl.scrollHeight;
            }

            return true;
        };

        /**
         * Executes tailing
         */
        var execute = function ArmadillogTailing_execute(itc) {
            if (itc.tailing) {
                if (itc.scrollEl === window) {
                    window.scrollTo(window.scrollX, window.scrollMaxY);
                }
                else {
                    itc.scrollEl.scrollTop = itc.scrollEl.scrollHeight - itc.scrollEl.offsetHeight;
                }
            }

            return true;
        };

        //
        return ArmadillogTailing;
    });
