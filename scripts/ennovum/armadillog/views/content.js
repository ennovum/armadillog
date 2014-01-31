'use strict';

define(
    [
        'ennovum.environment',
        'ennovum.dom',
        'ennovum.utils',
        'Handlebars',
        'text!./../templates/content.html-template',
        'text!./../templates/content-line-item.html-template'
    ],
    function (
        environment,
        dom,
        utils,
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
             */
            var init = function ArmadillogContentView_init() {
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
                var containerEl = dom.createElement('div');
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
                var containerEl = dom.createElement('div');
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
        };

        //
        return ArmadillogContentView;
    });
