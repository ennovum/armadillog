'use strict';

/**
 * ModelMap module
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
         * ModelMap constructor
         */
        var ModelMap = function ModelMap() {
            var itc = {
                observable: composition.mixin(this, new Observable()),
                queue: composition.mixin(this, new Queue()),

                map: {},

                eventGroupList: [],
                valueListenerMap: {},
                eventFlushScheduled: false
            };

            this.get = get.bind(this, itc);
            this.set = set.bind(this, itc);
            this.del = del.bind(this, itc);
            this.has = has.bind(this, itc);

            this.toMap = toMap.bind(this, itc);

            arguments.length && this.set.apply(this, arguments);

            return this;
        };

        /**
         * Returns a value at the given key
         *
         * @param {string} key key of the value to return
         */
        var get = function ModelMap_get(itc, key) {
            return itc.map[key];
        };

        /**
         * Sets the given values at the given keys
         *
         * @param {string} key key of the value to be set
         * @param {mixed} value value to be set
         */
        var set = function ModelMap_set(itc, key, value) {
            var keyValueList = Array.prototype.slice.call(arguments, 1);
            var insertList = [];
            var updateList = [];

            for (var i = 0, l = keyValueList.length; i < l; i += 2) {
                key = '' + keyValueList[i];
                value = keyValueList[i + 1];

                if (key in itc.map) {
                    var valueOld = itc.map[key];

                    if (value !== valueOld) {
                        itc.map[key] = value;

                        valueOff(itc, key, valueOld);
                        valueOn(itc, key, value);

                        updateList.push({
                            'key': key,
                            'valueNew': value,
                            'valueOld': valueOld
                        });
                    }
                }
                else {
                    itc.map[key] = value;

                    valueOn(itc, key, value);

                    insertList.push({
                        'key': key,
                        'valueNew': value
                    });
                }
            }

            insertList.length && eventAdd(itc, 'model-insert', insertList);
            updateList.length && eventAdd(itc, 'model-update', updateList);

            return true;
        };

        /**
         * Removes a value at the given key
         *
         * @param {string} key key of the value to be deleted
         */
        var del = function ModelMap_del(itc, key) {
            var keyList = Array.prototype.slice.call(arguments, 1);
            var deleteList = [];

            for (var i = 0, l = keyList.length; i < l; i++) {
                key = '' + keyList[i];

                if (key in itc.map) {
                    var valueOld = itc.map[key];

                    delete itc.map[key];

                    valueOff(itc, key, valueOld);

                    deleteList.push({
                        'key': key,
                        'valueOld': valueOld
                    });
                }
            }

            deleteList.length && eventAdd(itc, 'model-delete', deleteList);

            return true;
        };

        /**
         * Checks if the given key exists
         *
         * @param {string} key key to be checked
         */
        var has = function ModelMap_has(itc, key) {
            var keyList = Array.prototype.slice.call(arguments, 1);

            for (var i = 0, l = keyList.length; i < l; i++) {
                key = '' + keyList[i];

                if (key in itc.map) {
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
        var valueOn = function ModelMap_valueOn(itc, key, value) {
            if (value && typeof value === 'object' && 'on' in value && typeof value.on === 'function') {
                value.on(
                    [
                        'model-insert',
                        'model-update',
                        'model-delete',
                        'model-forward'
                    ],
                    itc.valueListenerMap[key] = function ModelMap_valueOn_valueListener(event, dataList) {
                        eventAdd(
                            itc,
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
        var valueOff = function ModelMap_valueOff(itc, key, value) {
            if (itc.valueListenerMap[key]) {
                value.off(
                    [
                        'model-insert',
                        'model-update',
                        'model-delete',
                        'model-forward'
                    ],
                    itc.valueListenerMap[key]);

                itc.valueListenerMap[key] = null;
            }

            return true;
        };

        /**
         * Adds the event to the event group list and queues event flush
         *
         * @param {string} event event name
         * @param {dataList} event data list
         */
        var eventAdd = function ModelMap_eventAdd(itc, event, dataList) {
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
                    },
                    true);
            }

            return true;
        };

        /**
         * Flushes events
         */
        var eventFlush = function ModelMap_eventFlush(itc) {
            var eventGroup;

            for (var i = 0, l = itc.eventGroupList.length; i < l; i++) {
                eventGroup = itc.eventGroupList[i];
                eventGroup.dataList.length && itc.observable.trigger(eventGroup.event, eventGroup.dataList);
            }

            itc.eventGroupList = [];

            return true;
        };

        /**
         * Returns raw map
         */
        var toMap = function ModelList_toMap(itc) {
            return itc.map;
        };

        //
        return ModelMap;
    });
