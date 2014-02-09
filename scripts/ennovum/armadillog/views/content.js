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
            var itc = {
                contentView: new View(contentTpl),
                contentLineItemView: new View(contentLineItemTpl)
            };

            this.contentCreate = contentCreate.bind(this, itc);
            this.contentLineItemCreate = contentLineItemCreate.bind(this, itc);

            return this;
        };

        /**
         * Returns content view
         *
         * @param {object} context context object
         */
        var contentCreate = function ArmadillogContentView_contentCreate(itc, context) {
            return itc.contentView.create(context);
        };

        /**
         * Returns content line view
         *
         * @param {object} context context object
         */
        var contentLineItemCreate = function ArmadillogContentView_contentLineItemCreate(itc, context) {
            return itc.contentLineItemView.create(context);
        };

        //
        return ArmadillogContentView;
    });
