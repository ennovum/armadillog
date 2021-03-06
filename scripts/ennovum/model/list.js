'use strict';

window.define && define(
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
/* ==================================================================================================== */

/**
 * ModelList interface
 */
var iModelList = {
    'getAt': function (index) {},
    'setAt': function (index, value) {},
    'delAt': function (index) {},
    'push': function (value) {},
    'pop': function () {},
    'shift': function () {},
    'unshift': function (value) {},
    'splice': function (index, count) {},
    'length': function () {},
    'indexOf': function (value) {},
    'toArray': function () {},
    'toString': function () {}
};

/**
 * ModelList constructor
 */
var ModelList = function ModelList() {
    this.init.apply(this, arguments);
    // mUtils.debug.spy(this);
    return mUtils.obj.implement({}, this, [iModelList, mObservable.iObservable, mQueue.iQueue]);
};

/**
 * ModelList prototype
 */
ModelList.prototype = {

    /**
     * Initializes instance
     */
    init: function ModelList_init() {
        this.oObservable = mUtils.obj.mixin(this, new mObservable.Observable());
        this.oQueue = mUtils.obj.mixin(this, new mQueue.Queue());

        this.list = [];

        this.eventGroupList = [];
        this.flushQueued = false;
        this.valueListenerList = [];

        if (arguments.length) {
            this.set.apply(this, arguments);
        }

        return true;
    },

    /**
     * Returns a value at the given index
     *
     * @param {number} index index of the value to return
     */
    getAt: function ModelList_getAt(index) {
        return this.list[index];
    },

    /**
     * Sets the given values at the given indexes
     *
     * @param {number} index index of the value to be set
     * @param {mixed} value value to be set
     */
    setAt: function ModelList_setAt(index, value) {
        var insertList = [];
        var updateList = [];

        for (var i = 0, l = arguments.length; i < l; i += 2) {
            index = ~~arguments[i];
            value = arguments[i + 1];

            if (index < this.list.length) {
                var valueOld = this.list[index];

                if (value !== valueOld) {
                    this.list[index] = value;

                    this.valueOff(index, valueOld);
                    this.valueOn(index, value);

                    updateList.push({
                        'index': index,
                        'valueNew': value,
                        'valueOld': valueOld
                    });
                }
            }
            else {
                this.list[index] = value;

                this.valueOn(index, value);

                insertList.push({
                    'index': index,
                    'valueNew': value
                });
            }
        }

        if (insertList.length) {
            this.eventAdd('model-insert', insertList);
        }

        if (updateList.length) {
            this.eventAdd('model-update', updateList);
        }

        return true;
    },

    /**
     * Removes a value at the given index
     *
     * @param {number} index index of the value to be deleted
     */
    delAt: function ModelList_delAt(index) {
        var deleteList = [];

        for (var i = 0, l = arguments.length; i < l; i++) {
            index = ~~arguments[i];

            if (index < this.list.length) {
                var valueOld = this.list[index];

                this.list[index] = value;

                this.valueOff(index, valueOld);

                deleteList.push({
                    'index': index,
                    'valueOld': valueOld
                });
            }
        }

        if (deleteList.length) {
            this.eventAdd('model-delete', deleteList);
        }

        return true;
    },

    /**
     * Pushes values to the list
     */
    push: function ModelList_push(/*, value1, ..., valueN*/) {
        var index = this.list.length;

        var insertValueList = Array.prototype.slice.call(arguments);
        var insertList = [];

        this.list.push.apply(this.list, arguments);

        for (var i = 0, l = insertValueList.length; i < l; i++) {
            this.valueOn(index + i, insertValueList[i]);

            insertList.push({
                'index': index + i,
                'valueNew': insertValueList[i]
            });
        }

        if (insertList.length) {
            this.eventAdd('model-insert', insertList);
        }

        return true;
    },

    /**
     * Pops a value from the list
     */
    pop: function ModelList_pop() {
        if (this.list.length === 0) {
            return false;
        }

        var index = this.list.length - 1;
        var valueOld = this.list.pop();

        this.valueOff(index, valueOld);

        this.eventAdd(
            'model-delete',
            [{
                'index': index,
                'valueOld': valueOld
            }]);

        return valueOld;
    },

    /**
     * Shifts a value from the list
     */
    shift: function ModelList_shift() {
        if (this.list.length === 0) {
            return false;
        }

        var index = 0;
        var valueOld = this.list.shift();

        this.valueOff(index, valueOld);

        this.eventAdd(
            'model-delete',
            [{
                'index': index,
                'valueOld': valueOld
            }]);

        return valueOld;
    },

    /**
     * Unshifts values to the list
     */
    unshift: function ModelList_unshift(/*, value1, ..., valueN*/) {
        var index = 0;

        var insertValueList = Array.prototype.slice.call(arguments);
        var insertList = [];

        this.list.unshift.apply(this.list, arguments);

        for (var i = 0, l = insertValueList.length; i < l; i++) {
            this.valueOn(index + i, insertValueList[i]);

            insertList.push({
                'index': index + i,
                'valueNew': insertValueList[i]
            });
        }

        if (insertList.length) {
            this.eventAdd('model-insert', insertList);
        }

        return true;
    },

    /**
     * Removes a given count of values from the list starting at the given index, then adds new values starting at the same place
     *
     * @param {number} index index of a first value to splice
     * @param {number} count values to splice count
     */
    splice: function ModelList_splice(index, count/*, value1, ..., valueN*/) {
        if (typeof index !== 'number' || index < 0) {
            return false;
        }

        if (typeof count !== 'number' || count < 0) {
            count = this.list.length - index;
        }

        var insertValueList = Array.prototype.slice.call(arguments, 2);
        var insertList = [];

        var deleteValueList = this.list.slice(index, index + count);
        var deleteList = [];

        this.list.splice.apply(this.list, arguments);

        for (var i = 0, l = insertValueList.length; i < l; i++) {
            this.valueOn(index + i, insertValueList[i]);

            insertList.push({
                'index': index + i,
                'valueNew': insertValueList[i]
            });
        }

        if (insertList.length) {
            this.eventAdd('model-insert', insertList);
        }

        for (var i = 0, l = deleteValueList.length; i < l; i++) {
            this.valueOff(index + i, deleteValueList[i]);

            deleteList.push({
                'index': index + i,
                'valueOld': deleteValueList[i]
            });
        }

        if (deleteList.length) {
            this.eventAdd('model-delete', deleteList);
        }

        return true;
    },

    /**
     * Returns the list length
     */
    length: function ModelList_length() {
        return this.list.length;
    },

    /**
     * Returns an index of the given value
     *
     * @param {mixed} value value to return index of
     */
    indexOf: function ModelList_indexOf(value) {
        return this.list.indexOf(value);

        return true;
    },

    /**
     * Attaches event forwarding
     *
     * @param {number} index index of the value to attach
     * @param {mixed} value value to attach
     */
    valueOn: function ModelList_valueOn(index, value) {
        if (value && typeof value === 'object' && 'on' in value && typeof value.on === 'function') {
            value.on(
                [
                    'model-insert',
                    'model-update',
                    'model-delete',
                    'model-forward'
                ],
                this.valueListenerList[index] = function ModelList_valueOn_valueListener(event, dataList) {
                    this.eventAdd(
                        'model-forward',
                        [{
                            'index': index,
                            'valueNew': value,
                            'event': event,
                            'dataList': dataList
                        }]);
                }.bind(this));
        }

        return true;
    },

    /**
     * Detaches event forwarding
     *
     * @param {number} index index of the value to detach
     * @param {mixed} value value to detach
     */
    valueOff: function ModelList_valueOff(index, value) {
        if (this.valueListenerList[index]) {
            value.off(
                [
                    'model-insert',
                    'model-update',
                    'model-delete',
                    'model-forward'
                ],
                this.valueListenerList[index]);

            this.valueListenerList[index] = null;
        }

        return true;
    },

    /**
     * Adds the event to the event group list and queues event flush
     *
     * @param {string} event event name
     * @param {dataList} event data list
     */
    eventAdd: function ModelList_eventAdd(event, dataList) {
        var eventGroup = this.eventGroupList[this.eventGroupList.length - 1] || null;
        if (!eventGroup || eventGroup.event !== event) {
            eventGroup = {
                'event': event,
                'dataList': []
            };
            this.eventGroupList.push(eventGroup);
        }

        eventGroup.dataList.push.apply(eventGroup.dataList, dataList);

        if (!this.flushQueued) {
            this.flushQueued = true;

            this.queue(function ModelMap_eventAdd_eventFlush() {
                this.flushQueued = false;
                this.eventFlush();

                this.dequeue();
            }.bind(this));
        }

        return true;
    },

    /**
     * Flushes events
     */
    eventFlush: function ModelList_eventFlush() {
        var eventGroupList = this.eventGroupList;
        this.eventGroupList = [];

        for (var i = 0, l = eventGroupList.length; i < l; i++) {
            if (eventGroupList[i].dataList.length) {
                this.trigger(eventGroupList[i].event, eventGroupList[i].dataList);
            }
        }

        return this.map;
    },

    /**
     * Returns raw list
     */
    toArray: function ModelList_toArray() {
        return this.list;
    },

    /**
     *
     */
    toString: function ModelList_toString() {
        return 'ennovum.model.ModelList';
    }

};

/* ==================================================================================================== */
        return {
            'ModelList': ModelList,
            'iModelList': iModelList
        };
    });
