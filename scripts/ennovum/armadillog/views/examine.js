'use strict';

define(
    [
        'ennovum.environment',
        'ennovum.dom',
        'ennovum.View',
        'text!./../templates/examine.tpl'
    ],
    function (
        environment,
        dom,
        View,
        examineTpl
    ) {
        //
        var examineView = new View(examineTpl);

        /**
         * Returns examine view
         *
         * @param {object} context context object
         */
        var examineCreate = function ArmadillogView_examineCreate(context) {
            return examineView.create(context);
        };

        //
        return {
            examineCreate: examineCreate
        };
    });
