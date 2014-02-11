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

            this.handle = handle.bind(this, itc);
            this.unhandle = unhandle.bind(this, itc);
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
        var handle = function Observable_handle(itc, eventNames, fn, fnCtx, fnArgs) {
            return handleEvents(itc, eventNames, fn, fnCtx, fnArgs);
        };

        /**
         * Unbinds events from a function
         *
         * @param {mixed} eventNames list of or a single event name
         * @param {function} fn handler function
         * @param {mixed} fnCtx handler function context
         */
        var unhandle = function Observable_unhandle(itc, eventNames, fn, fnCtx) {
            return unhandleEvents(itc, eventNames, fn, fnCtx);
        };

        /**
         * Triggers events
         *
         * @param {mixed} eventNames list of or a single event name
         * @param {mixed} data event data
         */
        var trigger = function Observable_trigger(itc, eventNames, data) {
            return triggerEventsHandlers(itc, eventNames, data);
        };

        /**
         *
         */
        var handleEvents = function Observable_handleEvents(itc, eventNames, fn, fnCtx, fnArgs) {
            eventNames = Array.isArray(eventNames) ? eventNames : [eventNames];

            for (var i = 0, l = eventNames.length; i < l; i++) {
                handleEvent(itc, eventNames[i], fn, fnCtx, fnArgs);
            }

            return true;
        };

        /**
         *
         */
        var handleEvent = function Observable_handleEvent(itc, eventName, fn, fnCtx, fnArgs) {
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
        var unhandleEvents = function Observable_unhandleEvents(itc, eventNames, fn, fnCtx) {
            eventNames = Array.isArray(eventNames) ? eventNames : [eventNames];

            for (var i = 0, l = eventNames.length; i < l; i++) {
                unhandleEvent(itc, eventNames[i], fn, fnCtx);
            }

            return true;
        };

        /**
         *
         */
        var unhandleEvent = function Observable_unhandleEvent(itc, eventName, fn, fnCtx) {
            var handlerIx = handlerIndexOf(itc, eventName, fn, fnCtx);

            if (!~handlerIx) {
                console.error('Observable', 'unhandleEvent', 'no such event handler', eventName, fn, fnCtx);
                return false;
            }

            itc.eventHandlerMap[eventName].splice(handlerIx, 1);

            return true;
        };

        /**
         *
         */
        var handlerIndexOf = function Observable_handlerIndexOf(itc, eventName, fn, fnCtx) {
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
        var triggerEventsHandlers = function Observable_triggerEventsHandlers(itc, eventNames, data) {
            eventNames = Array.isArray(eventNames) ? eventNames : [eventNames];

            for (var i = 0, l = eventNames.length; i < l; i++) {
                triggerEventHandlers(itc, eventNames[i], data);
            }

            return true;
        };

        /**
         *
         */
        var triggerEventHandlers = function Observable_triggerEventHandlers(itc, eventName, data) {
            if (!(eventName in itc.eventHandlerMap) || itc.eventHandlerMap[eventName].length === 0) {
                return false;
            }

            for (var i = 0, l = itc.eventHandlerMap[eventName].length; i < l; i++) {
                triggerEventHandler(itc, eventName, itc.eventHandlerMap[eventName][i], data);
            }
        };

        /**
         *
         */
        var triggerEventHandler = function Observable_triggerEventHandler(itc, eventName, handler, data) {
            try {
                handler.fn.apply(handler.fnCtx, (handler.fnArgs || []).concat([eventName, data]));
            }
            catch (err) {
                console.error('Observable', 'triggerEventHandler', 'event handler run error', err);
            }
        };

        //
        return Observable;
    });
