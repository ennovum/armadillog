'use strict';

define(
    [
        'ennovum.environment',
        'ennovum.utils',
        './controllers/busy',
        './controllers/content',
        './controllers/examine',
        './controllers/input',
        './controllers/filter',
        './controllers/tailing'
    ],
    function (
        environment,
        utils,
        ControllerBusy,
        ControllerContent,
        ControllerExamine,
        ControllerInput,
        ControllerFilter,
        ControllerTailing
    ) {
        /**
         * Armadillog constructor
         */
        var Armadillog = function Armadillog(config) {
            var itc = {
                application: undefined
            };

            this.contentClear = contentClear.bind(this, itc);
            this.contentTextSet = contentTextSet.bind(this, itc);

            init.call(this, itc, config)
        };

        /**
         * Initializes instance
         *
         * @param {object} config configuration object
         */
        var init = function Armadillog_init(itc, config) {
            switch (true) {
                case !browserCheck(itc):
                case !applicationInit(itc, config):
                    return false;
                    break;
            }

            return true;
        };

        /**
         *
         */
        var browserCheck = function Armadillog_browserCheck(itc) {
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
        var applicationInit = function Armadillog_applicationInit(itc, config) {
            itc.application = {};

            itc.application.filter = new ControllerFilter(config, itc.application);
            itc.application.content = new ControllerContent(config, itc.application);
            itc.application.input = new ControllerInput(config, itc.application);
            itc.application.tailing = new ControllerTailing(config, itc.application);
            itc.application.examine = new ControllerExamine(config, itc.application);
            itc.application.busy = new ControllerBusy(config, itc.application);

            return true;
        };

        /**
         * Clears content
         */
        var contentClear = function Armadillog_contentClear(itc) {
            itc.application.content.clear();

            return true;
        };

        /**
         * Sets a piece of source
         *
         * @param {string} text a piece of source text
         */
        var contentTextSet = function Armadillog_contentTextSet(itc, text, label) {
            itc.application.content.textSet(text, label);

            return true;
        };

        //
        return Armadillog;
    });
