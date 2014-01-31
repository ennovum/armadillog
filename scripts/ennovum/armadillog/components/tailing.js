'use strict';

define(
    [
        'ennovum.environment',
        'ennovum.utils'
    ],
    function (
        environment,
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
                window.addEventListener(
                    'load',
                    function ArmadillogTailing_uiInit_windowLoadHandler(evt) {
                        check();
                    },
                    false);

                scrollEl.addEventListener(
                    'scroll',
                    function ArmadillogTailing_uiInit_scrollElScrollHandler(evt) {
                        check();

                        evt.preventDefault();
                        evt.stopPropagation();
                    },
                    false);

                application.content.on(
                    'view-change',
                    function ArmadillogTailing_uiInit_applicationContentViewChangeHandler(evt) {
                        execute();
                    },
                    false);

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
