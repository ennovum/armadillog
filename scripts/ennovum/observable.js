'use strict';

window.define && define(
    [
        'ennovum.environment',
        'ennovum.utils'
    ],
    function (
        environment,
        utils
    ) {
        /**
         * Observable constructor
         */
        var Observable = function Observable() {
            var eventsMap;

            /**
             * Initializes instance
             */
            var init = function Observable_init() {
                eventsMap = {};

                return true;
            };

            /**
             * Binds events with a callback
             *
             * @param {mixed} eventList list of or a single event name
             * @param {function} callback callback to bind with events
             */
            var on = this.on = function Observable_on(eventList, callback) {
                if (!Array.isArray(eventList)) {
                    eventList = [eventList];
                }

                var event;

                for (var i = 0, l = eventList.length; i < l; i++) {
                    event = eventList[i];

                    if (!(event in eventsMap)) {
                        eventsMap[event] = [];
                    }

                    eventsMap[event].push(callback);
                }

                return true;
            };

            /**
             * Unbinds events from a callback
             *
             * @param {mixed} eventList list of or a single event name
             * @param {function} callback callback to unbind from events
             */
            var off = this.off = function Observable_off(eventList, callback) {
                if (!Array.isArray(eventList)) {
                    eventList = [eventList];
                }

                var event;

                for (var i = 0, l = eventList.length; i < l; i++) {
                    event = eventList[i];

                    if (!(event in eventsMap) || eventsMap[event].length === 0) {
                        console.error('Observable', 'off', 'list of event handlers is empty', event);
                        return false;
                    }

                    var callbackIdx = eventsMap[event].indexOf(callback);
                    if (callbackIdx === -1) {
                        console.error('Observable', 'off', 'no such event handler', event, callback);
                        return false;
                    }

                    eventsMap[event].splice(callbackIdx, 1);
                }

                return true;
            };

            /**
             * Triggers events
             *
             * @param {mixed} eventList list of or a single event name
             */
            var trigger = this.trigger = function Observable_trigger(eventList, data) {
                if (!Array.isArray(eventList)) {
                    eventList = [eventList];
                }

                var event;
                var handler;

                for (var i = 0, l = eventList.length; i < l; i++) {
                    event = eventList[i];

                    if (!(event in eventsMap) || eventsMap[event].length === 0) {
                        continue;
                    }

                    for (var i = 0, l = eventsMap[event].length; i < l; i++) {
                        handler = eventsMap[event][i];

                        try {
                            handler.apply(handler, [event, data]);
                        }
                        catch (err) {
                            console.error('Observable', 'trigger', 'event handler run error', err);
                        }
                    }
                }

                return true;
            };

            /**
             *
             */
            var toString = this.toString = function Observable_toString() {
                return 'ennovum.Observable';
            };

            //
            init.apply(this, arguments);
            // utils.debug.spy(this);
        };

        //
        return Observable;
    });
