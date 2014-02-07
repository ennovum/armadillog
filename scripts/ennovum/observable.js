'use strict';

define(
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
            var eventHandlerMap;

            /**
             * Initializes instance
             */
            var init = function Observable_init() {
                eventHandlerMap = {};

                return true;
            };

            /**
             * Binds events with a function
             *
             * @param {mixed} eventNames list of or a single event name
             * @param {function} fn handler function
             * @param {mixed} ctx handler function context
             */
            var on = this.on = function Observable_on(eventNames, fn, ctx, args) {
                return handlerAddAll(eventNames, fn, ctx, args);
            };

            /**
             * Unbinds events from a function
             *
             * @param {mixed} eventNames list of or a single event name
             * @param {function} fn handler function
             * @param {mixed} ctx handler function context
             */
            var off = this.off = function Observable_off(eventNames, fn, ctx, args) {
                return handlerRemoveAll(eventNames, fn, ctx, args);
            };

            /**
             * Triggers events
             *
             * @param {mixed} eventNames list of or a single event name
             * @param {mixed} data event data
             */
            var trigger = this.trigger = function Observable_trigger(eventNames, data) {
                return handlersTriggerAll(eventNames, data);
            };

            /**
             *
             */
            var handlerAddAll = function Observable_handlerAddAll(eventNames, fn, ctx, args) {
                eventNames = Array.isArray(eventNames) ? eventNames : [eventNames];

                for (var i = 0, l = eventNames.length; i < l; i++) {
                    handlerAdd(eventNames[i], fn, ctx, args);
                }

                return true;
            };

            /**
             *
             */
            var handlerAdd = function Observable_handlerAdd(eventName, fn, ctx, args) {
                var handler = {
                    fn: fn,
                    ctx: ctx,
                    args: args
                };

                if (!(eventName in eventHandlerMap)) {
                    eventHandlerMap[eventName] = [];
                }

                eventHandlerMap[eventName].push(handler);

                return true;
            };

            /**
             *
             */
            var handlerRemoveAll = function Observable_handlerRemoveAll(eventNames, fn, ctx, args) {
                eventNames = Array.isArray(eventNames) ? eventNames : [eventNames];

                for (var i = 0, l = eventNames.length; i < l; i++) {
                    handlerRemove(eventNames[i], fn, ctx, args);
                }

                return true;
            };

            /**
             *
             */
            var handlerRemove = function Observable_handlerRemove(eventName, fn, ctx, args) {
                var handlerIx = handlerIndexOf(eventName, fn, ctx, args);

                if (!~handlerIx) {
                    console.error('Observable', 'handlerRemove', 'no such event handler', eventName, fn, ctx, args);
                    return false;
                }

                eventHandlerMap[eventName].splice(handlerIx, 1);

                return true;
            };

            /**
             *
             */
            var handlerIndexOf = function Observable_handlerIndexOf(eventName, fn, ctx, args) {
                var handlers = eventHandlerMap[eventName] || [];
                var handler;

                for (var i = 0, l = handlers.length; i < l; i++) {
                    handler = handlers[i];

                    if (handler.fn === fn && handler.ctx === ctx) {
                        return i;
                    }
                }

                return -1;
            };

            /**
             *
             */
            var handlersTriggerAll = function Observable_handlersTriggerAll(eventNames, data) {
                eventNames = Array.isArray(eventNames) ? eventNames : [eventNames];

                for (var i = 0, l = eventNames.length; i < l; i++) {
                    handlersTrigger(eventNames[i], data);
                }

                return true;
            };

            /**
             *
             */
            var handlersTrigger = function Observable_handlersTrigger(eventName, data) {
                if (!(eventName in eventHandlerMap) || eventHandlerMap[eventName].length === 0) {
                    return false;
                }

                for (var i = 0, l = eventHandlerMap[eventName].length; i < l; i++) {
                    handlerTrigger(eventName, eventHandlerMap[eventName][i], data);
                }
            };

            /**
             *
             */
            var handlerTrigger = function Observable_handlerTrigger(eventName, handler, data) {
                try {
                    handler.fn.apply(handler.ctx, [eventName, data].concat(handler.args));
                }
                catch (err) {
                    console.error('Observable', 'handlerTrigger', 'event handler run error', err);
                }
            };

            /**
             *
             */
            var toString = this.toString = function Observable_toString() {
                return 'ennovum.Observable';
            };

            //
            init.apply(this, arguments);
        };

        //
        return Observable;
    });
