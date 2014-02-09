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
        /**
         * ArmadillogInputView constructor
         */
        var ArmadillogInputView = function ArmadillogInputView() {
            var itc = {
                inputView: new View(inputTpl)
            };

            this.inputCreate = inputCreate.bind(this, itc);

            return this;
        };

        /**
         * Returns input view
         *
         * @param {object} context context object
         */
        var inputCreate = function ArmadillogInputView_inputCreate(itc, context) {
            return itc.inputView.create(context);
        };

        //
        return ArmadillogInputView;
    });
