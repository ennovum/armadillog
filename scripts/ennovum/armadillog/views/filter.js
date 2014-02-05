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
        /**
         * ArmadillogFilterView constructor
         */
        var ArmadillogFilterView = function ArmadillogFilterView() {
            var filterView;
            var filterItemView;

            /**
             * Initializes instance
             */
            var init = function ArmadillogFilterView_init() {
                filterView = new View(filterTpl);
                filterItemView = new View(filterItemTpl);

                return true;
            };

            /**
             * Returns filter view
             *
             * @param {object} context context object
             */
            var filterCreate = this.filterCreate = function ArmadillogFilterView_filterCreate(context) {
                return filterView.create(context);
            };

            /**
             * Returns filter item view
             *
             * @param {object} context context object
             */
            var filterItemCreate = this.filterItemCreate = function ArmadillogFilterView_filterItemCreate(context) {
                var filterItemEls = filterItemView.create(context);

                highlightTypeChangeBind(filterItemEls.highlightTypeListSelectEl);

                return filterItemEls;
            };

            /**
             *
             * @param {DOMElement} highlightTypeListSelectEl highlight type select element
             */
            var highlightTypeChangeBind = function ArmadillogFilterView_highlightTypeChangeBind(highlightTypeListSelectEl) {
                dom.handle(highlightTypeListSelectEl, 'change', highlightTypeChangeHandle.bind(this, highlightTypeListSelectEl), false, false, false, this);

                /* hack for select not triggering change event when it's synchronically created and updated
                   TODO get rid of it in some civilised manner */
                setTimeout(function () {dom.triggerEvent(highlightTypeListSelectEl, 'change');}, 0);
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

            /**
             *
             */
            var toString = this.toString = function ArmadillogFilterView_toString() {
                return 'ennovum.ArmadillogFilterView';
            };

            //
            init.apply(this, arguments);
        };

        //
        return ArmadillogFilterView;
    });
