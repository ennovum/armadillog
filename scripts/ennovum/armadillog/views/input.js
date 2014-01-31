'use strict';

define(
    [
        'ennovum.environment',
        'ennovum.dom',
        'ennovum.utils',
        'Handlebars',
        'text!./../templates/input.html-template'
    ],
    function (
        environment,
        dom,
        utils,
        Handlebars,
        templateInput
    ) {
        /**
         * ArmadillogInputView constructor
         */
        var ArmadillogInputView = function ArmadillogInputView() {
            var inputViewTemplate;

            /**
             * Initializes instance
             */
            var init =function ArmadillogInputView_init() {
                inputViewTemplate = Handlebars.compile(templateInput);

                return true;
            };

            /**
             * Returns input view
             *
             * @param {object} context context object
             */
            var inputViewGet = this.inputViewGet = function ArmadillogInputView_inputViewGet(context) {
                var containerEl = dom.createElement('div');
                containerEl.innerHTML = inputViewTemplate(context);

                return {
                    'clearBoxEl': containerEl.querySelector('.input-clear-box'),
                    'clearLabelEl': containerEl.querySelector('.input-clear-label'),
                    'clearButtonEl': containerEl.querySelector('.input-clear-button'),
                    'fileBoxEl': containerEl.querySelector('.input-file-box'),
                    'fileInputEl': containerEl.querySelector('.input-file-input'),
                    'fileButtonEl': containerEl.querySelector('.input-file-button'),
                    'pasteBoxEl': containerEl.querySelector('.input-paste-box'),
                    'pasteInputEl': containerEl.querySelector('.input-paste-input'),
                    'pasteButtonEl': containerEl.querySelector('.input-paste-button'),
                    'urlBoxEl': containerEl.querySelector('.input-url-box'),
                    'urlInputEl': containerEl.querySelector('.input-url-input'),
                    'urlButtonEl': containerEl.querySelector('.input-url-button')
                };
            };

            /**
             *
             */
            var toString = this.toString = function ArmadillogInputView_toString() {
                return 'ennovum.ArmadillogInputView';
            };

            //
            init.apply(this, arguments);
            // utils.debug.spy(this);
        };

        //
        return ArmadillogInputView;
    });
