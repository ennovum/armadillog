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
        var ArmadillogBusy = function ArmadillogBusy() {
            var config;
            var application;

            var busy;
            var busyTaskList;

            var bodyEl;

            /**
             * Initializes instance
             *
             * @param {object} argConfig configuration object
             */
            var init = function ArmadillogBusy_init(argConfig, argApplication) {
                switch (true) {
                    case !configSet(argConfig):
                    case !dataInit(argApplication):
                    case !viewInit():
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
            var configSet = function ArmadillogBusy_configSet(argConfig) {
                switch (false) {
                    case !!argConfig:
                    case typeof argConfig === 'object':
                        console.error('ArmadillogBusy', 'configSet', 'invalid input');
                        return false;
                };

                config = {
                    bodyEl: argConfig.bodyEl || null
                };

                return true;
            };

            /**
             * Initializes data
             */
            var dataInit = function ArmadillogBusy_dataInit(argApplication) {
                application = argApplication;

                busy = false;
                busyTaskList = [];

                return true;
            };

            /**
             * Initializes view
             */
            var viewInit = function ArmadillogBusy_viewInit() {
                bodyEl = config.bodyEl;

                return true;
            };

            /**
             * Sets app busy mode
             *
             * @param {boolean} busy busy flag value
             */
            var set = this.set = function ArmadillogBusy_set(argBusy, task) {
                var taskIx = busyTaskList.indexOf(task);

                if (argBusy) {
                    if (!~taskIx) {
                        busyTaskList.push(task);
                    }

                    if (!busy) {
                        busy = true;
                        dom.classAdd(bodyEl, 'busy');
                    }
                }
                else {
                    if (~taskIx) {
                        busyTaskList.splice(taskIx, 1);
                    }

                    if (busyTaskList.length === 0) {
                        busy = false;
                        dom.classRemove(bodyEl, 'busy');
                    }
                }

                return true;
            };

            /**
             * Checks busy state
             */
            var check = this.check = function ArmadillogBusy_check() {
                return busy;
            };

            /**
             *
             */
            var toString = this.toString = function ArmadillogBusy_toString() {
                return 'ennovum.ArmadillogBusy';
            };

            //
            init.apply(this, arguments);
        };

        //
        return ArmadillogBusy;
    });
