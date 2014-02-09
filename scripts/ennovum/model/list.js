'use strict';

/**
 * ModelList module
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
         * ModelList constructor
         */
        var ModelList = function ModelList() {
            var itc = {
                observable: composition.mixin(this, new Observable()),
                queue: composition.mixin(this, new Queue()),

                list: [],

                eventGroupList: [],
                valueListenerList: [],
                eventFlushScheduled: false
            };

            this.getAt = getAt.bind(this, itc);
            this.setAt = setAt.bind(this, itc);
            this.delAt = delAt.bind(this, itc);

            this.push = push.bind(this, itc);
            this.pop = pop.bind(this, itc);
            this.shift = shift.bind(this, itc);
            this.unshift = unshift.bind(this, itc);
            this.splice = splice.bind(this, itc);
            this.length = length.bind(this, itc);
            this.indexOf = indexOf.bind(this, itc);

            this.toArray = toArray.bind(this, itc);
            this.toString = toString.bind(this, itc);

            arguments.length && this.set.apply(this, arguments);

            return this;
        };

        /**
         * Returns a value at the given index
         *
         * @param {number} ix index of the value to return
         */
        var getAt = function ModelList_getAt(itc, ix) {
            return itc.list[ix];
        };

        /**
         * Sets the given values at the given indexes
         *
         * @param {number} ix index of the value to be set
         * @param {mixed} value value to be set
         */
        var setAt = function ModelList_setAt(itc, ix, value) {
            var ixValueList = Array.prototype.slice.call(arguments, 1);
            var insertList = [];
            var updateList = [];

            for (var i = 0, l = ixValueList.length; i < l; i += 2) {
                ix = ~~ixValueList[i];
                value = ixValueList[i + 1];

                if (ix < itc.list.length) {
                    var valueOld = itc.list[ix];

                    if (value !== valueOld) {
                        itc.list[ix] = value;

                        valueOff(itc, ix, valueOld);
                        valueOn(itc, ix, value);

                        updateList.push({
                            'ix': ix,
                            'valueNew': value,
                            'valueOld': valueOld
                        });
                    }
                }
                else {
                    itc.list[ix] = value;

                    valueOn(itc, ix, value);

                    insertList.push({
                        'ix': ix,
                        'valueNew': value
                    });
                }
            }

            insertList.length && eventAdd(itc, 'model-insert', insertList);
            updateList.length && eventAdd(itc, 'model-update', updateList);

            return true;
        };

        /**
         * Removes a value at the given index
         *
         * @param {number} ix index of the value to be deleted
         */
        var delAt = function ModelList_delAt(itc, ix) {
            var ixList = Array.prototype.slice.call(arguments, 1);
            var deleteList = [];

            for (var i = 0, l = ixList.length; i < l; i++) {
                ix = ~~ixList[i];

                if (ix < itc.list.length) {
                    var valueOld = itc.list[ix];

                    itc.list[ix] = value;

                    valueOff(itc, ix, valueOld);

                    deleteList.push({
                        'ix': ix,
                        'valueOld': valueOld
                    });
                }
            }

            deleteList.length && eventAdd(itc, 'model-delete', deleteList);

            return true;
        };

        /**
         * Pushes values to the list
         */
        var push = function ModelList_push(itc, value) {
            var valueList = Array.prototype.slice.call(arguments, 1);
            var insertList = [];
            var ix = itc.list.length;

            itc.list.push.apply(itc.list, valueList);

            for (var i = 0, l = valueList.length; i < l; i++) {
                value = valueList[i];

                valueOn(itc, ix + i, value);

                insertList.push({
                    'ix': ix + i,
                    'valueNew': value
                });
            }

            insertList.length && eventAdd(itc, 'model-insert', insertList);

            return true;
        };

        /**
         * Pops a value from the list
         */
        var pop = function ModelList_pop(itc) {
            if (itc.list.length === 0) {
                return false;
            }

            var ix = itc.list.length - 1;
            var valueOld = itc.list.pop();

            valueOff(itc, ix, valueOld);

            eventAdd(
                itc,
                'model-delete',
                [{
                    'ix': ix,
                    'valueOld': valueOld
                }]);

            return valueOld;
        };

        /**
         * Shifts a value from the list
         */
        var shift = function ModelList_shift(itc) {
            if (itc.list.length === 0) {
                return false;
            }

            var ix = 0;
            var valueOld = itc.list.shift();

            valueOff(itc, ix, valueOld);

            eventAdd(
                itc,
                'model-delete',
                [{
                    'ix': ix,
                    'valueOld': valueOld
                }]);

            return valueOld;
        };

        /**
         * Unshifts values to the list
         */
        var unshift = function ModelList_unshift(itc, value) {
            var valueList = Array.prototype.slice.call(arguments, 1);
            var insertList = [];
            var ix = 0;

            itc.list.unshift.apply(itc.list, valueList);

            for (var i = 0, l = valueList.length; i < l; i++) {
                value = valueList[i];

                valueOn(itc, ix + i, value);

                insertList.push({
                    'ix': ix + i,
                    'valueNew': value
                });
            }

            insertList.length && eventAdd(itc, 'model-insert', insertList);

            return true;
        };

        /**
         * Removes a given count of values from the list starting at the given index, then adds new values starting at the same place
         *
         * @param {number} ix index of a first value to splice
         * @param {number} count values to splice count
         */
        var splice = function ModelList_splice(itc, ix, count, value) {
            if (typeof ix !== 'number' || ix < 0) {
                return false;
            }

            if (typeof count !== 'number' || count < 0) {
                count = itc.list.length - ix;
            }

            var valueList = Array.prototype.slice.call(arguments, 3);
            var insertList = [];

            var valueDeleteList = itc.list.slice(ix, ix + count);
            var deleteList = [];

            itc.list.splice.apply(itc.list, [ix, count].concat(valueList));

            for (var i = 0, l = valueList.length; i < l; i++) {
                value = valueList[i];

                valueOn(itc, ix + i, value);

                insertList.push({
                    'ix': ix + i,
                    'valueNew': value
                });
            }

            insertList.length && eventAdd(itc, 'model-insert', insertList);

            for (var i = 0, l = valueDeleteList.length; i < l; i++) {
                value = valueDeleteList[i];

                valueOff(itc, ix + i, value);

                deleteList.push({
                    'ix': ix + i,
                    'valueOld': value
                });
            }

            deleteList.length && eventAdd(itc, 'model-delete', deleteList);

            return true;
        };

        /**
         * Returns the list length
         */
        var length = function ModelList_length(itc) {
            return itc.list.length;
        };

        /**
         * Returns an index of the given value
         *
         * @param {mixed} value value to return index of
         */
        var indexOf = function ModelList_indexOf(itc, value) {
            return itc.list.indexOf(value);

            return true;
        };

        /**
         * Attaches event forwarding
         *
         * @param {number} ix index of the value to attach
         * @param {mixed} value value to attach
         */
        var valueOn = function ModelList_valueOn(itc, ix, value) {
            if (value && typeof value === 'object' && 'on' in value && typeof value.on === 'function') {
                value.on(
                    [
                        'model-insert',
                        'model-update',
                        'model-delete',
                        'model-forward'
                    ],
                    itc.valueListenerList[ix] = function ModelList_valueOn_valueListener(event, dataList) {
                        eventAdd(
                            itc,
                            'model-forward',
                            [{
                                'ix': ix,
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
         * @param {number} ix index of the value to detach
         * @param {mixed} value value to detach
         */
        var valueOff = function ModelList_valueOff(itc, ix, value) {
            if (itc.valueListenerList[ix]) {
                value.off(
                    [
                        'model-insert',
                        'model-update',
                        'model-delete',
                        'model-forward'
                    ],
                    itc.valueListenerList[ix]);

                itc.valueListenerList[ix] = null;
            }

            return true;
        };

        /**
         * Adds the event to the event group list and queues event flush
         *
         * @param {string} event event name
         * @param {dataList} event data list
         */
        var eventAdd = function ModelList_eventAdd(itc, event, dataList) {
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
        var eventFlush = function ModelList_eventFlush(itc) {
            var eventGroup;

            for (var i = 0, l = itc.eventGroupList.length; i < l; i++) {
                eventGroup = itc.eventGroupList[i];
                eventGroup.dataList.length && itc.observable.trigger(eventGroup.event, eventGroup.dataList);
            }

            itc.eventGroupList = [];

            return true;
        };

        /**
         * Returns raw list
         */
        var toArray = function ModelList_toArray(itc) {
            return itc.list;
        };

        /**
         *
         */
        var toString = function ModelList_toString(itc) {
            return 'ennovum.model.ModelList';
        };

        //
        return ModelList;
    });
