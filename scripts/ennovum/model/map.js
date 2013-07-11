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

// debug spy switch
var DEBUG = false;

/**
 * ModelMap interface
 */
var iModelMap = {
    'get': function (key) {},
    'set': function (key, value) {},
    'del': function (key) {},
    'has': function (key) {},
    'toMap': function () {},
    'toString': function () {}
};

/**
 * ModelMap constructor
 */
var ModelMap = function ModelMap() {
    this.init.apply(this, arguments);
    DEBUG && mUtils.debug.spy(this);
    return mUtils.obj.implement({}, this, [iModelMap, mObservable.iObservable, mQueue.iQueue]);
};

/**
 * ModelMap prototype
 */
ModelMap.prototype = {

    /**
     * Initializes instance
     */
    init: function ModelMap_init() {
        this.oObservable = mUtils.obj.mixin(this, new mObservable.Observable());
        this.oQueue = mUtils.obj.mixin(this, new mQueue.Queue());

        this.map = {};

        this.eventGroupList = [];
        this.flushQueued = false;
        this.valueListenerMap = {};

        if (arguments.length) {
            this.set.apply(this, arguments);
        }

        return true;
    },

    /**
     * Returns a value at the given key
     *
     * @param {string} key key of the value to return
     */
    get: function ModelMap_get(key) {
        return this.map[key];
    },

    /**
     * Sets the given values at the given keys
     *
     * @param {string} key key of the value to be set
     * @param {mixed} value value to be set
     */
    set: function ModelMap_set(key, value) {
        var insertList = [];
        var updateList = [];

        for (var i = 0, l = arguments.length; i < l; i += 2) {
            key = '' + arguments[i];
            value = arguments[i + 1];

            if (key in this.map) {
                var valueOld = this.map[key];

                if (value !== valueOld) {
                    this.map[key] = value;

                    this.valueOff(key, valueOld);
                    this.valueOn(key, value);

                    updateList.push({
                        'key': key,
                        'valueNew': value,
                        'valueOld': valueOld
                    });
                }
            }
            else {
                this.map[key] = value;

                this.valueOn(key, value);

                insertList.push({
                    'key': key,
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
     * Removes a value at the given key
     *
     * @param {string} key key of the value to be deleted
     */
    del: function ModelMap_del(key) {
        var deleteList = [];

        for (var i = 0, l = arguments.length; i < l; i++) {
            key = '' + arguments[i];

            if (key in this.map) {
                var valueOld = this.map[key];

                delete this.map[key];

                this.valueOff(key, valueOld);

                deleteList.push({
                    'key': key,
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
     * Checks if the given key exists
     *
     * @param {string} key key to be checked
     */
    has: function ModelMap_has(key) {
        for (var i = 0, l = arguments.length; i < l; i++) {
            key = '' + arguments[i];

            if (key in this.map) {
                return true;
            }
        }

        return false;
    },

    /**
     * Attaches event forwarding
     *
     * @param {number} key key of the value to attach
     * @param {mixed} value value to attach
     */
    valueOn: function ModelMap_valueOn(key, value) {
        if (value && typeof value === 'object' && 'on' in value && typeof value.on === 'function') {
            value.on(
                [
                    'model-insert',
                    'model-update',
                    'model-delete',
                    'model-forward'
                ],
                this.valueListenerMap[key] = function ModelMap_valueOn_valueListener(event, dataList) {
                    this.eventAdd(
                        'model-forward',
                        [{
                            'key': key,
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
     * @param {number} key key of the value to detach
     * @param {mixed} value value to detach
     */
    valueOff: function ModelMap_valueOff(key, value) {
        if (this.valueListenerMap[key]) {
            value.off(
                [
                    'model-insert',
                    'model-update',
                    'model-delete',
                    'model-forward'
                ],
                this.valueListenerMap[key]);

            this.valueListenerMap[key] = null;
        }

        return true;
    },

    /**
     * Adds the event to the event group list and queues event flush
     *
     * @param {string} event event name
     * @param {dataList} event data list
     */
    eventAdd: function ModelMap_eventAdd(event, dataList) {
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
    eventFlush: function ModelMap_eventFlush() {
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
     * Returns raw map
     */
    toMap: function ModelList_toMap() {
        return this.map;
    },

    /**
     *
     */
    toString: function ModelMap_toString() {
        return 'ennovum.model.ModelMap';
    }

};

/* ==================================================================================================== */
        return {
            'ModelMap': ModelMap,
            'iModelMap': iModelMap
        };
    });
