'use strict';

define(
    [
        'ennovum.environment',
        'ennovum.dom',
        'ennovum.utils',
        'handlebars'
    ],
    function (
        environment,
        dom,
        utils,
        handlebars
    ) {
        /**
         * View constructor
         */
        var View = function View(template) {
            var itc = {
                make: handlebars.compile(template)
            };

            this.create = create.bind(this, itc);

            this.toString = toString.bind(this, itc);

            return this;
        };

        /**
         * Returns view elements object
         *
         * @param {object} context context object
         */
        var create = function View_create(itc, context) {
            var wrapEl = dom.createElement('div');
            wrapEl.innerHTML = itc.make(context);

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
        var toString = function View_toString(itc) {
            return 'ennovum.View';
        };

        //
        return View;
    });
