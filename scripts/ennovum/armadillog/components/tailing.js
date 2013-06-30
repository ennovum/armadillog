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

// debug console logs switch
var DEBUG = false;

/**
 * ArmadillogTailing static
 */
var armadillogTailingStatic = {
};

/**
 * ArmadillogTailing interface
 */
var armadillogTailingInterface = {
    check: function () {},
    execute: function () {},
    stop: function () {}
};

/**
 * ArmadillogTailing constructor
 */
var ArmadillogTailing = function ArmadillogTailing() {
    this.init.apply(this, arguments);
    return mUtils.obj.implement({}, this, armadillogTailingInterface);
};

/**
 * ArmadillogTailing prototype
 */
ArmadillogTailing.prototype = {

    /**
     * Initializes instance
     *
     * @param {object} config configuration object
     */
    init: function ArmadillogTailing_init(config, application) {
        DEBUG && console.log('ArmadillogTailing', 'init', arguments);

        switch (true) {
            case !this.configSet(config):
            case !this.dataInit(application):
            case !this.viewInit():
            case !this.uiInit():
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
    configSet: function ArmadillogTailing_configSet(config) {
        DEBUG && console.log('ArmadillogTailing', 'configSet', arguments);

        switch (false) {
            case !!config:
            case typeof config === 'object':
                console.error('ArmadillogTailing', 'configSet', 'invalid input');
                return false;
        };

        this.config = {
            scrollEl: config.contentScrollEl || null
        };

        return true;
    },

    /**
     * Initializes data
     */
    dataInit: function ArmadillogTailing_dataInit(application) {
        DEBUG && console.log('ArmadillogTailing', 'dataInit', arguments);

        this.tailing = false;

        return true;
    },

    /**
     * Initializes view
     */
    viewInit: function ArmadillogTailing_viewInit() {
        DEBUG && console.log('ArmadillogTailing', 'viewInit', arguments);

        this.scrollEl = this.config.scrollEl;

        return true;
    },

    /**
     * Initializes UI
     */
    uiInit: function ArmadillogTailing_uiInit() {
        DEBUG && console.log('ArmadillogTailing', 'uiInit', arguments);

        window.addEventListener(
            'load',
            function ArmadillogTailing_uiInit_windowLoadHandler(evt) {
                this.check();
            }.bind(this),
            false);

        this.scrollEl.addEventListener(
            'scroll',
            function ArmadillogTailing_uiInit_scrollElScrollHandler(evt) {
                this.check();

                evt.preventDefault();
                evt.stopPropagation();
            }.bind(this),
            false);

        return true;
    },

    /**
     * Checks whether to do tailing
     */
    check: function ArmadillogTailing_check() {
        DEBUG && console.log('ArmadillogTailing', 'check', arguments);

        if (this.scrollEl === window) {
            this.tailing = window.scrollY >= window.scrollMaxY
        }
        else {
            this.tailing = this.scrollEl.scrollTop + this.scrollEl.offsetHeight >= this.scrollEl.scrollHeight;
        }

        return true;
    },

    /**
     * Executes tailing
     */
    execute: function ArmadillogTailing_execute() {
        DEBUG && console.log('ArmadillogTailing', 'execute', arguments);

        if (this.tailing) {
            if (this.scrollEl === window) {
                window.scrollTo(window.scrollX, window.scrollMaxY);
            }
            else {
                this.scrollEl.scrollTop = this.scrollEl.scrollHeight - this.scrollEl.offsetHeight;
            }
        }

        return true;
    },

    /**
     * Stops tailing
     */
    stop: function ArmadillogTailing_stop() {
        DEBUG && console.log('ArmadillogTailing', 'stop', arguments);

        this.tailing = false;

        return true;
    },

    /**
     *
     */
    toString: function ArmadillogTailing_toString() {
        return 'ennovum.ArmadillogTailing';
    }

};

/* ==================================================================================================== */
        return {
            'armadillogTailingStatic': armadillogTailingStatic,
            'armadillogTailingInterface': armadillogTailingInterface,
            'ArmadillogTailing': ArmadillogTailing
        };
    });
