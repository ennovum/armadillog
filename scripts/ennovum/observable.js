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
            var itc = {
                eventHandlerMap: {}
            };

            this.on = on.bind(this, itc);
            this.off = off.bind(this, itc);
            this.trigger = trigger.bind(this, itc);

            return this;
        };

        /**
         * Binds events with a function
         *
         * @param {mixed} eventNames list of or a single event name
         * @param {function} fn handler function
         * @param {mixed} fnCtx handler function context
         */
        var on = function Observable_on(itc, eventNames, fn, fnCtx, fnArgs) {
            return handlerAddAll(itc, eventNames, fn, fnCtx, fnArgs);
        };

        /**
         * Unbinds events from a function
         *
         * @param {mixed} eventNames list of or a single event name
         * @param {function} fn handler function
         * @param {mixed} fnCtx handler function context
         */
        var off = function Observable_off(itc, eventNames, fn, fnCtx, fnArgs) {
            return handlerRemoveAll(itc, eventNames, fn, fnCtx, fnArgs);
        };

        /**
         * Triggers events
         *
         * @param {mixed} eventNames list of or a single event name
         * @param {mixed} data event data
         */
        var trigger = function Observable_trigger(itc, eventNames, data) {
            return handlersTriggerAll(itc, eventNames, data);
        };

        /**
         *
         */
        var handlerAddAll = function Observable_handlerAddAll(itc, eventNames, fn, fnCtx, fnArgs) {
            eventNames = Array.isArray(eventNames) ? eventNames : [eventNames];

            for (var i = 0, l = eventNames.length; i < l; i++) {
                handlerAdd(itc, eventNames[i], fn, fnCtx, fnArgs);
            }

            return true;
        };

        /**
         *
         */
        var handlerAdd = function Observable_handlerAdd(itc, eventName, fn, fnCtx, fnArgs) {
            var handler = {
                fn: fn,
                fnCtx: fnCtx,
                fnArgs: fnArgs
            };

            if (!(eventName in itc.eventHandlerMap)) {
                itc.eventHandlerMap[eventName] = [];
            }

            itc.eventHandlerMap[eventName].push(handler);

            return true;
        };

        /**
         *
         */
        var handlerRemoveAll = function Observable_handlerRemoveAll(itc, eventNames, fn, fnCtx, fnArgs) {
            eventNames = Array.isArray(eventNames) ? eventNames : [eventNames];

            for (var i = 0, l = eventNames.length; i < l; i++) {
                handlerRemove(itc, eventNames[i], fn, fnCtx, fnArgs);
            }

            return true;
        };

        /**
         *
         */
        var handlerRemove = function Observable_handlerRemove(itc, eventName, fn, fnCtx, fnArgs) {
            var handlerIx = handlerIndexOf(itc, eventName, fn, fnCtx, fnArgs);

            if (!~handlerIx) {
                console.error('Observable', 'handlerRemove', 'no such event handler', eventName, fn, fnCtx, fnArgs);
                return false;
            }

            itc.eventHandlerMap[eventName].splice(handlerIx, 1);

            return true;
        };

        /**
         *
         */
        var handlerIndexOf = function Observable_handlerIndexOf(itc, eventName, fn, fnCtx, fnArgs) {
            var handlers = itc.eventHandlerMap[eventName] || [];
            var handler;

            for (var i = 0, l = handlers.length; i < l; i++) {
                handler = handlers[i];

                if (handler.fn === fn && handler.fnCtx === fnCtx) {
                    return i;
                }
            }

            return -1;
        };

        /**
         *
         */
        var handlersTriggerAll = function Observable_handlersTriggerAll(itc, eventNames, data) {
            eventNames = Array.isArray(eventNames) ? eventNames : [eventNames];

            for (var i = 0, l = eventNames.length; i < l; i++) {
                handlersTrigger(itc, eventNames[i], data);
            }

            return true;
        };

        /**
         *
         */
        var handlersTrigger = function Observable_handlersTrigger(itc, eventName, data) {
            if (!(eventName in itc.eventHandlerMap) || itc.eventHandlerMap[eventName].length === 0) {
                return false;
            }

            for (var i = 0, l = itc.eventHandlerMap[eventName].length; i < l; i++) {
                handlerTrigger(itc, eventName, itc.eventHandlerMap[eventName][i], data);
            }
        };

        /**
         *
         */
        var handlerTrigger = function Observable_handlerTrigger(itc, eventName, handler, data) {
            try {
                handler.fn.apply(handler.fnCtx, (handler.fnArgs || []).concat([eventName, data]));
            }
            catch (err) {
                console.error('Observable', 'handlerTrigger', 'event handler run error', err);
            }
        };

        //
        return Observable;
    });
