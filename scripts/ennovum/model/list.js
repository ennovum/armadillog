'use strict';

/**
 * ModelList module
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
         * ModelList constructor
         */
        var ModelList = function ModelList() {
            var observable;
            var queue;

            var list;

            var eventGroupList;
            var flushQueued;
            var valueListenerList;

            /**
             * Initializes instance
             */
            var init = function ModelList_init() {
                observable = utils.obj.mixin(this, new Observable());
                queue = utils.obj.mixin(this, new Queue());

                list = [];

                eventGroupList = [];
                flushQueued = false;
                valueListenerList = [];

                arguments.length && this.set.apply(this, arguments);

                return true;
            };

            /**
             * Returns a value at the given index
             *
             * @param {number} index index of the value to return
             */
            var getAt = this.getAt = function ModelList_getAt(index) {
                return list[index];
            };

            /**
             * Sets the given values at the given indexes
             *
             * @param {number} index index of the value to be set
             * @param {mixed} value value to be set
             */
            var setAt = this.setAt = function ModelList_setAt(index, value) {
                var insertList = [];
                var updateList = [];

                for (var i = 0, l = arguments.length; i < l; i += 2) {
                    index = ~~arguments[i];
                    value = arguments[i + 1];

                    if (index < list.length) {
                        var valueOld = list[index];

                        if (value !== valueOld) {
                            list[index] = value;

                            valueOff(index, valueOld);
                            valueOn(index, value);

                            updateList.push({
                                'index': index,
                                'valueNew': value,
                                'valueOld': valueOld
                            });
                        }
                    }
                    else {
                        list[index] = value;

                        valueOn(index, value);

                        insertList.push({
                            'index': index,
                            'valueNew': value
                        });
                    }
                }

                insertList.length && eventAdd('model-insert', insertList);
                updateList.length && eventAdd('model-update', updateList);

                return true;
            };

            /**
             * Removes a value at the given index
             *
             * @param {number} index index of the value to be deleted
             */
            var delAt = this.delAt = function ModelList_delAt(index) {
                var deleteList = [];

                for (var i = 0, l = arguments.length; i < l; i++) {
                    index = ~~arguments[i];

                    if (index < list.length) {
                        var valueOld = list[index];

                        list[index] = value;

                        valueOff(index, valueOld);

                        deleteList.push({
                            'index': index,
                            'valueOld': valueOld
                        });
                    }
                }

                deleteList.length && eventAdd('model-delete', deleteList);

                return true;
            };

            /**
             * Pushes values to the list
             */
            var push = this.push = function ModelList_push(/*, value1, ..., valueN*/) {
                var index = list.length;

                var insertValueList = Array.prototype.slice.call(arguments);
                var insertList = [];

                list.push.apply(list, arguments);

                for (var i = 0, l = insertValueList.length; i < l; i++) {
                    valueOn(index + i, insertValueList[i]);

                    insertList.push({
                        'index': index + i,
                        'valueNew': insertValueList[i]
                    });
                }

                insertList.length && eventAdd('model-insert', insertList);

                return true;
            };

            /**
             * Pops a value from the list
             */
            var pop = this.pop = function ModelList_pop() {
                if (list.length === 0) {
                    return false;
                }

                var index = list.length - 1;
                var valueOld = list.pop();

                valueOff(index, valueOld);

                eventAdd(
                    'model-delete',
                    [{
                        'index': index,
                        'valueOld': valueOld
                    }]);

                return valueOld;
            };

            /**
             * Shifts a value from the list
             */
            var shift = this.shift = function ModelList_shift() {
                if (list.length === 0) {
                    return false;
                }

                var index = 0;
                var valueOld = list.shift();

                valueOff(index, valueOld);

                eventAdd(
                    'model-delete',
                    [{
                        'index': index,
                        'valueOld': valueOld
                    }]);

                return valueOld;
            };

            /**
             * Unshifts values to the list
             */
            var unshift = this.unshift = function ModelList_unshift(/*, value1, ..., valueN*/) {
                var index = 0;

                var insertValueList = Array.prototype.slice.call(arguments);
                var insertList = [];

                list.unshift.apply(list, arguments);

                for (var i = 0, l = insertValueList.length; i < l; i++) {
                    valueOn(index + i, insertValueList[i]);

                    insertList.push({
                        'index': index + i,
                        'valueNew': insertValueList[i]
                    });
                }

                insertList.length && eventAdd('model-insert', insertList);

                return true;
            };

            /**
             * Removes a given count of values from the list starting at the given index, then adds new values starting at the same place
             *
             * @param {number} index index of a first value to splice
             * @param {number} count values to splice count
             */
            var splice = this.splice = function ModelList_splice(index, count/*, value1, ..., valueN*/) {
                if (typeof index !== 'number' || index < 0) {
                    return false;
                }

                if (typeof count !== 'number' || count < 0) {
                    count = list.length - index;
                }

                var insertValueList = Array.prototype.slice.call(arguments, 2);
                var insertList = [];

                var deleteValueList = list.slice(index, index + count);
                var deleteList = [];

                list.splice.apply(list, arguments);

                for (var i = 0, l = insertValueList.length; i < l; i++) {
                    valueOn(index + i, insertValueList[i]);

                    insertList.push({
                        'index': index + i,
                        'valueNew': insertValueList[i]
                    });
                }

                insertList.length && eventAdd('model-insert', insertList);

                for (var i = 0, l = deleteValueList.length; i < l; i++) {
                    valueOff(index + i, deleteValueList[i]);

                    deleteList.push({
                        'index': index + i,
                        'valueOld': deleteValueList[i]
                    });
                }

                deleteList.length && eventAdd('model-delete', deleteList);

                return true;
            };

            /**
             * Returns the list length
             */
            var length = this.length =  function ModelList_length() {
                return list.length;
            };

            /**
             * Returns an index of the given value
             *
             * @param {mixed} value value to return index of
             */
            var indexOf = this.indexOf = function ModelList_indexOf(value) {
                return list.indexOf(value);

                return true;
            };

            /**
             * Attaches event forwarding
             *
             * @param {number} index index of the value to attach
             * @param {mixed} value value to attach
             */
            var valueOn = function ModelList_valueOn(index, value) {
                if (value && typeof value === 'object' && 'on' in value && typeof value.on === 'function') {
                    value.on(
                        [
                            'model-insert',
                            'model-update',
                            'model-delete',
                            'model-forward'
                        ],
                        valueListenerList[index] = function ModelList_valueOn_valueListener(event, dataList) {
                            eventAdd(
                                'model-forward',
                                [{
                                    'index': index,
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
             * @param {number} index index of the value to detach
             * @param {mixed} value value to detach
             */
            var valueOff = function ModelList_valueOff(index, value) {
                if (valueListenerList[index]) {
                    value.off(
                        [
                            'model-insert',
                            'model-update',
                            'model-delete',
                            'model-forward'
                        ],
                        valueListenerList[index]);

                    valueListenerList[index] = null;
                }

                return true;
            };

            /**
             * Adds the event to the event group list and queues event flush
             *
             * @param {string} event event name
             * @param {dataList} event data list
             */
            var eventAdd = function ModelList_eventAdd(event, dataList) {
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

                    queue.queue(function ModelList_eventAdd_eventFlush() {
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
            var eventFlush = function ModelList_eventFlush() {
                for (var i = 0, l = eventGroupList.length; i < l; i++) {
                    if (eventGroupList[i].dataList.length) {
                        observable.trigger(eventGroupList[i].event, eventGroupList[i].dataList);
                    }
                }

                eventGroupList = [];

                return true;
            };

            /**
             * Returns raw list
             */
            var toArray = this.toArray = function ModelList_toArray() {
                return list;
            };

            /**
             *
             */
            var toString = this.toString = function ModelList_toString() {
                return 'ennovum.model.ModelList';
            };

            //
            init.apply(this, arguments);
        };

        //
        return ModelList;
    });
