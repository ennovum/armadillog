'use strict';

window.define && define(
    [
        'ennovum.Environment',
        'ennovum.Utils',
        'Handlebars',
        'text!./../templates/input.html-template'
    ],
    function (
        mEnvironment,
        mUtils,
        Handlebars,
        templateInput
    ) {
/* ==================================================================================================== */

// debug console logs switch
var DEBUG = false;

/**
 * ArmadillogInputView interface
 */
var iArmadillogInputView = {
    inputViewGet: function (context) {}
};

/**
 * ArmadillogInputView constructor
 */
var ArmadillogInputView = function ArmadillogInputView() {
    this.init.apply(this, arguments);
    return mUtils.obj.implement({}, this, iArmadillogInputView);
};

/**
 * ArmadillogInputView prototype
 */
ArmadillogInputView.prototype = {

    /**
     * Initializes instance
     *
     * @param {object} config configuration object
     */
    init: function ArmadillogInputView_init(config) {
        DEBUG && console.log('ArmadillogInputView', 'init', arguments);

        this.inputViewTemplate = Handlebars.compile(templateInput);

        return true;
    },

    /**
     * Returns input view
     *
     * @param {object} context context object
     */
    inputViewGet: function ArmadillogInputView_inputViewGet(context) {
        DEBUG && console.log('ArmadillogInputView', 'inputViewGet', arguments);

        var containerEl = mUtils.dom.createElement('div');
        containerEl.innerHTML = this.inputViewTemplate(context);

        return {
            'clearBoxEl': containerEl.querySelector('.input-clear-box'),
            'clearLabelEl': containerEl.querySelector('.input-clear-label'),
            'clearButtonEl': containerEl.querySelector('.input-clear-button'),
            'fileBoxEl': containerEl.querySelector('.input-file-box'),
            'fileInputEl': containerEl.querySelector('.input-file-input'),
            'fileButtonEl': containerEl.querySelector('.input-file-button'),
            'pasteBoxEl': containerEl.querySelector('.input-paste-box'),
            'pasteInputEl': containerEl.querySelector('.input-paste-input'),
            'pasteButtonEl': containerEl.querySelector('.input-paste-button'),
            'urlBoxEl': containerEl.querySelector('.input-url-box'),
            'urlInputEl': containerEl.querySelector('.input-url-input'),
            'urlButtonEl': containerEl.querySelector('.input-url-button')
        };
    },

    /**
     *
     */
    toString: function ArmadillogInputView_toString() {
        return 'ennovum.ArmadillogInputView';
    }

};

/* ==================================================================================================== */
        return {
            'ArmadillogInputView': ArmadillogInputView,
            'iArmadillogInputView': iArmadillogInputView
        };
    });
