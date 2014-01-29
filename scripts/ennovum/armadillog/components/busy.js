'use strict';

window.define && define(
    [
        'ennovum.environment',
        'ennovum.utils'
    ],
    function (
        environment,
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
             * Launches component
             */
            var launch = this.launch = function ArmadillogBusy_launch() {
                switch (true) {
                    case !uiInit():
                        return false;
                        break;
                }

                return true;
            };

            /**
             * Initializes UI
             */
            var uiInit = function ArmadillogBusy_uiInit() {
                // nothing

                return true;
            };

            /**
             * Sets app busy mode
             *
             * @param {boolean} busy busy flag value
             */
            var set = this.set = function ArmadillogBusy_set(busy, task) {
                var taskIndex = busyTaskList.indexOf(task);

                if (busy) {
                    if (!~taskIndex) {
                        busyTaskList.push(task);
                    }

                    if (!busy) {
                        busy = true;
                        utils.dom.classAdd(bodyEl, 'busy');
                    }
                }
                else {
                    if (~taskIndex) {
                        busyTaskList.splice(taskIndex, 1);
                    }

                    if (busyTaskList.length === 0) {
                        busy = false;
                        utils.dom.classRemove(bodyEl, 'busy');
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
            // utils.debug.spy(this);
        };

        //
        return ArmadillogBusy;
    });
