'use strict';

window.define && define(
    [
        'ennovum.Environment',
        'ennovum.Utils',
        './components/busy',
        './components/content',
        './components/examine',
        './components/input',
        './components/filter',
        './components/tailing'
    ],
    function (
        mEnvironment,
        mUtils,
        mArmadillogBusy,
        mArmadillogContent,
        mArmadillogExamine,
        mArmadillogInput,
        mArmadillogFilter,
        mArmadillogTailing
    ) {
/* ==================================================================================================== */

// debug console logs switch
var DEBUG = false;

/**
 * Armadillog static
 */
var armadillogStatic = {
};

/**
 * Armadillog interface
 */
var armadillogInterface = {
    contentClear: function () {},
    contentTextSet: function (text) {}
};

/**
 * Armadillog constructor
 */
var Armadillog = function Armadillog() {
    this.init.apply(this, arguments);
    return mUtils.obj.implement({}, this, armadillogInterface);
};

/**
 * Armadillog prototype
 */
Armadillog.prototype = {

    /**
     * Initializes instance
     *
     * @param {object} config configuration object
     */
    init: function Armadillog_init(config) {
        DEBUG && console.log('Armadillog', 'init', arguments);

        switch (true) {
            case !this.browserCheck():
            case !this.applicationInit(config):
                return false;
                break;
        }

        return true;
    },

    /**
     *
     */
    browserCheck: function Armadillog_browserCheck() {
        DEBUG && console.log('Armadillog', 'browserCheck', arguments);

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
    },

    /**
     * Initializes data
     */
    applicationInit: function Armadillog_applicationInit(config) {
        DEBUG && console.log('Armadillog', 'applicationInit', arguments);

        var application = this.application = {};

        application.inputStatic = mArmadillogInput.armadillogInputStatic;
        application.contentStatic = mArmadillogContent.armadillogContentStatic;
        application.tailingStatic = mArmadillogTailing.armadillogTailingStatic;
        application.filterStatic = mArmadillogFilter.armadillogFilterStatic;
        application.examineStatic = mArmadillogExamine.armadillogExamineStatic;
        application.busyStatic = mArmadillogBusy.armadillogBusyStatic;

        application.input = new mArmadillogInput.ArmadillogInput(config, application);
        application.content = new mArmadillogContent.ArmadillogContent(config, application);
        application.tailing = new mArmadillogTailing.ArmadillogTailing(config, application);
        application.filter = new mArmadillogFilter.ArmadillogFilter(config, application);
        application.examine = new mArmadillogExamine.ArmadillogExamine(config, application);
        application.busy = new mArmadillogBusy.ArmadillogBusy(config, application);

        return true;
    },

    /**
     * Clears content
     */
    contentClear: function Armadillog_contentClear() {
        DEBUG && console.log('Armadillog', 'contentClear', arguments);

        this.application.content.clear();

        return true;
    },

    /**
     * Sets a piece of source
     *
     * @param {string} text a piece of source text
     */
    contentTextSet: function Armadillog_contentTextSet(text, label) {
        DEBUG && console.log('Armadillog', 'contentTextSet', arguments);

        this.application.content.textSet(text, label);

        return true;
    },

    /**
     *
     */
    toString: function Armadillog_toString() {
        return 'ennovum.Armadillog';
    }

};

/* ==================================================================================================== */
        return {
            'armadillogStatic': armadillogStatic,
            'armadillogInterface': armadillogInterface,
            'Armadillog': Armadillog
        };
    });
