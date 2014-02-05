'use strict';

define(
    [
        'ennovum.environment',
        'ennovum.dom',
        'ennovum.View',
        'text!./../templates/content.tpl',
        'text!./../templates/content-line-item.tpl'
    ],
    function (
        environment,
        dom,
        View,
        contentTpl,
        contentLineItemTpl
    ) {
        /**
         * ArmadillogContentView constructor
         */
        var ArmadillogContentView = function ArmadillogContentView() {
            var contentView;
            var contentLineItemView;

            /**
             * Initializes instance
             */
            var init = function ArmadillogContentView_init() {
                contentView = new View(contentTpl);
                contentLineItemView = new View(contentLineItemTpl);

                return true;
            };

            /**
             * Returns content view
             *
             * @param {object} context context object
             */
            var contentCreate = this.contentCreate = function ArmadillogContentView_contentCreate(context) {
                return contentView.create(context);
            };

            /**
             * Returns content line view
             *
             * @param {object} context context object
             */
            var contentLineItemCreate = this.contentLineItemCreate = function ArmadillogContentView_contentLineItemCreate(context) {
                return contentLineItemView.create(context);
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
