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
        /**
         * ArmadillogFilterView constructor
         */
        var ArmadillogFilterView = function ArmadillogFilterView() {
            var filterViewTemplate;
            var filterItemViewTemplate;

            /**
             * Initializes instance
             *
             * @param {object} config configuration object
             */
            var init = function ArmadillogFilterView_init(config) {
                filterViewTemplate = Handlebars.compile(templateFilter);
                filterItemViewTemplate = Handlebars.compile(templateFilterItem);

                return true;
            };

            /**
             * Returns filter view
             *
             * @param {object} context context object
             */
            var filterViewGet = this.filterViewGet = function ArmadillogFilterView_filterViewGet(context) {
                var containerEl = mUtils.dom.createElement('div');
                containerEl.innerHTML = filterViewTemplate(context);

                return {
                    'listEl': containerEl.querySelector('.filter-list'),
                    'buttonBoxEl': containerEl.querySelector('.filter-button-box'),
                    'clearButtonEl': containerEl.querySelector('.filter-button-clear'),
                    'createButtonEl': containerEl.querySelector('.filter-button-create'),
                    'submitButtonEl': containerEl.querySelector('.filter-button-submit'),
                };
            };

            /**
             * Returns filter item view
             *
             * @param {object} context context object
             */
            var filterItemViewGet = this.filterItemViewGet = function ArmadillogFilterView_filterItemViewGet(context) {
                var containerEl = mUtils.dom.createElement('div');
                containerEl.innerHTML = filterItemViewTemplate(context);

                var highlightTypeListSelectEl = containerEl.querySelector('.filter-highlight-type-select');
                highlightTypeListSelectEl.addEventListener('change', highlightTypeChangeHandle);

                /* hack for select not triggering change event when it's synchronically created and updated
                   TODO get rid of it in some civilised manner */
                setTimeout(function () {mUtils.dom.triggerEvent(highlightTypeListSelectEl, 'change');}, 0);

                return {
                    'el': containerEl.querySelector('.filter-item'),
                    'headerEl': containerEl.querySelector('.filter-header'),
                    'muteEl': containerEl.querySelector('.filter-mute'),
                    'unmuteEl': containerEl.querySelector('.filter-unmute'),
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
            };

            /**
             *
             * @param {DOMElement} highlightTypeListSelectEl highlight type select element
             */
            var highlightTypeChangeHandle = function ArmadillogFilterView_highlightTypeChangeHandle(evt) {
                var highlightTypeListSelectEl = evt.target;

                var selectedClass = highlightTypeListSelectEl.getAttribute('selected-class') || '';
                mUtils.dom.classRemove(highlightTypeListSelectEl, selectedClass);

                selectedClass = highlightTypeListSelectEl.options[highlightTypeListSelectEl.selectedIndex].getAttribute('selected-class') || ''
                highlightTypeListSelectEl.setAttribute('selected-class', selectedClass);
                mUtils.dom.classAdd(highlightTypeListSelectEl, selectedClass);
            };

            /**
             *
             */
            var toString = this.toString = function ArmadillogFilterView_toString() {
                return 'ennovum.ArmadillogFilterView';
            };

            //
            init.apply(this, arguments);
            // mUtils.debug.spy(this);
        };

        //
        return {
            'ArmadillogFilterView': ArmadillogFilterView
        };
    });
