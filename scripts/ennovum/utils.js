'use strict';

define(
    [
        'ennovum.environment'
    ],
    function (
        environment
    ) {
        //
        var TRIM_REGEXP = /(^\s|\s$)/g;

        /**
         *
         */
        var trim = function utils_trim(subject) {
            return subject.replace(TRIM_REGEXP, '');
        };

        //
        var ESCAPE_XML_REGEXP = /[<>"'&]{1}/g;
        var ESCAPE_XML_ENTITIES = {
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&apos;',
            '&': '&amp;'
        };

        /**
         *
         */
        var escapeXML = function utils_escapeXML(subject) {
            return subject.replace(ESCAPE_XML_REGEXP, function utils_escapeXML_match(match) {
                return ESCAPE_XML_ENTITIES[match];
            });
        };

        //
        var ESCAPE_REGEXP_REGEXP = /[\[\]\{\}\?\+\*\.\\\|\(\)\^\$]/g;

        /**
         *
         */
        var escapeRegexp = function utils_escapeRegexp(subject) {
            return subject.replace(ESCAPE_REGEXP_REGEXP, '\\$&');
        };

        //
        var asyncList = [];
        var asyncTimeout = null;

        /**
         *
         */
        var async = function utils_async(fn, ctx, args) {
            asyncList.push({
                fn: fn,
                ctx: ctx,
                args: args
            });

            if (!asyncTimeout) {
                asyncTimeout = setTimeout(asyncCall, 0);
            }

            return true;
        };

        /**
         *
         */
        var asyncCall = function utils_asyncCall() {
            var asyncData;

            for (var i = 0, l = asyncList.length; i < l; i++) {
                asyncData = asyncList[i];
                asyncData.fn.apply(asyncData.ctx, asyncData.args);
            }

            asyncList = [];
            asyncTimeout = null;
        }

        //
        var URL_PARTS_REGEXP = /^([a-zA-Z]+:\/\/)?((?:www\.)?(?:[a-zA-Z0-9\-\_\.%]*[a-zA-Z]+\.[a-zA-Z]{1,4}))?(:[0-9]+)?(\/[a-zA-Z0-9\-\_\.%/]?)?(\?[a-zA-Z0-9\-\_\.%=&]*)?(#[a-zA-Z0-9\-\_]*)?$/;

        /**
         *
         */
        var validateUrl = function utils_validateUrl(url) {
            var match = url.match(URL_PARTS_REGEXP);

            if (!match || !match[2]) {
                return null;
            }

            var urlValid = '';
            urlValid += match[1] ? match[1] : 'http://';
            urlValid += match[2];
            urlValid += match[3] || '';
            urlValid += match[4] ? match[4] : '/';
            urlValid += match[5] || '';
            urlValid += match[6] || '';

            return urlValid;
        };

        //
        return {
            trim: trim,
            escapeXML: escapeXML,

            escapeRegexp: escapeRegexp,

            async: async,

            validateUrl: validateUrl
        };
    });
