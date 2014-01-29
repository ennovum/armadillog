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
        /**
         * ArmadillogContentView constructor
         */
        var ArmadillogContentView = function ArmadillogContentView() {
            var contentViewTemplate;
            var contentLineItemViewTemplate;

            /**
             * Initializes instance
             *
             * @param {object} config configuration object
             */
            var init = function ArmadillogContentView_init(config) {
                contentViewTemplate = Handlebars.compile(templateContent);
                contentLineItemViewTemplate = Handlebars.compile(templateContentLineItem);

                return true;
            };

            /**
             * Returns content view
             *
             * @param {object} context context object
             */
            var contentViewGet = this.contentViewGet = function ArmadillogContentView_contentViewGet(context) {
                var containerEl = mUtils.dom.createElement('div');
                containerEl.innerHTML = contentViewTemplate(context);

                return {
                    'frameEl': containerEl.querySelector('.content-frame'),
                    'lineListEl': containerEl.querySelector('.content-line-list')
                };
            };

            /**
             * Returns content line view
             *
             * @param {object} context context object
             */
            var contentLineItemViewGet = this.contentLineItemViewGet = function ArmadillogContentView_contentLineItemViewGet(context) {
                var containerEl = mUtils.dom.createElement('div');
                containerEl.innerHTML = contentLineItemViewTemplate(context);

                return {
                    'el': containerEl.querySelector('.content-line-item')
                };
            };

            /**
             *
             */
            var toString = this.toString = function ArmadillogContentView_toString() {
                return 'ennovum.ArmadillogContentView';
            };

            //
            init.apply(this, arguments);
            // mUtils.debug.spy(this);
        };

        //
        return {
            'ArmadillogContentView': ArmadillogContentView
        };
    });
