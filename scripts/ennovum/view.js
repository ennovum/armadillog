'use strict';

define(
    [
        'ennovum.environment',
        'ennovum.dom',
        'ennovum.utils',
        'Handlebars'
    ],
    function (
        environment,
        dom,
        utils,
        Handlebars
    ) {
        /**
         * View constructor
         */
        var View = function View() {
            var make;

            /**
             * Initializes instance
             */
            var init = function View_init(template) {
                make = Handlebars.compile(template);

                return true;
            };

            /**
             * Returns view elements object
             *
             * @param {object} context context object
             */
            var create = this.create = function View_get(context) {
                var wrapEl = dom.createElement('div');
                wrapEl.innerHTML = make(context);

                var coll = wrapEl.querySelectorAll('[data-view-element], [view-element]');
                var el;
                var name;
                var result = {};

                for (var i = 0, l = coll.length; i < l; i++) {
                    el = coll[i];
                    name = el.getAttribute('data-view-element') || el.getAttribute('view-element');
                    result[name] = el;
                }

                return result;
            };

            /**
             *
             */
            var toString = this.toString = function View_toString() {
                return 'ennovum.View';
            };

            //
            init.apply(this, arguments);
        };

        //
        return View;
    });
