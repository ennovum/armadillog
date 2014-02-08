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
         * ArmadillogBusy constructor
         */
        var ArmadillogBusy = function ArmadillogBusy(config, application) {
            var itc = {
                config: undefined,
                application: undefined,

                busy: undefined,
                busyTaskList: undefined,

                bodyEl: undefined
            };

            this.set = set.bind(this, itc);
            this.check = check.bind(this, itc);

            this.toString = toString.bind(this, itc);

            init.call(this, itc, config, application);

            return this;
        };

        /**
         * Initializes instance
         *
         * @param {object} config configuration object
         */
        var init = function ArmadillogBusy_init(itc, config, application) {
            switch (true) {
                case !configSet(itc, config):
                case !dataInit(itc, application):
                case !viewInit(itc):
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
        var configSet = function ArmadillogBusy_configSet(itc, config) {
            switch (false) {
                case !!config:
                case typeof config === 'object':
                    console.error('ArmadillogBusy', 'configSet', 'invalid input');
                    return false;
            };

            itc.config = {
                bodyEl: config.bodyEl || null
            };

            return true;
        };

        /**
         * Initializes data
         */
        var dataInit = function ArmadillogBusy_dataInit(itc, application) {
            itc.application = application;

            itc.busy = false;
            itc.busyTaskList = [];

            return true;
        };

        /**
         * Initializes view
         */
        var viewInit = function ArmadillogBusy_viewInit(itc) {
            itc.bodyEl = itc.config.bodyEl;

            return true;
        };

        /**
         * Sets app busy mode
         *
         * @param {boolean} busy busy flag value
         */
        var set = function ArmadillogBusy_set(itc, busy, task) {
            var taskIx = itc.busyTaskList.indexOf(task);

            if (busy) {
                if (!~taskIx) {
                    itc.busyTaskList.push(task);
                }

                if (!itc.busy) {
                    itc.busy = true;
                    dom.classAdd(itc.bodyEl, 'busy');
                }
            }
            else {
                if (~taskIx) {
                    itc.busyTaskList.splice(taskIx, 1);
                }

                if (itc.busyTaskList.length === 0) {
                    itc.busy = false;
                    dom.classRemove(itc.bodyEl, 'busy');
                }
            }

            return true;
        };

        /**
         * Checks busy state
         */
        var check = function ArmadillogBusy_check(itc) {
            return itc.busy;
        };

        /**
         *
         */
        var toString = function ArmadillogBusy_toString(itc) {
            return 'ennovum.ArmadillogBusy';
        };

        //
        return ArmadillogBusy;
    });
