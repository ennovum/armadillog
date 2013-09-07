'use strict';

window.define && define(
    [
        'ennovum.Environment',
        'ennovum.Utils',
        'Handlebars',
        'text!./../templates/content.html-template',
        'text!./../templates/content-line-item.html-template'
    ],
    function (
        mEnvironment,
        mUtils,
        Handlebars,
        templateContent,
        templateContentLineItem
    ) {
/* ==================================================================================================== */

/**
 * ArmadillogContentView interface
 */
var iArmadillogContentView = {
    contentViewGet: function (context) {},
    contentLineItemViewGet: function (context) {}
};

/**
 * ArmadillogContentView constructor
 */
var ArmadillogContentView = function ArmadillogContentView() {
    this.init.apply(this, arguments);
    // mUtils.debug.spy(this);
    return mUtils.obj.implement({}, this, iArmadillogContentView);
};

/**
 * ArmadillogContentView prototype
 */
ArmadillogContentView.prototype = {

    /**
     * Initializes instance
     *
     * @param {object} config configuration object
     */
    init: function ArmadillogContentView_init(config) {
        this.contentViewTemplate = Handlebars.compile(templateContent);
        this.contentLineItemViewTemplate = Handlebars.compile(templateContentLineItem);

        return true;
    },

    /**
     * Returns content view
     *
     * @param {object} context context object
     */
    contentViewGet: function ArmadillogContentView_contentViewGet(context) {
        var containerEl = mUtils.dom.createElement('div');
        containerEl.innerHTML = this.contentViewTemplate(context);

        return {
            'frameEl': containerEl.querySelector('.content-frame'),
            'lineListEl': containerEl.querySelector('.content-line-list')
        };
    },

    /**
     * Returns content line view
     *
     * @param {object} context context object
     */
    contentLineItemViewGet: function ArmadillogContentView_contentLineItemViewGet(context) {
        var containerEl = mUtils.dom.createElement('div');
        containerEl.innerHTML = this.contentLineItemViewTemplate(context);

        return {
            'el': containerEl.querySelector('.content-line-item')
        };
    },

    /**
     *
     */
    toString: function ArmadillogContentView_toString() {
        return 'ennovum.ArmadillogContentView';
    }

};

/* ==================================================================================================== */
        return {
            'ArmadillogContentView': ArmadillogContentView,
            'iArmadillogContentView': iArmadillogContentView
        };
    });
