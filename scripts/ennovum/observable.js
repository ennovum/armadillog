'use strict';

window.define && define(
    [
        'ennovum.Environment',
        'ennovum.Utils'
    ],
    function (
        mEnvironment,
        mUtils
    ) {
/* ==================================================================================================== */

// debug spy switch
var DEBUG = false;

/**
 * Observable interface
 */
var iObservable = {
    'on': function (event, callback) {},
    'off': function (event, callback) {},
    'trigger': function (event) {}
};

/**
 * Observable constructor
 */
var Observable = function Observable() {
    this.init.apply(this, arguments);
    DEBUG && mUtils.debug.spy(this);
    return mUtils.obj.implement({}, this, iObservable);
};

/**
 * Observable prototype
 */
Observable.prototype = {

    /**
     * Initializes instance
     */
    init: function Observable_init() {
        this.eventsMap = {};

        return true;
    },

    /**
     * Binds events with a callback
     *
     * @param {mixed} eventList list of or a single event name
     * @param {function} callback callback to bind with events
     */
    on: function Observable_on(eventList, callback) {
        if (!Array.isArray(eventList)) {
            eventList = [eventList];
        }

        var event;

        for (var i = 0, l = eventList.length; i < l; i++) {
            event = eventList[i];

            if (!(event in this.eventsMap)) {
                this.eventsMap[event] = [];
            }

            this.eventsMap[event].push(callback);
        }

        return true;
    },

    /**
     * Unbinds events from a callback
     *
     * @param {mixed} eventList list of or a single event name
     * @param {function} callback callback to unbind from events
     */
    off: function Observable_off(eventList, callback) {
        if (!Array.isArray(eventList)) {
            eventList = [eventList];
        }

        var event;

        for (var i = 0, l = eventList.length; i < l; i++) {
            event = eventList[i];

            if (!(event in this.eventsMap) || this.eventsMap[event].length === 0) {
                console.error('Observable', 'off', 'list of event handlers is empty', event);
                return false;
            }

            var callbackIdx = this.eventsMap[event].indexOf(callback);
            if (callbackIdx === -1) {
                console.error('Observable', 'off', 'no such event handler', event, callback);
                return false;
            }

            this.eventsMap[event].splice(callbackIdx, 1);
        }

        return true;
    },

    /**
     * Triggers events
     *
     * @param {mixed} eventList list of or a single event name
     */
    trigger: function Observable_trigger(eventList, data) {
        if (!Array.isArray(eventList)) {
            eventList = [eventList];
        }

        var event;
        var handler;

        for (var i = 0, l = eventList.length; i < l; i++) {
            event = eventList[i];

            if (!(event in this.eventsMap) || this.eventsMap[event].length === 0) {
                continue;
            }

            for (var i = 0, l = this.eventsMap[event].length; i < l; i++) {
                handler = this.eventsMap[event][i];

                try {
                    handler.apply(handler, [event, data]);
                }
                catch (err) {
                    console.error('Observable', 'trigger', 'event handler run error', err);
                }
            }
        }

        return true;
    },

    /**
     *
     */
    toString: function Observable_toString() {
        return 'ennovum.Observable';
    }

};

/* ==================================================================================================== */
        return {
            'Observable': Observable,
            'iObservable': iObservable
        };
    });
