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
    // mUtils.debug.spy(this);
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
        var containerEl = mUtils.dom.createElement('div');
        containerEl.innerHTML = this.filterItemViewTemplate(context);

        var highlightTypeListSelectEl = containerEl.querySelector('.filter-highlight-type-select');
        highlightTypeListSelectEl.addEventListener('change', this.highlightTypeChangeHandle);

        /* hack for select not triggering change event when it's synchronically created and updated
           TODO get rid of it in some civilised manner */
        setTimeout(function () {mUtils.dom.triggerEvent(highlightTypeListSelectEl, 'change');}.bind(this), 0);

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
            'affectTypeListSelectEl': containerEl.querySelector('.filter-affect-type-select'),
            'valueBoxEl': containerEl.querySelector('.filter-value-box'),
            'valueInputEl': containerEl.querySelector('.filter-value-input'),
            'valueTypeListEl': containerEl.querySelector('.filter-value-type-list'),
            'valueTypeListSelectEl': containerEl.querySelector('.filter-value-type-select'),
            'highlightTypeListEl': containerEl.querySelector('.filter-highlight-type-list'),
            'highlightTypeListSelectEl': containerEl.querySelector('.filter-highlight-type-select')
        };
    },

    /**
     *
     * @param {DOMElement} highlightTypeListSelectEl highlight type select element
     */
    highlightTypeChangeHandle: function ArmadillogFilterView_highlightTypeChangeHandle(evt) {
        var highlightTypeListSelectEl = evt.target;

        var selectedClass = highlightTypeListSelectEl.getAttribute('selected-class') || '';
        mUtils.dom.classRemove(highlightTypeListSelectEl, selectedClass);

        selectedClass = highlightTypeListSelectEl.options[highlightTypeListSelectEl.selectedIndex].getAttribute('selected-class') || ''
        highlightTypeListSelectEl.setAttribute('selected-class', selectedClass);
        mUtils.dom.classAdd(highlightTypeListSelectEl, selectedClass);
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
