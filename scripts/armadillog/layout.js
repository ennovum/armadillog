'use strict';

window.define && define(
    [
        'ennovum.Environment',
        'ennovum.Utils'
    ],
    function (
        mEnvironment,
        mUtils
    ) {
/* ==================================================================================================== */

// debug spy switch
var DEBUG = false;

/**
 * Layout interface
 */
var iLayout = {
};

/**
 * Layout constructor
 */
var Layout = function Layout() {
    this.init.apply(this, arguments);
    DEBUG && mUtils.debug.spy(this);
    return mUtils.obj.implement({}, this, iLayout);
};

/**
 * Layout prototype
 */
Layout.prototype = {

    /**
     * Initializes instance
     *
     * @param {object} config configuration object
     */
    init: function Layout_init(config) {
        switch (true) {
            case !this.configSet(config):
            case !this.viewInit():
            case !this.uiInit():
            case !this.keyboardInit():
                return false;
                break;
        }

        return true;
    },

    /**
     * Initializes config
     *
     * @param {object} config configuration object
     */
    configSet: function Layout_configSet(config) {
        switch (false) {
            case !!config:
            case typeof config === 'object':
                console.error('Layout', 'configSet', 'invalid input');
                return false;
        };

        this.config = {
            mainmenuInputEl: config.mainmenuInputEl || null,
            inputWrapperEl: config.inputWrapperEl || null,
            inputFoldEl: config.inputFoldEl || null,
            mainmenuFilterEl: config.mainmenuFilterEl || null,
            filterWrapperEl: config.filterWrapperEl || null,
            filterFoldEl: config.filterFoldEl || null,
            mainmenuExamineEl: config.mainmenuExamineEl || null,
            examineWrapperEl: config.examineWrapperEl || null,
            examineFoldEl: config.examineFoldEl || null,
            mainmenuManualEl: config.mainmenuManualEl || null,
            manualWrapperEl: config.manualWrapperEl || null,
            manualFoldEl: config.manualFoldEl || null,
            contentBoxEl: config.contentBoxEl || null
        };

        return true;
    },

    /**
     * Initializes view
     */
    viewInit: function Layout_viewInit() {
        // nothing

        return true;
    },

    /**
     * Initializes UI
     */
    uiInit: function Layout_uiInit() {
        this.config.mainmenuInputEl.addEventListener(
            'click',
            function (evt) {
                this.inputToggle();
                evt.preventDefault();
            }.bind(this));

        this.config.inputFoldEl.addEventListener(
            'click',
            function (evt) {
                this.inputToggle();
                evt.preventDefault();
            }.bind(this));

        this.config.mainmenuFilterEl.addEventListener(
            'click',
            function (evt) {
                this.filterToggle();
                evt.preventDefault();
            }.bind(this));

        this.config.filterFoldEl.addEventListener(
            'click',
            function (evt) {
                this.filterToggle();
                evt.preventDefault();
            }.bind(this));

        this.config.mainmenuExamineEl.addEventListener(
            'click',
            function (evt) {
                this.examineToggle();
                evt.preventDefault();
            }.bind(this));

        this.config.examineFoldEl.addEventListener(
            'click',
            function (evt) {
                this.examineToggle();
                evt.preventDefault();
            }.bind(this));

        this.config.mainmenuManualEl.addEventListener(
            'click',
            function (evt) {
                this.manualToggle();
                evt.preventDefault();
            }.bind(this));

        this.config.manualFoldEl.addEventListener(
            'click',
            function (evt) {
                this.manualToggle();
                evt.preventDefault();
            }.bind(this));

        return true;
    },

    /**
     *
     */
    keyboardInit: function Layout_keyboardInit() {
        document.addEventListener(
            'keyup',
            function (evt) {
                switch (evt.target.tagName.toLowerCase()) {
                    case 'input':
                    case 'textarea':
                        return;
                        break;
                }

                switch (true) {
                    case evt.keyCode === 73 && !evt.ctrlKey && !evt.altKey && !evt.shiftKey: // i
                        this.inputToggle();
                        this.config.mainmenuInputEl.focus();
                        break;

                    case evt.keyCode === 70 && !evt.ctrlKey && !evt.altKey && !evt.shiftKey: // f
                        this.filterToggle();
                        this.config.mainmenuFilterEl.focus();
                        break;

                    case evt.keyCode === 69 && !evt.ctrlKey && !evt.altKey && !evt.shiftKey: // e
                        this.examineToggle();
                        this.config.mainmenuExamineEl.focus();
                        break;

                    case evt.keyCode === 77 && !evt.ctrlKey && !evt.altKey && !evt.shiftKey: // m
                        this.manualToggle();
                        this.config.mainmenuManualEl.focus();
                        break;

                    case evt.keyCode === 27 && !evt.ctrlKey && !evt.altKey && !evt.shiftKey: // esc
                        this.inputHide();
                        this.filterHide();
                        this.examineHide();
                        this.manualHide();
                        break;
                }
            }.bind(this));

        return true;
    },

    /**
     *
     */
    inputHide: function Layout_inputHide() {
        mUtils.dom.classRemove(this.config.mainmenuInputEl, 'pressed');

        mUtils.dom.classAdd(this.config.inputWrapperEl, 'hidden');

        return true;
    },

    /**
     *
     */
    inputToggle: function Layout_inputToggle() {
        mUtils.dom.classToggle(this.config.mainmenuInputEl, 'pressed');
        mUtils.dom.classRemove(this.config.mainmenuFilterEl, 'pressed')
        mUtils.dom.classRemove(this.config.mainmenuExamineEl, 'pressed')
        mUtils.dom.classRemove(this.config.mainmenuManualEl, 'pressed')

        mUtils.dom.classToggle(this.config.inputWrapperEl, 'hidden');
        mUtils.dom.classAdd(this.config.filterWrapperEl, 'hidden');
        mUtils.dom.classAdd(this.config.examineWrapperEl, 'hidden');
        mUtils.dom.classAdd(this.config.manualWrapperEl, 'hidden');

        return true;
    },

    /**
     *
     */
    filterHide: function Layout_filterHide() {
        mUtils.dom.classRemove(this.config.mainmenuFilterEl, 'pressed')

        mUtils.dom.classAdd(this.config.filterWrapperEl, 'hidden');

        return true;
    },

    /**
     *
     */
    filterToggle: function Layout_filterToggle() {
        mUtils.dom.classRemove(this.config.mainmenuInputEl, 'pressed');
        mUtils.dom.classToggle(this.config.mainmenuFilterEl, 'pressed')
        mUtils.dom.classRemove(this.config.mainmenuExamineEl, 'pressed')
        mUtils.dom.classRemove(this.config.mainmenuManualEl, 'pressed')

        mUtils.dom.classAdd(this.config.inputWrapperEl, 'hidden');
        mUtils.dom.classToggle(this.config.filterWrapperEl, 'hidden');
        mUtils.dom.classAdd(this.config.examineWrapperEl, 'hidden');
        mUtils.dom.classAdd(this.config.manualWrapperEl, 'hidden');

        return true;
    },

    /**
     *
     */
    examineHide: function Layout_examineHide() {
        mUtils.dom.classRemove(this.config.mainmenuExamineEl, 'pressed')

        mUtils.dom.classAdd(this.config.examineWrapperEl, 'hidden');

        return true;
    },

    /**
     *
     */
    examineToggle: function Layout_examineToggle() {
        mUtils.dom.classRemove(this.config.mainmenuInputEl, 'pressed');
        mUtils.dom.classRemove(this.config.mainmenuFilterEl, 'pressed')
        mUtils.dom.classToggle(this.config.mainmenuExamineEl, 'pressed')
        mUtils.dom.classRemove(this.config.mainmenuManualEl, 'pressed')

        mUtils.dom.classAdd(this.config.inputWrapperEl, 'hidden');
        mUtils.dom.classAdd(this.config.filterWrapperEl, 'hidden');
        mUtils.dom.classToggle(this.config.examineWrapperEl, 'hidden');
        mUtils.dom.classAdd(this.config.manualWrapperEl, 'hidden');

        return true;
    },

    /**
     *
     */
    manualHide: function Layout_manualHide() {
        mUtils.dom.classRemove(this.config.mainmenuManualEl, 'pressed')

        mUtils.dom.classAdd(this.config.manualWrapperEl, 'hidden');

        return true;
    },

    /**
     *
     */
    manualToggle: function Layout_manualToggle() {
        mUtils.dom.classRemove(this.config.mainmenuInputEl, 'pressed');
        mUtils.dom.classRemove(this.config.mainmenuFilterEl, 'pressed')
        mUtils.dom.classRemove(this.config.mainmenuExamineEl, 'pressed')
        mUtils.dom.classToggle(this.config.mainmenuManualEl, 'pressed')

        mUtils.dom.classAdd(this.config.inputWrapperEl, 'hidden');
        mUtils.dom.classAdd(this.config.filterWrapperEl, 'hidden');
        mUtils.dom.classAdd(this.config.examineWrapperEl, 'hidden');
        mUtils.dom.classToggle(this.config.manualWrapperEl, 'hidden');

        return true;
    },

    /**
     *
     */
    toString: function Layout_toString() {
        return 'ennovum.Layout';
    }

};

/* ==================================================================================================== */
        return {
            'Layout': Layout,
            'iLayout': iLayout
        };
    });
