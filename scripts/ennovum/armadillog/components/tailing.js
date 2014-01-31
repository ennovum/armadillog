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
        var ArmadillogTailing = function ArmadillogTailing() {
            var config;
            var application;

            var tailing;

            var scrollEl;

            /**
             * Initializes instance
             *
             * @param {object} argConfig configuration object
             */
            var init = function ArmadillogTailing_init(argConfig, argApplication) {
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
            var configSet = function ArmadillogTailing_configSet(argConfig) {
                switch (false) {
                    case !!argConfig:
                    case typeof argConfig === 'object':
                        console.error('ArmadillogTailing', 'configSet', 'invalid input');
                        return false;
                };

                config = {
                    scrollEl: argConfig.contentScrollEl || null
                };

                return true;
            };

            /**
             * Initializes data
             */
            var dataInit = function ArmadillogTailing_dataInit(argApplication) {
                application = argApplication;

                tailing = false;

                return true;
            };

            /**
             * Initializes view
             */
            var viewInit = function ArmadillogTailing_viewInit() {
                scrollEl = config.scrollEl;

                return true;
            };

            /**
             * Initializes UI
             */
            var uiInit = function ArmadillogTailing_uiInit() {
                dom.handle(window, 'load', check, false, false, false, this);
                dom.handle(scrollEl, 'scroll', check, false, true, true, this);

                application.content.on('view-change', execute);

                return true;
            };

            /**
             * Checks whether to do tailing
             */
            var check = function ArmadillogTailing_check() {
                if (scrollEl === window) {
                    tailing = window.scrollY >= window.scrollMaxY
                }
                else {
                    tailing = scrollEl.scrollTop > 0 && scrollEl.scrollTop + scrollEl.offsetHeight >= scrollEl.scrollHeight;
                }

                return true;
            };

            /**
             * Executes tailing
             */
            var execute = function ArmadillogTailing_execute() {
                if (tailing) {
                    if (scrollEl === window) {
                        window.scrollTo(window.scrollX, window.scrollMaxY);
                    }
                    else {
                        scrollEl.scrollTop = scrollEl.scrollHeight - scrollEl.offsetHeight;
                    }
                }

                return true;
            };

            /**
             *
             */
            var toString = this.toString = function ArmadillogTailing_toString() {
                return 'ennovum.ArmadillogTailing';
            };

            //
            init.apply(this, arguments);
        };

        //
        return ArmadillogTailing;
    });
