'use strict';

define(
    [
        'ennovum.environment',
        'ennovum.composition',
        'ennovum.utils',
        'ennovum.Queue'
    ],
    function (
        environment,
        composition,
        utils,
        Queue
    ) {
        /**
         * WorkerFunction constructor
         */
        var WorkerFunction = function WorkerFunction(fn, config) {
            switch (false) {
                case fn && typeof fn === 'function':
                case !config || typeof config === 'object':
                    console.error('WorkerFunction', 'invalid input');
                    return false;
                    break;
            }

            var itc = {
                queue: undefined,

                config: {},
                fn: fn,

                widSeq: 0,
                workMap: {},

                sourceURL: undefined,

                worker: undefined
            };

            this.configure = configure.bind(this, itc);
            this.destroy = destroy.bind(this, itc);
            this.run = run.bind(this, itc);

            this.toString = toString.bind(this, itc);

            init.call(this, itc, config);

            return this;
        };

        //
        var SOURCE = [
            '"use strict"',
            'var ready = function (wid) {',
            '    return function (data) {',
            '        postMessage(',
            '            {',
            '                "wid": wid,',
            '                "success": true,',
            '                "data": data',
            '            },',
            '            undefined);',
            '    };',
            '};',
            'var error = function (wid) {',
            '    return function (data) {',
            '        postMessage(',
            '            {',
            '                "wid": wid,',
            '                "success": false,',
            '                "data": data',
            '            },',
            '            undefined);',
            '    };',
            '};',
            'this.onmessage = function(event){',
            '    ({{function}}).call(this, event.data.data, ready(event.data.wid), error(event.data.wid));',
            '};',
        ].join('\n');

        //
        var DISABLE_NATIVE_WORKER_STORAGE_NAME = 'disableNativeWorker';

        /**
         *
         */
        var init = function WorkerFunction_init(itc, config) {
            itc.queue = composition.mixin(this, new Queue());

            configure(itc, config || {});

            itc.sourceURL = URL.createObjectURL(
                new Blob([SOURCE.replace('{{function}}', itc.fn.toString())],
                {'type': 'text/javascript'}));

            try {
                itc.worker = new Worker(itc.sourceURL);

                itc.worker.onmessage = function WorkerFunction_workerInit_onmessage(event) {
                    messageHandler(itc, event.data.wid, event.data.success, event.data.data);
                };

                itc.worker.onerror = function WorkerFunction_workerInit_onmessage(event) {
                    errorHandler(itc, event.data.wid, event.message, event.filename, event.lineno);
                };
            }
            catch (err) {
                itc.worker = null;
            }

            return true;
        };

        /**
         *
         */
        var configure = function WorkerFunction_configure(itc, config) {
            switch (false) {
                case typeof config === 'object':
                    console.error('WorkerFunction', 'configure', 'invalid input');
                    return false;
                    break;
            }

            if (config && 'disableNativeWorker' in config) {
                itc.config['disableNativeWorker'] = !!config['disableNativeWorker'];
            }

            return true;
        };

        /**
         * Destroys instance
         */
        var destroy = function WorkerFunction_destroy(itc) {
            URL.revokeObjectURL(itc.sourceURL);

            itc.worker.terminate();

            return true;
        };

        /**
         * Runs the worker
         *
         * @param {mixed} data Message data
         */
        var run = function WorkerFunction_run(itc, data, additional, ready, error, ctx) {
            switch (false) {
                case !ready || typeof ready === 'function':
                case !error || typeof error === 'function':
                    console.error('WorkerFunction', 'run', 'invalid input');
                    return false;
                    break;
            }

            var wid = '' + (itc.widSeq++);
            var work = {
                'ctx': ctx || null,
                'additional': additional || null,
                'ready': ready || null,
                'error': error || null
            };

            itc.workMap[wid] = work;

            itc.queue.queue(
                function () {
                    if (!itc.worker || itc.config.disableNativeWorker || localStorage.getItem(DISABLE_NATIVE_WORKER_STORAGE_NAME)) {
                        itc.fn(
                            data,
                            function (data) {
                                messageHandler(itc, wid, true, data);
                            },
                            function (data) {
                                messageHandler(itc, wid, false, data);
                            });
                    }
                    else {
                        itc.worker.postMessage(
                            {
                                'wid': wid,
                                'data': data
                            });
                    }
                },
                true);

            return true;
        };

        /**
         * Handles worker message
         *
         * @param {mixed} data Message data
         */
        var messageHandler = function WorkerFunction_messageHandler(itc, wid, success, data) {
            var work = itc.workMap[wid];

            if (success) {
                if (work.ready) {
                    work.ready.call(work.ctx, data, work.additional);
                }
            }
            else {
                if (work.error) {
                    work.error.call(work.ctx, data, work.additional);
                }
            }

            return true;
        };

        /**
         * Handles worker error
         *
         * @param {mixed} data Error data
         */
        var errorHandler = function WorkerFunction_errorHandler(itc, wid, message, filename, lineno) {
            console.error(message, filename, lineno);

            var work = itc.workMap[wid];

            if (work.error) {
                work.error.call(work.error, {'error': message});
            }

            return true;
        };

        /**
         *
         */
        var toString = function WorkerFunction_toString(itc) {
            return 'ennovum.workerFunction';
        };

        //
        return WorkerFunction;
    });
