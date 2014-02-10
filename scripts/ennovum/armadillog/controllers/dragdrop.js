'use strict';

define(
    [
        'ennovum.environment',
        'ennovum.dom',
        'ennovum.utils'
    ],
    function (
        environment,
        dom,
        utils
    ) {
        /**
         * ArmadillogDragdrop constructor
         */
        var ArmadillogDragdrop = function ArmadillogDragdrop(config, application) {
            var itc = {
                config: undefined,
                application: undefined,

                dragging: undefined,

                dropEl: undefined
            };

            init.call(this, itc, config, application);
        };

        /**
         * Initializes instance
         *
         * @param {object} config configuration object
         */
        var init = function ArmadillogDragdrop_init(itc, config, application) {
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
        var configSet = function ArmadillogDragdrop_configSet(itc, config) {
            switch (false) {
                case !!config:
                case typeof config === 'object':
                    console.error('ArmadillogDragdrop', 'configSet', 'invalid input');
                    return false;
            };

            itc.config = {
                contentDropEl: config.contentDropEl || null
            };

            return true;
        };

        /**
         * Initializes data
         */
        var dataInit = function ArmadillogDragdrop_dataInit(itc, application) {
            itc.application = application;

            itc.dragging = false;

            return true;
        };

        /**
         * Initializes view
         */
        var viewInit = function ArmadillogDragdrop_viewInit(itc) {
            itc.dropEl = itc.config.contentDropEl;
            if (!itc.dropEl) {
                console.error('ArmadillogDragdrop', 'viewInit', 'invalid contentDropEl');
                return false;
            };

            return true;
        };

        /**
         * Initializes UI
         */
        var uiInit = function ArmadillogDragdrop_uiInit(itc) {
            dom.handle(
                itc.dropEl, 'dragstart', false, false, true,
                function ArmadillogDragdrop_uiInit_dropElDragstartHandler(evt) {
                    itc.dragging = true;
                },
                this);

            dom.handle(
                itc.dropEl, 'dragover', false, true, true,
                function ArmadillogDragdrop_uiInit_dropElDragovertHandler(evt) {
                    evt.dataTransfer.dropEffect = itc.dragging ? 'none' : 'copy';
                },
                this);

            dom.handle(
                itc.dropEl, 'dragend', false, true, true,
                function ArmadillogDragdrop_uiInit_dropElDragendHandler(evt) {
                    itc.dragging = false;
                },
                this);

            dom.handle(
                itc.dropEl, 'drop', false, true, true,
                function ArmadillogDragdrop_uiInit_dropElDropHandler(evt) {
                    if (itc.dragging) {
                        return;
                    }

                    var files = evt.dataTransfer.files;
                    if (files.length) {
                        itc.application.content.clear(itc);
                        itc.application.content.fileSet(files[0], files[0].name);
                    }

                    var data = evt.dataTransfer.getData('text/plain');
                    if (data) {
                        itc.application.content.clear(itc);
                        itc.application.content.textSet(data, '(dragged text)');
                    }
                },
                this);

            return true;
        };

        //
        return ArmadillogDragdrop;
    });
