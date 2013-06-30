'use strict';

window.define && define(
    [
        'ennovum.Environment',
        'ennovum.Utils',
        'Handlebars',
        'text!./../templates/filter.html-template',
        'text!./../templates/filter-item.html-template'
    ],
    function (
        mEnvironment,
        mUtils,
        Handlebars,
        templateFilter,
        templateFilterItem
    ) {
/* ==================================================================================================== */

// debug console logs switch
var DEBUG = false;

/**
 * ArmadillogFilterView interface
 */
var iArmadillogFilterView = {
    filterViewGet: function (context) {},
    filterItemViewGet: function (context) {},
};

/**
 * ArmadillogFilterView constructor
 */
var ArmadillogFilterView = function ArmadillogFilterView() {
    this.init.apply(this, arguments);
    return mUtils.obj.implement({}, this, iArmadillogFilterView);
};

/**
 * ArmadillogFilterView prototype
 */
ArmadillogFilterView.prototype = {

    /**
     * Initializes instance
     *
     * @param {object} config configuration object
     */
    init: function ArmadillogFilterView_init(config) {
        DEBUG && console.log('ArmadillogFilterView', 'init', arguments);

        this.filterViewTemplate = Handlebars.compile(templateFilter);
        this.filterItemViewTemplate = Handlebars.compile(templateFilterItem);

        return true;
    },

    /**
     * Returns filter view
     *
     * @param {object} context context object
     */
    filterViewGet: function ArmadillogFilterView_filterViewGet(context) {
        DEBUG && console.log('ArmadillogFilterView', 'filterViewGet', arguments);

        var containerEl = mUtils.dom.createElement('div');
        containerEl.innerHTML = this.filterViewTemplate(context);

        return {
            'listEl': containerEl.querySelector('.filter-list'),
            'buttonBoxEl': containerEl.querySelector('.filter-button-box'),
            'clearButtonEl': containerEl.querySelector('.filter-button-clear'),
            'addButtonEl': containerEl.querySelector('.filter-button-add'),
            'submitButtonEl': containerEl.querySelector('.filter-button-submit'),
        };
    },

    /**
     * Returns filter item view
     *
     * @param {object} context context object
     */
    filterItemViewGet: function ArmadillogFilterView_filterItemViewGet(context) {
        DEBUG && console.log('ArmadillogFilterView', 'filterItemViewGet', arguments);

        var containerEl = mUtils.dom.createElement('div');
        containerEl.innerHTML = this.filterItemViewTemplate(context);

        var filterItemAffectTypeList = [];
        for (var i = 0, l = context.filterAffectTypes.length; i < l; i++) {
            filterItemAffectTypeList.push({
                'el': containerEl.querySelectorAll('.filter-affect-type-item')[i],
                'radioEl': containerEl.querySelectorAll('.filter-affect-type-radio')[i],
                'labelEl': containerEl.querySelectorAll('.filter-affect-type-label')[i],
            });
        }

        var filterItemValueTypeList = [];
        for (var i = 0, l = context.filterValueTypes.length; i < l; i++) {
            filterItemValueTypeList.push({
                'el': containerEl.querySelectorAll('.filter-value-type-item')[i],
                'radioEl': containerEl.querySelectorAll('.filter-value-type-radio')[i],
                'labelEl': containerEl.querySelectorAll('.filter-value-type-label')[i],
            });
        }

        var filterItemHighlightTypeList = [];
        for (var i = 0, l = context.filterHighlightTypes.length; i < l; i++) {
            filterItemHighlightTypeList.push({
                'el': containerEl.querySelectorAll('.filter-highlight-type-item')[i],
                'radioEl': containerEl.querySelectorAll('.filter-highlight-type-radio')[i],
                'labelEl': containerEl.querySelectorAll('.filter-highlight-type-label')[i],
            });
        }

        return {
            'el': containerEl.querySelector('.filter-item'),
            'headerEl': containerEl.querySelector('.filter-header'),
            'titleEl': containerEl.querySelector('.filter-title'),
            'muteEl': containerEl.querySelector('.filter-mute'),
            'muteCheckboxEl': containerEl.querySelector('.filter-mute-checkbox'),
            'muteLabelEl': containerEl.querySelector('.filter-mute-label'),
            'moveUpEl': containerEl.querySelector('.filter-move-up'),
            'moveDownEl': containerEl.querySelector('.filter-move-down'),
            'removeEl': containerEl.querySelector('.filter-remove'),
            'affectTypeListEl': containerEl.querySelector('.filter-affect-type-list'),
            'affectTypeList': filterItemAffectTypeList,
            'valueBoxEl': containerEl.querySelector('.filter-value-box'),
            'valueInputEl': containerEl.querySelector('.filter-value-input'),
            'valueTypeListEl': containerEl.querySelector('.filter-value-type-list'),
            'valueTypeList': filterItemValueTypeList,
            'highlightTypeListEl': containerEl.querySelector('.filter-highlight-type-list'),
            'highlightTypeList': filterItemHighlightTypeList
        };
    },

    /**
     *
     */
    toString: function ArmadillogFilterView_toString() {
        return 'ennovum.ArmadillogFilterView';
    }

};

/* ==================================================================================================== */
        return {
            'ArmadillogFilterView': ArmadillogFilterView,
            'iArmadillogFilterView': iArmadillogFilterView
        };
    });
