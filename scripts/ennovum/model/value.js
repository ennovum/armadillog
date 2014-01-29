'use strict';

/**
 * ModelValue module
 */
define(
    [
        'ennovum.environment',
        'ennovum.utils',
        'ennovum.Observable',
        'ennovum.Queue'
    ],
    function (
        environment,
        utils,
        Observable,
        Queue
    ) {
        /**
         * ModelValue constructor
         */
        var ModelValue = function ModelValue() {
            var observable;
            var queue;

            var value;

            var eventGroupList;
            var flushQueued;
            var valueListener;

            /**
             * Initializes instance
             */
            var init = function ModelValue_init() {
                observable = utils.obj.mixin(this, new Observable());
                queue = utils.obj.mixin(this, new Queue());

                eventGroupList = [];
                flushQueued = false;
                valueListener = null;

                arguments.length && this.set.apply(this, arguments);

                return true;
            };

            /**
             * Returns the value
             */
            var get = this.get = function ModelValue_get() {
                return value;
            };

            /**
             * Sets the value
             *
             * @param {mixed} value item's value
             */
            var set = this.set = function ModelValue_set(valueTmp) {
                var valueOld = value;

                if (valueTmp !== valueOld) {
                    value = valueTmp;

                    valueOff(valueOld);
                    valueOn(value);

                    eventAdd(
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
            var valueOn = function ModelValue_valueOn(valueTmp) {
                if (valueTmp && typeof valueTmp === 'object' && 'on' in valueTmp && typeof valueTmp.on === 'function') {
                    valueTmp.on(
                        [
                            'model-insert',
                            'model-update',
                            'model-delete',
                            'model-forward'
                        ],
                        valueListener = function ModelValue_valueOn_valueListener(event, dataList) {
                            eventAdd(
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
            var valueOff = function ModelValue_valueOff(valueTmp) {
                if (valueListener) {
                    valueTmp.off(
                        [
                            'model-insert',
                            'model-update',
                            'model-delete',
                            'model-forward'
                        ],
                        valueListener);

                    valueListener = null;
                }

                return true;
            };

            /**
             * Adds the event to the event group list and queues event flush
             *
             * @param {string} event event name
             * @param {dataList} event data list
             */
            var eventAdd = function ModelValue_eventAdd(event, dataList) {
                var eventGroup = eventGroupList[eventGroupList.length - 1] || null;
                if (!eventGroup || eventGroup.event !== event) {
                    eventGroup = {
                        'event': event,
                        'dataList': []
                    };
                    eventGroupList.push(eventGroup);
                }

                eventGroup.dataList.push.apply(eventGroup.dataList, dataList);

                if (!flushQueued) {
                    flushQueued = true;

                    queue.queue(function ModelValue_eventAdd_eventFlush() {
                        flushQueued = false;
                        eventFlush();

                        queue.dequeue();
                    });
                }

                return true;
            };

            /**
             * Flushes events
             */
            var eventFlush = function ModelValue_eventFlush() {
                for (var i = 0, l = eventGroupList.length; i < l; i++) {
                    if (eventGroupList[i].dataList.length) {
                        observable.trigger(eventGroupList[i].event, eventGroupList[i].dataList);
                    }
                }

                eventGroupList = [];

                return true;
            };

            /**
             *
             */
            var toString = this.toString = function ModelValue_toString() {
                return 'ennovum.model.ModelValue';
            };

            //
            init.apply(this, arguments);
            // utils.debug.spy(this);
        };

        //
        return ModelValue;
    });
