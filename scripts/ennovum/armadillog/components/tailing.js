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

/**
 * ArmadillogTailing static
 */
var armadillogTailingStatic = {
};

/**
 * ArmadillogTailing interface
 */
var armadillogTailingInterface = {
    launch: function () {}
};

/**
 * ArmadillogTailing constructor
 */
var ArmadillogTailing = function ArmadillogTailing() {
    this.init.apply(this, arguments);
    // mUtils.debug.spy(this);
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
    configSet: function ArmadillogTailing_configSet(config) {
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
        this.application = application;

        this.tailing = false;

        return true;
    },

    /**
     * Initializes view
     */
    viewInit: function ArmadillogTailing_viewInit() {
        this.scrollEl = this.config.scrollEl;

        return true;
    },

    /**
     * Launches component
     */
    launch: function ArmadillogTailing_launch() {
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
    uiInit: function ArmadillogTailing_uiInit() {
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

        this.application.content.on(
            'view-change',
            function ArmadillogTailing_uiInit_applicationContentViewChangeHandler(evt) {
                this.execute();
            }.bind(this),
            false);

        return true;
    },

    /**
     * Checks whether to do tailing
     */
    check: function ArmadillogTailing_check() {
        if (this.scrollEl === window) {
            this.tailing = window.scrollY >= window.scrollMaxY
        }
        else {
            this.tailing = this.scrollEl.scrollTop > 0 && this.scrollEl.scrollTop + this.scrollEl.offsetHeight >= this.scrollEl.scrollHeight;
        }

        return true;
    },

    /**
     * Executes tailing
     */
    execute: function ArmadillogTailing_execute() {
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
