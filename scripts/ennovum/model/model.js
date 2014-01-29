'use strict';

window.define && define(
    [
        'ennovum.Environment',
        './value',
        './list',
        './map'
    ],
    function (
        mEnvironment,
        mModelValue,
        mModelList,
        mModelMap
    ) {
        return {
            'ModelValue': mModelValue.ModelValue,
            'ModelList': mModelList.ModelList,
            'ModelMap': mModelMap.ModelMap
        };
    });
