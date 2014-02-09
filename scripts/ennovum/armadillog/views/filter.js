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
            var itc = {
                filterView: new View(filterTpl),
                filterItemView: new View(filterItemTpl)
            };

            this.filterCreate = filterCreate.bind(this, itc);
            this.filterItemCreate = filterItemCreate.bind(this, itc);

            this.toString = toString.bind(this, itc);

            return this;
        };

        /**
         * Returns filter view
         *
         * @param {object} context context object
         */
        var filterCreate = function ArmadillogFilterView_filterCreate(itc, context) {
            return itc.filterView.create(context);
        };

        /**
         * Returns filter item view
         *
         * @param {object} context context object
         */
        var filterItemCreate = function ArmadillogFilterView_filterItemCreate(itc, context) {
            var filterItemEls = itc.filterItemView.create(context);

            highlightTypeChangeBind(itc, filterItemEls.highlightTypeListSelectEl);

            return filterItemEls;
        };

        /**
         *
         * @param {DOMElement} highlightTypeListSelectEl highlight type select element
         */
        var highlightTypeChangeBind = function ArmadillogFilterView_highlightTypeChangeBind(itc, highlightTypeListSelectEl) {
            dom.handle(highlightTypeListSelectEl, 'change', highlightTypeChangeHandle, false, false, false, this, [itc, highlightTypeListSelectEl]);

            /* hack for select not triggering change event when it's synchronically created and updated
               TODO get rid of it in some civilised manner */
            setTimeout(function () {dom.trigger(highlightTypeListSelectEl, 'change');}, 0);
        };

        /**
         *
         * @param {DOMElement} highlightTypeListSelectEl highlight type select element
         */
        var highlightTypeChangeHandle = function ArmadillogFilterView_highlightTypeChangeHandle(itc, highlightTypeListSelectEl) {
            var selectedClass = highlightTypeListSelectEl.getAttribute('selected-class') || '';
            dom.classRemove(highlightTypeListSelectEl, selectedClass);

            selectedClass = highlightTypeListSelectEl.options[highlightTypeListSelectEl.selectedIndex].getAttribute('selected-class') || '';
            highlightTypeListSelectEl.setAttribute('selected-class', selectedClass);
            dom.classAdd(highlightTypeListSelectEl, selectedClass);
        };

        /**
         *
         */
        var toString = function ArmadillogFilterView_toString() {
            return 'ennovum.ArmadillogFilterView';
        };

        //
        return ArmadillogFilterView;
    });
