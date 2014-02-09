'use strict';

define(
    [
        'ennovum.environment'
    ],
    function (
        environment
    ) {
        /**
         *
         */
        var spy = function debug_spy(subject) {
            switch (true) {
                case typeof subject === 'function':
                    subject = spyItem(subject, subject);
                    break;

                case Array.isArray(subject):
                    for (var i = 0, l = subject.length; i < l; i++) {
                        subject[i] = spyItem(subject, subject[i]);
                    }
                    break;

                case typeof subject === 'object':
                    for (var k in subject) {
                        subject[k] = spyItem(subject, subject[k]);
                    }
                    break;

                default:
                    console.error('Debug', 'spy', 'unsupported subject type');
            }

            return subject;
        };

        /**
         *
         */
        var spyItem = function debug_spyItem(subject, item) {
            switch (true) {
                case typeof item === 'function':
                    return function debug_spyItem_spied() {
                        var seqNumber = spySeq++;
                        var name = item.toString().split('\n')[0].match(FUNCTION_NAME_REGEXP)[1] || 'anonymous';

                        console.log('[' + seqNumber + '][C]', name, arguments);
                        var result = item.apply(subject, arguments);
                        console.log('[' + seqNumber + '][R]', name, result);

                        return result;
                    };
                    break;

                default:
                    return item;
            }
        };

        //
        return {
            spy: spy
        };
    });
