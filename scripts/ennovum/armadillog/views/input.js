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
            var inputView;

            /**
             * Initializes instance
             */
            var init =function ArmadillogInputView_init() {
                inputView = new View(inputTpl);

                return true;
            };

            /**
             * Returns input view
             *
             * @param {object} context context object
             */
            var inputCreate = this.inputCreate = function ArmadillogInputView_inputCreate(context) {
                return inputView.create(context);
            };

            /**
             *
             */
            var toString = this.toString = function ArmadillogInputView_toString() {
                return 'ennovum.ArmadillogInputView';
            };

            //
            init.apply(this, arguments);
        };

        //
        return ArmadillogInputView;
    });
