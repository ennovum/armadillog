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

            this.toString = toString.bind(this, itc);

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
        var set = function ModelValue_set(itc, valueTmp) {
            var valueOld = itc.value;

            if (valueTmp !== valueOld) {
                itc.value = valueTmp;

                valueOff(itc, valueOld);
                valueOn(itc, itc.value);

                eventAdd(
                    itc,
                    'model-update',
                    [{
                        'valueNew': valueTmp,
                        'valueOld': valueOld
                    }]);
            }

            return true;
        };

        /**
         * Attaches event forwarding
         *
         * @param {mixed} valueTmp value to attach
         */
        var valueOn = function ModelValue_valueOn(itc, valueTmp) {
            if (valueTmp && typeof valueTmp === 'object' && 'on' in valueTmp && typeof valueTmp.on === 'function') {
                valueTmp.on(
                    [
                        'model-insert',
                        'model-update',
                        'model-delete',
                        'model-forward'
                    ],
                    itc.valueListener = function ModelValue_valueOn_valueListener(event, dataList) {
                        eventAdd(
                            itc,
                            'model-forward',
                            [{
                                'valueNew': valueTmp,
                                'event': event,
                                'dataList': dataList
                            }]);
                    });
            }

            return true;
        };

        /**
         * Detaches event forwarding
         *
         * @param {mixed} valueTmp value to detach
         */
        var valueOff = function ModelValue_valueOff(itc, valueTmp) {
            if (itc.valueListener) {
                valueTmp.off(
                    [
                        'model-insert',
                        'model-update',
                        'model-delete',
                        'model-forward'
                    ],
                    itc.valueListener);

                itc.valueListener = null;
            }

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

        /**
         *
         */
        var toString = function ModelValue_toString() {
            return 'ennovum.model.ModelValue';
        };

        //
        return ModelValue;
    });
