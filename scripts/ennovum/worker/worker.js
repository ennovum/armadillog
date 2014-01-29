'use strict';

window.define && define(
    [
        'ennovum.Environment',
        './function',
        './downloader'
    ],
    function (
        mEnvironment,
        mWorkerFunction,
        mWorkerDownloader
    ) {
        return {
            'WorkerFunction': mWorkerFunction.WorkerFunction,
            'WorkerDownloader': mWorkerDownloader.WorkerDownloader
        };
    });
