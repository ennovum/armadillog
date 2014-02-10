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
        viewExamine
    ) {
        /**
         * ArmadillogExamine constructor
         */
        var ArmadillogExamine = function ArmadillogExamine(config, application) {
            var itc = {
                config: undefined,
                application: undefined,

                bodyEl: undefined,
                boxEl: undefined,
                examineEls: undefined
            };

            this.set = set.bind(this, itc);
            this.clear = clear.bind(this, itc);

            init.call(this, itc, config, application);
        };

        /**
         * Initializes instance
         *
         * @param {object} config configuration object
         */
        var init = function ArmadillogExamine_init(itc, config, application) {
            switch (true) {
                case !configSet(itc, config):
                case !dataInit(itc, application):
                case !viewInit(itc):
                case !uiInit(itc):
                    return false;
                    break;
            }

            return true;
        };

        /**
         * Initializes config
         *
         * @param {object} config configuration object
         */
        var configSet = function ArmadillogExamine_configSet(itc, config) {
            switch (false) {
                case !!config:
                case typeof config === 'object':
                    console.error('ArmadillogExamine', 'configSet', 'invalid input');
                    return false;
            };

            itc.config = {
                boxEl: config.examineBoxEl || null
            };

            return true;
        };

        /**
         * Initializes data
         */
        var dataInit = function ArmadillogExamine_dataInit(itc, application) {
            itc.application = application;

            return true;
        };

        /**
         * Initializes view
         */
        var viewInit = function ArmadillogExamine_viewInit(itc) {
            itc.bodyEl = itc.config.bodyEl;

            itc.boxEl = itc.config.boxEl;
            if (!itc.boxEl) {
                console.error('ArmadillogExamine', 'viewInit', 'invalid boxEl');
                return false;
            };

            itc.examineEls = viewExamine.examineCreate();
            itc.boxEl.appendChild(itc.examineEls.rawBoxEl);
            itc.boxEl.appendChild(itc.examineEls.filteredBoxEl);

            return true;
        };

        /**
         * Initializes UI
         */
        var uiInit = function ArmadillogExamine_uiInit(itc) {
            dom.handle(
                itc.examineEls.rawContentEl, 'keyup', false, false, false,
                function (evt) {
                    if (!(evt.keyCode === 27 && !evt.ctrlKey && !evt.altKey && !evt.shiftKey)) { // esc
                        evt.stopPropagation();
                    }
                },
                this);

            dom.handle(
                itc.examineEls.filteredContentEl, 'keyup', false, false, false,
                function (evt) {
                    if (!(evt.keyCode === 27 && !evt.ctrlKey && !evt.altKey && !evt.shiftKey)) { // esc
                        evt.stopPropagation();
                    }
                },
                this);

            return true;
        };

        /**
         * Sets examine content
         *
         * @param {object} contentLineItemMMap content line model object
         */
        var set = function ArmadillogExamine_set(itc, contentLineItemMMap) {
            itc.examineEls.rawContentEl.innerHTML = utils.escapeXML(contentLineItemMMap.get('textRaw'));
            itc.examineEls.filteredContentEl.innerHTML = contentLineItemMMap.get('els').el.innerHTML;

            return true;
        };

        /**
         * Clears examine content
         */
        var clear = function ArmadillogExamine_clear(itc) {
            itc.examineEls.rawContentEl.innerHTML = '';
            itc.examineEls.filteredContentEl.innerHTML = '';

            return true;
        };

        //
        return ArmadillogExamine;
    });
