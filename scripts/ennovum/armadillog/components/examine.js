'use strict';

window.define && define(
    [
        'ennovum.Environment',
        'ennovum.Utils',
        './../views/examine'
    ],
    function (
        mEnvironment,
        mUtils,
        mArmadillogExamineView
    ) {
        /**
         * ArmadillogExamine constructor
         */
        var ArmadillogExamine = function ArmadillogExamine() {
            var config;
            var application;

            var view;
            var bodyEl;
            var boxEl;
            var examineView;

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
                view = new mArmadillogExamineView.ArmadillogExamineView();

                bodyEl = config.bodyEl;

                boxEl = config.boxEl;
                if (!boxEl) {
                    console.error('ArmadillogExamine', 'viewInit', 'invalid boxEl');
                    return false;
                };

                examineView = view.examineViewGet();
                boxEl.appendChild(examineView.rawBoxEl);
                boxEl.appendChild(examineView.filteredBoxEl);

                return true;
            };

            /**
             * Launches component
             */
            var launch = this.launch =function ArmadillogExamine_launch() {
                switch (true) {
                    case !uiInit():
                        return false;
                        break;
                }

                return true;
            };

            /**
             * Initializes UI
             */
            var uiInit = function ArmadillogExamine_uiInit() {
                examineView.rawContentEl.addEventListener(
                    'keyup',
                    function (evt) {
                        if (!(evt.keyCode === 27 && !evt.ctrlKey && !evt.altKey && !evt.shiftKey)) { // esc
                            evt.stopPropagation();
                        }
                    });

                examineView.filteredContentEl.addEventListener(
                    'keyup',
                    function (evt) {
                        if (!(evt.keyCode === 27 && !evt.ctrlKey && !evt.altKey && !evt.shiftKey)) { // esc
                            evt.stopPropagation();
                        }
                    });

                return true;
            };

            /**
             * Sets examine content
             *
             * @param {object} contentLineItemMMap content line model object
             */
            var set = this.set = function ArmadillogExamine_set(contentLineItemMMap) {
                examineView.rawContentEl.innerHTML = mUtils.string.escapeXML(contentLineItemMMap.get('textRaw'));
                examineView.filteredContentEl.innerHTML = contentLineItemMMap.get('view').el.innerHTML;

                return true;
            };

            /**
             * Clears examine content
             */
            var clear = this.clear = function ArmadillogExamine_clear() {
                examineView.rawContentEl.innerHTML = '';
                examineView.filteredContentEl.innerHTML = '';

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
            // mUtils.debug.spy(this);
        };

        //
        return {
            'ArmadillogExamine': ArmadillogExamine
        };
    });
