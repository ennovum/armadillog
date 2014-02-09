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
        var implement = function composition_implement(base, instance, interfaceList) {
            switch (false) {
                case base && typeof base === 'object':
                case instance && typeof instance === 'object':
                case interfaceList && typeof interfaceList === 'object':
                    console.error('composition', 'implement', 'error: invalid input');
                    return;
            };

            if (!Array.isArray(interfaceList)) {
                interfaceList = [interfaceList];
            }

            for (var i = 0, l = interfaceList.length; i < l; i++) {
                for (var key in interfaceList[i]) {
                    if (typeof instance[key] === 'function') {
                        base[key] = instance[key].bind(instance);
                    }
                    else {
                        base[key] = instance[key];
                    }
                }
            }

            return base;
        };

        /**
         *
         */
        var mixin = function composition_mixin(base, mixin) {
            switch (false) {
                case base && typeof base === 'object':
                case mixin && typeof mixin === 'object':
                    console.error('composition', 'mixin', 'error: invalid input');
                    return;
            };

            for (var key in mixin) {
                if (key in base) {
                    continue;
                }

                if (typeof mixin[key] === 'function') {
                    base[key] = mixin[key].bind(mixin);
                }
                else {
                    base[key] = mixin[key];
                }
            }

            return mixin;
        };

        //
        return {
            implement: implement,
            mixin: mixin
        };
    });
