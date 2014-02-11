'use strict';

define(
    [
        'ennovum.environment',
        'ennovum.utils',
        'ennovum.worker.WorkerFunction'
    ],
    function (
        environment,
        utils,
        WorkerFunction
    ) {
        //
        var WORKER_TEXT_LINE_SPLITTER = new WorkerFunction(
            function (data, success, error) {
                var lineList = data.text.split(/\r?\n/g);
                var ix = 0;
                var length = lineList.length;
                var lengthOriginal = length;

                if (data.limit && length > Math.abs(data.limit)) {
                    if (data.limit < 0) {
                        ix = Math.max(0, lineList.length + data.limit);
                    }
                    else {
                        length = Math.min(lineList.length, data.limit);
                    }
                }

                for (var i = ix, l = length; i < l; i++) {
                    success(
                        {
                            'ix': i - ix,
                            'text': lineList[i]
                        },
                        null);
                }

                success(
                    {
                        'count': length - ix,
                        'countOriginal': lengthOriginal
                    },
                    null);
        });

        /**
         *
         */
        var run = function textLineSplitter_run(data, additional, fnReady, fnError, fnCtx, fnArgs) {
            return WORKER_TEXT_LINE_SPLITTER.run(data, additional, fnReady, fnError, fnCtx, fnArgs);
        };

        //
        return {
            run: run
        };
    });
