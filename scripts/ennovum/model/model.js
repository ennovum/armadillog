'use strict';

window.define && define(
    [
        'ennovum.environment',
        'ennovum.model.ModelValue',
        'ennovum.model.ModelList',
        'ennovum.model.ModelMap'
    ],
    function (
        environment,
        ModelValue,
        ModelList,
        ModelMap
    ) {
        return {
            'ModelValue': ModelValue,
            'ModelList': ModelList,
            'ModelMap': ModelMap
        };
    });
