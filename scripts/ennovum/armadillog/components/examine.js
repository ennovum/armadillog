'use strict';

define(
    [
        'ennovum.environment',
        'ennovum.dom',
        'ennovum.utils',
        './../views/examine'
    ],
    function (
        environment,
        dom,
        utils,
        ArmadillogExamineView
    ) {
        /**
         * ArmadillogExamine constructor
         */
        var ArmadillogExamine = function ArmadillogExamine() {
            var config;
            var application;

            var bodyEl;
            var boxEl;
            var view;
            var examineEls;

            /**
             * Initializes instance
             *
             * @param {object} argConfig configuration object
             */
            var init = function ArmadillogExamine_init(argConfig, argApplication) {
                switch (true) {
                    case !configSet(argConfig):
                    case !dataInit(argApplication):
                    case !viewInit():
                    case !uiInit():
                        return false;
                        break;
                }

                return true;
            };

            /**
             * Initializes config
             *
             * @param {object} argConfig configuration object
             */
            var configSet = function ArmadillogExamine_configSet(argConfig) {
                switch (false) {
                    case !!argConfig:
                    case typeof argConfig === 'object':
                        console.error('ArmadillogExamine', 'configSet', 'invalid input');
                        return false;
                };

                config = {
                    boxEl: argConfig.examineBoxEl || null
                };

                return true;
            };

            /**
             * Initializes data
             */
            var dataInit = function ArmadillogExamine_dataInit(argApplication) {
                application = argApplication;

                return true;
            };

            /**
             * Initializes view
             */
            var viewInit = function ArmadillogExamine_viewInit() {
                bodyEl = config.bodyEl;

                boxEl = config.boxEl;
                if (!boxEl) {
                    console.error('ArmadillogExamine', 'viewInit', 'invalid boxEl');
                    return false;
                };

                view = new ArmadillogExamineView();

                examineEls = view.examineCreate();
                boxEl.appendChild(examineEls.rawBoxEl);
                boxEl.appendChild(examineEls.filteredBoxEl);

                return true;
            };

            /**
             * Initializes UI
             */
            var uiInit = function ArmadillogExamine_uiInit() {
                dom.handle(
                    examineEls.rawContentEl, 'keyup',
                    function (evt) {
                        if (!(evt.keyCode === 27 && !evt.ctrlKey && !evt.altKey && !evt.shiftKey)) { // esc
                            evt.stopPropagation();
                        }
                    },
                    false, false, false, this);

                dom.handle(
                    examineEls.filteredContentEl, 'keyup',
                    function (evt) {
                        if (!(evt.keyCode === 27 && !evt.ctrlKey && !evt.altKey && !evt.shiftKey)) { // esc
                            evt.stopPropagation();
                        }
                    },
                    false, false, false, this);

                return true;
            };

            /**
             * Sets examine content
             *
             * @param {object} contentLineItemMMap content line model object
             */
            var set = this.set = function ArmadillogExamine_set(contentLineItemMMap) {
                examineEls.rawContentEl.innerHTML = utils.string.escapeXML(contentLineItemMMap.get('textRaw'));
                examineEls.filteredContentEl.innerHTML = contentLineItemMMap.get('els').el.innerHTML;

                return true;
            };

            /**
             * Clears examine content
             */
            var clear = this.clear = function ArmadillogExamine_clear() {
                examineEls.rawContentEl.innerHTML = '';
                examineEls.filteredContentEl.innerHTML = '';

                return true;
            };

            /**
             *
             */
            var toString = this.toString = function ArmadillogExamine_toString() {
                return 'ennovum.ArmadillogExamine';
            };

            //
            init.apply(this, arguments);
        };

        //
        return ArmadillogExamine;
    });
