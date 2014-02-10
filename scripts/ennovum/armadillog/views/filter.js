'use strict';

define(
    [
        'ennovum.environment',
        'ennovum.dom',
        'ennovum.View',
        'text!./../templates/filter.tpl',
        'text!./../templates/filter-item.tpl'
    ],
    function (
        environment,
        dom,
        View,
        filterTpl,
        filterItemTpl
    ) {
        //
        var filterView = new View(filterTpl);
        var filterItemView = new View(filterItemTpl);

        /**
         * Returns filter view
         *
         * @param {object} context context object
         */
        var filterCreate = function ArmadillogFilterView_filterCreate(context) {
            return filterView.create(context);
        };

        /**
         * Returns filter item view
         *
         * @param {object} context context object
         */
        var filterItemCreate = function ArmadillogFilterView_filterItemCreate(context) {
            var filterItemEls = filterItemView.create(context);

            highlightTypeChangeBind(filterItemEls.highlightTypeListSelectEl);

            return filterItemEls;
        };

        /**
         *
         * @param {DOMElement} highlightTypeListSelectEl highlight type select element
         */
        var highlightTypeChangeBind = function ArmadillogFilterView_highlightTypeChangeBind(highlightTypeListSelectEl) {
            dom.handle(highlightTypeListSelectEl, 'change', false, false, false, highlightTypeChangeHandle, this, [highlightTypeListSelectEl]);

            /* hack for select not triggering change event when it's synchronically created and updated
               TODO get rid of it in some civilised manner */
            setTimeout(function () {dom.trigger(highlightTypeListSelectEl, 'change');}, 0);
        };

        /**
         *
         * @param {DOMElement} highlightTypeListSelectEl highlight type select element
         */
        var highlightTypeChangeHandle = function ArmadillogFilterView_highlightTypeChangeHandle(highlightTypeListSelectEl) {
            var selectedClass = highlightTypeListSelectEl.getAttribute('selected-class') || '';
            dom.classRemove(highlightTypeListSelectEl, selectedClass);

            selectedClass = highlightTypeListSelectEl.options[highlightTypeListSelectEl.selectedIndex].getAttribute('selected-class') || '';
            highlightTypeListSelectEl.setAttribute('selected-class', selectedClass);
            dom.classAdd(highlightTypeListSelectEl, selectedClass);
        };

        //
        return {
            filterCreate: filterCreate,
            filterItemCreate: filterItemCreate
        };
    });
