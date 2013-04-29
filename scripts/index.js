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
            'name': 'ennovum.Environment',
            'location': 'ennovum',
            'main': 'environment.js'
        },
        {
            'name': 'ennovum.Utils',
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
            'name': 'ennovum.Model',
            'location': 'ennovum/model',
            'main': 'model.js'
        },
        {
            'name': 'ennovum.Worker',
            'location': 'ennovum/worker',
            'main': 'worker.js'
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
        'ennovum.Environment',
        'ennovum.Armadillog',
        'armadillog.Layout'
    ],
    function (mEnvironment, mArmadillog, mLayout) {
        try {
            var config = {
                'bodyEl': document.querySelector('body'),
                'topEl': document.querySelector('#top'),
                'mainEl': document.querySelector('#main'),
                'mainmenuInputEl': document.querySelector('#armadillog-input-switch'),
                'mainmenuFilterEl': document.querySelector('#armadillog-filter-switch'),
                'mainmenuExamineEl': document.querySelector('#armadillog-examine-switch'),
                'inputWrapperEl': document.querySelector('#armadillog-input-wrapper'),
                'inputBoxEl': document.querySelector('#armadillog-input-box'),
                'inputFoldEl': document.querySelector('#armadillog-input-fold'),
                'filterWrapperEl': document.querySelector('#armadillog-filter-wrapper'),
                'filterBoxEl': document.querySelector('#armadillog-filter-box'),
                'filterFoldEl': document.querySelector('#armadillog-filter-fold'),
                'examineWrapperEl': document.querySelector('#armadillog-examine-wrapper'),
                'examineBoxEl': document.querySelector('#armadillog-examine-box'),
                'examineFoldEl': document.querySelector('#armadillog-examine-fold'),
                'contentBoxEl': document.querySelector('#armadillog-content-box'),
                'contentScrollEl': document.querySelector('#main'),
                'contentDropEl': document.querySelector('#main')
            };

            var armadillog = new mArmadillog.Armadillog(config);
            var layout = new mLayout.Layout(config);

            armadillog.contentTextSet(
                document.querySelector('#description').textContent,
                'Welcome message');
        }
        catch (err) {
            console.error(err.message);
        }
    });
