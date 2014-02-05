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
        /**
         * ArmadillogView constructor
         */
        var ArmadillogExamineView = function ArmadillogExamineView() {
            var examineView;

            /**
             * Initializes instance
             */
            var init = function ArmadillogView_init() {
                examineView = new View(examineTpl);

                return true;
            };

            /**
             * Returns examine view
             *
             * @param {object} context context object
             */
            var examineCreate = this.examineCreate = function ArmadillogView_examineCreate(context) {
                return examineView.create(context);
            };

            /**
             *
             */
            var toString = this.toString = function ArmadillogView_toString() {
                return 'ennovum.ArmadillogView';
            };

            //
            init.apply(this, arguments);
        };

        //
        return ArmadillogExamineView;
    });
