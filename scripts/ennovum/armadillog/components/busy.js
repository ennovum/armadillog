'use strict';

window.define && define(
    [
        'ennovum.Environment',
        'ennovum.Utils'
    ],
    function (
        mEnvironment,
        mUtils
    ) {
/* ==================================================================================================== */

// debug spy switch
var DEBUG = false;

/**
 * ArmadillogBusy static
 */
var armadillogBusyStatic = {
};

/**
 * ArmadillogBusy interface
 */
var armadillogBusyInterface = {
    launch: function () {},

    set: function (busy, task) {},
    check: function () {}
};

/**
 * ArmadillogBusy constructor
 */
var ArmadillogBusy = function ArmadillogBusy() {
    this.init.apply(this, arguments);
    DEBUG && mUtils.debug.spy(this);
    return mUtils.obj.implement({}, this, armadillogBusyInterface);
};

/**
 * ArmadillogBusy prototype
 */
ArmadillogBusy.prototype = {

    /**
     * Initializes instance
     *
     * @param {object} config configuration object
     */
    init: function ArmadillogBusy_init(config, application) {
        switch (true) {
            case !this.configSet(config):
            case !this.dataInit(application):
            case !this.viewInit():
                return false;
                break;
        }

        return true;
    },

    /**
     * Initializes config
     *
     * @param {object} config configuration object
     */
    configSet: function ArmadillogBusy_configSet(config) {
        switch (false) {
            case !!config:
            case typeof config === 'object':
                console.error('ArmadillogBusy', 'configSet', 'invalid input');
                return false;
        };

        this.config = {
            bodyEl: config.bodyEl || null
        };

        return true;
    },

    /**
     * Initializes data
     */
    dataInit: function ArmadillogBusy_dataInit(application) {
        this.application = application;

        this.busy = false;
        this.busyTaskList = [];

        return true;
    },

    /**
     * Initializes view
     */
    viewInit: function ArmadillogBusy_viewInit() {
        this.bodyEl = this.config.bodyEl;

        return true;
    },

    /**
     * Launches component
     */
    launch: function ArmadillogBusy_launch() {
        switch (true) {
            case !this.uiInit():
                return false;
                break;
        }

        return true;
    },

    /**
     * Initializes UI
     */
    uiInit: function ArmadillogBusy_uiInit() {
        // nothing

        return true;
    },

    /**
     * Sets app busy mode
     *
     * @param {boolean} busy busy flag value
     */
    set: function ArmadillogBusy_set(busy, task) {
        var taskIndex = this.busyTaskList.indexOf(task);

        if (busy) {
            if (!~taskIndex) {
                this.busyTaskList.push(task);
            }

            if (!this.busy) {
                this.busy = true;

                // this.view.frameEl.removeChild(this.view.lineListEl);
                mUtils.dom.classAdd(this.bodyEl, 'busy');
            }
        }
        else {
            if (~taskIndex) {
                this.busyTaskList.splice(taskIndex, 1);
            }

            if (this.busyTaskList.length === 0) {
                this.busy = false;

                // this.view.frameEl.appendChild(this.view.lineListEl);
                mUtils.dom.classRemove(this.bodyEl, 'busy');
            }
        }

        return true;
    },

    /**
     * Checks busy state
     */
    check: function ArmadillogBusy_check() {
        return this.busy;
    },

    /**
     *
     */
    toString: function ArmadillogBusy_toString() {
        return 'ennovum.ArmadillogBusy';
    }

};

/* ==================================================================================================== */
        return {
            'armadillogBusyStatic': armadillogBusyStatic,
            'armadillogBusyInterface': armadillogBusyInterface,
            'ArmadillogBusy': ArmadillogBusy
        };
    });
