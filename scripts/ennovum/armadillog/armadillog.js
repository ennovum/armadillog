'use strict';

define(
    [
        'ennovum.environment',
        'ennovum.utils',
        './components/busy',
        './components/content',
        './components/examine',
        './components/input',
        './components/filter',
        './components/tailing'
    ],
    function (
        environment,
        utils,
        ArmadillogBusy,
        ArmadillogContent,
        ArmadillogExamine,
        ArmadillogInput,
        ArmadillogFilter,
        ArmadillogTailing
    ) {
        /**
         * Armadillog constructor
         */
        var Armadillog = function Armadillog() {
            var application;

            /**
             * Initializes instance
             *
             * @param {object} config configuration object
             */
            var init = function Armadillog_init(config) {
                switch (true) {
                    case !browserCheck():
                    case !applicationInit(config):
                        return false;
                        break;
                }

                return true;
            };

            /**
             *
             */
            var browserCheck = function Armadillog_browserCheck() {
                switch (true) {
                    case !document.querySelector:
                    case !File:
                    case !FileReader:
                    case !FileList:
                    case !Blob:
                    case !Array.prototype.some:
                    case !Worker:
                    case !URL || !URL.createObjectURL:
                    case !localStorage:
                        console.error('Armadillog', 'browserCheck', 'unsupported browser');
                        alert('You are using an uncompatible browser!');
                        return false;
                        break;
                }

                return true;
            };

            /**
             * Initializes data
             */
            var applicationInit = function Armadillog_applicationInit(config) {
                application = {};

                application.filter = new ArmadillogFilter(config, application);
                application.content = new ArmadillogContent(config, application);
                application.input = new ArmadillogInput(config, application);
                application.tailing = new ArmadillogTailing(config, application);
                application.examine = new ArmadillogExamine(config, application);
                application.busy = new ArmadillogBusy(config, application);

                return true;
            };

            /**
             * Clears content
             */
            var contentClear = this.contentClear = function Armadillog_contentClear() {
                application.content.clear();

                return true;
            };

            /**
             * Sets a piece of source
             *
             * @param {string} text a piece of source text
             */
            var contentTextSet = this.contentTextSet = function Armadillog_contentTextSet(text, label) {
                application.content.textSet(text, label);

                return true;
            };

            /**
             *
             */
            var toString = this.toString = function Armadillog_toString() {
                return 'ennovum.Armadillog';
            };

            //
            init.apply(this, arguments);
            // utils.debug.spy(this);
        };

        //
        return Armadillog;
    });
