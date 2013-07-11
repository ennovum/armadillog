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
 * ModelValue interface
 */
var iModelValue = {
    'get': function () {},
    'set': function (value) {},
    'toString': function () {}
};

/**
 * ModelValue constructor
 */
var ModelValue = function ModelValue() {
    this.init.apply(this, arguments);
    DEBUG && mUtils.debug.spy(this);
    return mUtils.obj.implement({}, this, [iModelValue, mObservable.iObservable, mQueue.iQueue]);
};

/**
 * ModelValue prototype
 */
ModelValue.prototype = {

    /**
     * Initializes instance
     */
    init: function ModelValue_init(value) {
        this.oObservable = mUtils.obj.mixin(this, new mObservable.Observable());
        this.oQueue = mUtils.obj.mixin(this, new mQueue.Queue());

        this.eventGroupList = [];
        this.flushQueued = false;
        this.valueListener = null;

        if (value !== undefined) {
            this.set(value);
        }

        return true;
    },

    /**
     * Returns the value
     */
    get: function ModelValue_get() {
        return this.value;
    },

    /**
     * Sets the value
     *
     * @param {mixed} value item's value
     */
    set: function ModelValue_set(value) {
        var valueOld = this.value;

        if (value !== valueOld) {
            this.value = value;

            this.valueOff(valueOld);
            this.valueOn(value);

            this.eventAdd(
                'model-update',
                [{
                    'valueNew': value,
                    'valueOld': valueOld
                }]);
        }

        return true;
    },

    /**
     * Attaches event forwarding
     *
     * @param {mixed} value value to attach
     */
    valueOn: function ModelValue_valueOn(value) {
        if (value && typeof value === 'object' && 'on' in value && typeof value.on === 'function') {
            value.on(
                [
                    'model-insert',
                    'model-update',
                    'model-delete',
                    'model-forward'
                ],
                this.valueListener = function ModelValue_valueOn_valueListener(event, dataList) {
                    this.eventAdd(
                        'model-forward',
                        [{
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
     * @param {mixed} value value to detach
     */
    valueOff: function ModelValue_valueOff(value) {
        if (this.valueListener) {
            value.off(
                [
                    'model-insert',
                    'model-update',
                    'model-delete',
                    'model-forward'
                ],
                this.valueListener);

            this.valueListener = null;
        }

        return true;
    },

    /**
     * Adds the event to the event group list and queues event flush
     *
     * @param {string} event event name
     * @param {dataList} event data list
     */
    eventAdd: function ModelValue_eventAdd(event, dataList) {
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
    eventFlush: function ModelValue_eventFlush() {
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
     *
     */
    toString: function ModelValue_toString() {
        return 'ennovum.model.ModelValue';
    }

};

/* ==================================================================================================== */
        return {
            'ModelValue': ModelValue,
            'iModelValue': iModelValue
        };
    });
