'use strict';

window.define && define(
    [
        'ennovum.Environment',
        './function',
        './downloader'
    ],
    function (mEnvironment, mWorkerFunction, mWorkerDownloader) {
        return {
            'WorkerFunction': mWorkerFunction.WorkerFunction,
            'iWorkerFunction': mWorkerFunction.iWorkerFunction,
            'WorkerDownloader': mWorkerDownloader.WorkerDownloader,
            'iWorkerDownloader': mWorkerDownloader.iWorkerDownloader
        };
    });
