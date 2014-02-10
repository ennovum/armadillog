'use strict';

define(
    [
        'ennovum.environment',
        'ennovum.dom',
        'ennovum.View',
        'text!./../templates/input.tpl'
    ],
    function (
        environment,
        dom,
        View,
        inputTpl
    ) {
        //
        var inputView = new View(inputTpl);

        /**
         * Returns input view
         *
         * @param {object} context context object
         */
        var inputCreate = function ArmadillogInputView_inputCreate(context) {
            return inputView.create(context);
        };

        //
        return {
            inputCreate: inputCreate
        };
    });
