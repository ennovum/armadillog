'use strict';

/**
 * ModelValue module
 */
define(
    [
        'ennovum.environment',
        'ennovum.composition',
        'ennovum.utils',
        'ennovum.Observable',
        'ennovum.Queue'
    ],
    function (
        environment,
        composition,
        utils,
        Observable,
        Queue
    ) {
        /**
         * ModelValue constructor
         */
        var ModelValue = function ModelValue() {
            var itc = {
                observable: composition.mixin(this, new Observable()),
                queue: composition.mixin(this, new Queue()),

                value: undefined,

                eventGroupList: [],
                valueListener: null,
                eventFlushScheduled: false
            };

            this.get = get.bind(this, itc);
            this.set = set.bind(this, itc);

            arguments.length && this.set.apply(this, arguments);

            return this;
        };

        /**
         * Returns the value
         */
        var get = function ModelValue_get(itc) {
            return itc.value;
        };

        /**
         * Sets the value
         *
         * @param {mixed} value item's value
         */
        var set = function ModelValue_set(itc, value) {
            var valueOld = itc.value;

            if (value !== valueOld) {
                itc.value = value;

                valueUnhandle(itc, valueOld);
                valueHandle(itc, itc.value);

                eventAdd(
                    itc,
                    'model-update',
                    [{
                        'valueNew': value,
                        'valueOld': valueOld
                    }]);
            }

            return true;
        };

        /**
         * Attaches event forwarding
         *
         * @param {mixed} value value to attach
         */
        var valueHandle = function ModelValue_valueHandle(itc, value) {
            if (!value || typeof value.handle !== 'function') {
                return false;
            }

            value.handle(
                [
                    'model-insert',
                    'model-update',
                    'model-delete',
                    'model-forward'
                ],
                itc.valueListener = function ModelValue_valueHandle_valueListener(event, dataList) {
                    eventAdd(
                        itc,
                        'model-forward',
                        [{
                            'valueNew': value,
                            'event': event,
                            'dataList': dataList
                        }]);
                });

            return true;
        };

        /**
         * Detaches event forwarding
         *
         * @param {mixed} value value to detach
         */
        var valueUnhandle = function ModelValue_valueUnhandle(itc, value) {
            if (!itc.valueListener) {
                return false;
            }

            value.unhandle(
                [
                    'model-insert',
                    'model-update',
                    'model-delete',
                    'model-forward'
                ],
                itc.valueListener);

            itc.valueListener = null;

            return true;
        };

        /**
         * Adds the event to the event group list and queues event flush
         *
         * @param {string} event event name
         * @param {dataList} event data list
         */
        var eventAdd = function ModelValue_eventAdd(itc, event, dataList) {
            var eventGroup = itc.eventGroupList[itc.eventGroupList.length - 1] || null;
            if (!eventGroup || eventGroup.event !== event) {
                eventGroup = {
                    'event': event,
                    'dataList': []
                };
                itc.eventGroupList.push(eventGroup);
            }

            eventGroup.dataList.push.apply(eventGroup.dataList, dataList);

            if (!itc.eventFlushScheduled) {
                itc.eventFlushScheduled = true;
                itc.queue.queue(
                    function () {
                        itc.eventFlushScheduled = false;
                        eventFlush(itc);
                    }, true);
            }

            return true;
        };

        /**
         * Flushes events
         */
        var eventFlush = function ModelValue_eventFlush(itc) {
            var eventGroup;

            for (var i = 0, l = itc.eventGroupList.length; i < l; i++) {
                eventGroup = itc.eventGroupList[i];
                eventGroup.dataList.length && itc.observable.trigger(eventGroup.event, eventGroup.dataList);
            }

            itc.eventGroupList = [];

            return true;
        };

        //
        return ModelValue;
    });
