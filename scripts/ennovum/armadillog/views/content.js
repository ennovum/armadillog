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
        //
        var contentView = new View(contentTpl);
        var contentLineItemView = new View(contentLineItemTpl);

        /**
         * Returns content view
         *
         * @param {object} context context object
         */
        var contentCreate = function ArmadillogContentView_contentCreate(context) {
            return contentView.create(context);
        };

        /**
         * Returns content line view
         *
         * @param {object} context context object
         */
        var contentLineItemCreate = function ArmadillogContentView_contentLineItemCreate(context) {
            return contentLineItemView.create(context);
        };

        //
        return {
            contentCreate: contentCreate,
            contentLineItemCreate: contentLineItemCreate
        };
    });
