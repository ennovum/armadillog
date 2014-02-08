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
            var itc = {
                examineView: new View(examineTpl)
            };

            this.examineCreate = examineCreate.bind(this, itc);

            this.toString = toString.bind(this, itc);

            return this;
        };

        /**
         * Returns examine view
         *
         * @param {object} context context object
         */
        var examineCreate = function ArmadillogView_examineCreate(itc, context) {
            return itc.examineView.create(context);
        };

        /**
         *
         */
        var toString = function ArmadillogView_toString(itc) {
            return 'ennovum.ArmadillogView';
        };

        //
        return ArmadillogExamineView;
    });
