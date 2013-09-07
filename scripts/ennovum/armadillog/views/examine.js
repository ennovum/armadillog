'use strict';

window.define && define(
    [
        'ennovum.Environment',
        'ennovum.Utils',
        'Handlebars',
        'text!./../templates/examine.html-template'
    ],
    function (
        mEnvironment,
        mUtils,
        Handlebars,
        templateExamine
    ) {
/* ==================================================================================================== */

/**
 * ArmadillogView interface
 */
var iArmadillogExamineView = {
    examineViewGet: function (context) {}
};

/**
 * ArmadillogView constructor
 */
var ArmadillogExamineView = function ArmadillogExamineView() {
    this.init.apply(this, arguments);
    // mUtils.debug.spy(this);
    return mUtils.obj.implement({}, this, iArmadillogExamineView);
};

/**
 * ArmadillogView prototype
 */
ArmadillogExamineView.prototype = {

    /**
     * Initializes instance
     *
     * @param {object} config configuration object
     */
    init: function ArmadillogView_init(config) {
        this.examineViewTemplate = Handlebars.compile(templateExamine);

        return true;
    },

    /**
     * Returns examine view
     *
     * @param {object} context context object
     */
    examineViewGet: function ArmadillogView_examineViewGet(context) {
        var containerEl = mUtils.dom.createElement('div');
        containerEl.innerHTML = this.examineViewTemplate(context);

        return {
            'rawBoxEl': containerEl.querySelector('.examine-raw-box'),
            'rawContentEl': containerEl.querySelector('.examine-raw-content'),
            'filteredBoxEl': containerEl.querySelector('.examine-filtered-box'),
            'filteredContentEl': containerEl.querySelector('.examine-filtered-content')
        };
    },

    /**
     *
     */
    toString: function ArmadillogView_toString() {
        return 'ennovum.ArmadillogView';
    }

};

/* ==================================================================================================== */
        return {
            'ArmadillogExamineView': ArmadillogExamineView,
            'iArmadillogExamineView': iArmadillogExamineView
        };
    });
