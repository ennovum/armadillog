'use strict';

window.define && define(
    [
        'ennovum.environment',
        'ennovum.worker.WorkerFunction',
        'ennovum.worker.WorkerDownloader'
    ],
    function (
        environment,
        WorkerFunction,
        WorkerDownloader
    ) {
        return {
            'WorkerFunction': WorkerFunction,
            'WorkerDownloader': WorkerDownloader
        };
    });
