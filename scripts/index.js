'use strict';

require.config({
    'baseUrl': 'scripts',
    'packages': [
        {
            'name': 'Handlebars',
            'location': 'vendor',
            'main': 'handlebars-1.0.rc.1.js'
        },
        {
            'name': 'ennovum.environment',
            'location': 'ennovum',
            'main': 'environment.js'
        },
        {
            'name': 'ennovum.utils',
            'location': 'ennovum',
            'main': 'utils.js'
        },
        {
            'name': 'ennovum.Observable',
            'location': 'ennovum',
            'main': 'observable.js'
        },
        {
            'name': 'ennovum.Queue',
            'location': 'ennovum',
            'main': 'queue.js'
        },
        {
            'name': 'ennovum.model',
            'location': 'ennovum/model',
            'main': 'model.js'
        },
        {
            'name': 'ennovum.model.ModelList',
            'location': 'ennovum/model',
            'main': 'list.js'
        },
        {
            'name': 'ennovum.model.ModelMap',
            'location': 'ennovum/model',
            'main': 'map.js'
        },
        {
            'name': 'ennovum.model.ModelValue',
            'location': 'ennovum/model',
            'main': 'value.js'
        },
        {
            'name': 'ennovum.worker',
            'location': 'ennovum/worker',
            'main': 'worker.js'
        },
        {
            'name': 'ennovum.worker.WorkerFunction',
            'location': 'ennovum/worker',
            'main': 'function.js'
        },
        {
            'name': 'ennovum.worker.WorkerDownloader',
            'location': 'ennovum/worker',
            'main': 'downloader.js'
        },
        {
            'name': 'ennovum.Buffer',
            'location': 'ennovum',
            'main': 'buffer.js'
        },
        {
            'name': 'ennovum.Armadillog',
            'location': 'ennovum/armadillog',
            'main': 'armadillog.js'
        },
        {
            'name': 'armadillog.Layout',
            'location': 'armadillog',
            'main': 'layout.js'
        }
    ],
    'paths': {
        'text': 'vendor/text-2.0.5'
    },
    'shim': {
        'Handlebars': {
            'exports': 'Handlebars'
        }
    }
});

require(
    [
        'ennovum.environment',
        'ennovum.Armadillog',
        'armadillog.Layout',
        'text!./../README.txt'
    ],
    function (
        environment,
        Armadillog,
        Layout,
        readme
    ) {
        try {
            var config = {
                'bodyEl': document.querySelector('body'),
                'topEl': document.querySelector('.top'),
                'mainEl': document.querySelector('.main'),
                'mainmenuInputEl': document.querySelector('.input-switch'),
                'mainmenuFilterEl': document.querySelector('.filter-switch'),
                'mainmenuExamineEl': document.querySelector('.examine-switch'),
                'mainmenuManualEl': document.querySelector('.manual-switch'),
                'inputWrapperEl': document.querySelector('.input-wrapper'),
                'inputBoxEl': document.querySelector('.input-box'),
                'inputFoldEl': document.querySelector('.input-fold'),
                'filterWrapperEl': document.querySelector('.filter-wrapper'),
                'filterBoxEl': document.querySelector('.filter-box'),
                'filterFoldEl': document.querySelector('.filter-fold'),
                'examineWrapperEl': document.querySelector('.examine-wrapper'),
                'examineBoxEl': document.querySelector('.examine-box'),
                'examineFoldEl': document.querySelector('.examine-fold'),
                'manualWrapperEl': document.querySelector('.manual-wrapper'),
                'manualBoxEl': document.querySelector('.manual-box'),
                'manualFoldEl': document.querySelector('.manual-fold'),
                'contentBoxEl': document.querySelector('.content-box'),
                'contentScrollEl': document.querySelector('.main'),
                'contentDropEl': document.querySelector('.main')
            };

            var armadillog = new Armadillog(config);
            var layout = new Layout(config);

            armadillog.contentTextSet(readme, 'README.txt');
        }
        catch (err) {
            console.error(err.message);
        }
    });
