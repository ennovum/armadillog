'use strict';

/**
 * ModelMap module
 */
define(
    [
        'ennovum.Environment',
        'ennovum.Utils',
        'ennovum.Observable',
        'ennovum.Queue'
    ],
    function (
        mEnvironment,
        mUtils,
        mObservable,
        mQueue
    ) {
        /**
         * ModelMap constructor
         */
        var ModelMap = function ModelMap() {
            var oObservable;
            var oQueue;

            var map;

            var eventGroupList;
            var flushQueued;
            var valueListenerMap;

            /**
             * Initializes instance
             */
            var init = function ModelMap_init() {
                oObservable = mUtils.obj.mixin(this, new mObservable.Observable());
                oQueue = mUtils.obj.mixin(this, new mQueue.Queue());

                map = {};

                eventGroupList = [];
                flushQueued = false;
                valueListenerMap = {};

                arguments.length && set.apply(this, arguments);

                return true;
            };

            /**
             * Returns a value at the given key
             *
             * @param {string} key key of the value to return
             */
            var get = this.get = function ModelMap_get(key) {
                return map[key];
            };

            /**
             * Sets the given values at the given keys
             *
             * @param {string} key key of the value to be set
             * @param {mixed} value value to be set
             */
            var set = this.set = function ModelMap_set(key, value) {
                var insertList = [];
                var updateList = [];

                for (var i = 0, l = arguments.length; i < l; i += 2) {
                    key = '' + arguments[i];
                    value = arguments[i + 1];

                    if (key in map) {
                        var valueOld = map[key];

                        if (value !== valueOld) {
                            map[key] = value;

                            valueOff(key, valueOld);
                            valueOn(key, value);

                            updateList.push({
                                'key': key,
                                'valueNew': value,
                                'valueOld': valueOld
                            });
                        }
                    }
                    else {
                        map[key] = value;

                        valueOn(key, value);

                        insertList.push({
                            'key': key,
                            'valueNew': value
                        });
                    }
                }

                insertList.length && eventAdd('model-insert', insertList);
                updateList.length && eventAdd('model-update', updateList);

                return true;
            };

            /**
             * Removes a value at the given key
             *
             * @param {string} key key of the value to be deleted
             */
            var del = this.del = function ModelMap_del(key) {
                var deleteList = [];

                for (var i = 0, l = arguments.length; i < l; i++) {
                    key = '' + arguments[i];

                    if (key in map) {
                        var valueOld = map[key];

                        delete map[key];

                        valueOff(key, valueOld);

                        deleteList.push({
                            'key': key,
                            'valueOld': valueOld
                        });
                    }
                }

                deleteList.length && eventAdd('model-delete', deleteList);

                return true;
            };

            /**
             * Checks if the given key exists
             *
             * @param {string} key key to be checked
             */
            var has = this.has = function ModelMap_has(key) {
                for (var i = 0, l = arguments.length; i < l; i++) {
                    key = '' + arguments[i];

                    if (key in map) {
                        return true;
                    }
                }

                return false;
            };

            /**
             * Attaches event forwarding
             *
             * @param {number} key key of the value to attach
             * @param {mixed} value value to attach
             */
            var valueOn = function ModelMap_valueOn(key, value) {
                if (value && typeof value === 'object' && 'on' in value && typeof value.on === 'function') {
                    value.on(
                        [
                            'model-insert',
                            'model-update',
                            'model-delete',
                            'model-forward'
                        ],
                        valueListenerMap[key] = function ModelMap_valueOn_valueListener(event, dataList) {
                            eventAdd(
                                'model-forward',
                                [{
                                    'key': key,
                                    'valueNew': value,
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
             * @param {number} key key of the value to detach
             * @param {mixed} value value to detach
             */
            var valueOff = function ModelMap_valueOff(key, value) {
                if (valueListenerMap[key]) {
                    value.off(
                        [
                            'model-insert',
                            'model-update',
                            'model-delete',
                            'model-forward'
                        ],
                        valueListenerMap[key]);

                    valueListenerMap[key] = null;
                }

                return true;
            };

            /**
             * Adds the event to the event group list and queues event flush
             *
             * @param {string} event event name
             * @param {dataList} event data list
             */
            var eventAdd = function ModelMap_eventAdd(event, dataList) {
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

                    oQueue.queue(function ModelMap_eventAdd_eventFlush() {
                        flushQueued = false;
                        eventFlush();

                        oQueue.dequeue();
                    });
                }

                return true;
            };

            /**
             * Flushes events
             */
            var eventFlush = function ModelMap_eventFlush() {
                for (var i = 0, l = eventGroupList.length; i < l; i++) {
                    if (eventGroupList[i].dataList.length) {
                        oObservable.trigger(eventGroupList[i].event, eventGroupList[i].dataList);
                    }
                }

                eventGroupList = [];

                return true;
            };

            /**
             * Returns raw map
             */
            var toMap = this.toMap = function ModelList_toMap() {
                return map;
            };

            /**
             *
             */
            var toString = this.toString = function ModelMap_toString() {
                return 'ennovum.model.ModelMap';
            };

            //
            init.apply(this, arguments);
            // mUtils.debug.spy(this);
        };

        return {
            'ModelMap': ModelMap
        };
    });
