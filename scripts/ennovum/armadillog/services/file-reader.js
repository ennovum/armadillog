'use strict';

define(
    [
        'ennovum.environment',
        'ennovum.utils',
        'ennovum.worker.WorkerDownloader'
    ],
    function (
        environment,
        utils,
        WorkerDownloader
    ) {
        //
        var workerFileReader = new WorkerDownloader();

        /**
         *
         */
        var run = function fileReader_run(data, fnReady, fnError, fnCtx, fnArgs) {
            return workerFileReader.run(data, fnReady, fnError, fnCtx, fnArgs);
        };

        //
        return {
            run: run
        };
    });
