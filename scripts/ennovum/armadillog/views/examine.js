'use strict';

define(
    [
        'ennovum.environment',
        'ennovum.dom',
        'ennovum.utils',
        'Handlebars',
        'text!./../templates/examine.html-template'
    ],
    function (
        environment,
        dom,
        utils,
        Handlebars,
        templateExamine
    ) {
        /**
         * ArmadillogView constructor
         */
        var ArmadillogExamineView = function ArmadillogExamineView() {
            var examineViewTemplate;

            /**
             * Initializes instance
             */
            var init = function ArmadillogView_init() {
                examineViewTemplate = Handlebars.compile(templateExamine);

                return true;
            };

            /**
             * Returns examine view
             *
             * @param {object} context context object
             */
            var examineViewGet = this.examineViewGet = function ArmadillogView_examineViewGet(context) {
                var containerEl = dom.createElement('div');
                containerEl.innerHTML = examineViewTemplate(context);

                return {
                    'rawBoxEl': containerEl.querySelector('.examine-raw-box'),
                    'rawContentEl': containerEl.querySelector('.examine-raw-content'),
                    'filteredBoxEl': containerEl.querySelector('.examine-filtered-box'),
                    'filteredContentEl': containerEl.querySelector('.examine-filtered-content')
                };
            };

            /**
             *
             */
            var toString = this.toString = function ArmadillogView_toString() {
                return 'ennovum.ArmadillogView';
            };

            //
            init.apply(this, arguments);
            // utils.debug.spy(this);
        };

        //
        return ArmadillogExamineView;
    });
