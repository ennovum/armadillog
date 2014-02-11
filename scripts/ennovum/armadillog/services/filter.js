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
        var WORKER_FILTER = new WorkerFunction(
            function (data, success, error) {
                var textFiltered = data.text;
                var filterList = JSON.parse(data.filterListJSON);

                var hidden = false;
                var filterItem;
                var regexp, match;

                for (var i = 0, l = filterList.length; i < l; i++) {
                    filterItem = filterList[i];

                    if (filterItem.mute || !filterItem.value || hidden) {
                        continue;
                    }

                    var tagBeginSymbol = filterItem.highlightType ? data['TAG_HIGHLIGHT_' + filterItem.highlightType + '_BEGIN_SYMBOL'] || '' : '';
                    var tagEndSymbol = filterItem.highlightType ? data['TAG_HIGHLIGHT_' + filterItem.highlightType + '_END_SYMBOL'] || '' : '';

                    regexp = new RegExp('(' + filterItem.value + ')', 'gi');
                    match = textFiltered.match(regexp);

                    switch (filterItem.affectType) {
                        case data.AFFECT_TYPE_SHOW_LINE:
                            if (match) {
                                textFiltered = textFiltered.replace(regexp, tagBeginSymbol + '$1' + tagEndSymbol);
                            }
                            else {
                                hidden = true;
                            }
                            break;

                        case data.AFFECT_TYPE_SHOW:
                            if (match) {
                                textFiltered = tagBeginSymbol + match.join(tagEndSymbol + ' ' + tagBeginSymbol) + tagEndSymbol;
                            }
                            else {
                                hidden = true;
                            }
                            break;

                        case data.AFFECT_TYPE_HIDE_LINE:
                            if (match) {
                                hidden = true;
                            }
                            break;

                        case data.AFFECT_TYPE_HIDE:
                            if (match) {
                                textFiltered = textFiltered.replace(regexp, '');
                            }
                            break;

                        case data.AFFECT_TYPE_HIGHLIGHT_LINE:
                            if (match) {
                                textFiltered = tagBeginSymbol + textFiltered + tagEndSymbol;
                            }
                            break;

                        case data.AFFECT_TYPE_HIGHLIGHT:
                            if (match) {
                                textFiltered = textFiltered.replace(regexp, tagBeginSymbol + '$1' + tagEndSymbol);
                            }
                            break;
                    }
                }

                success(
                    {
                        'text': textFiltered,
                        'hidden': hidden
                    },
                    null);
        });

        /**
         *
         */
        var run = function filtering_run(data, additional, fnReady, fnError, fnCtx, fnArgs) {
            return WORKER_FILTER.run(data, additional, fnReady, fnError, fnCtx, fnArgs);
        };

        //
        return {
            run: run
        };
    });
