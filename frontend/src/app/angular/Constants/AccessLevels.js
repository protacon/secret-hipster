/**
 * Frontend application access level constant definitions. These are used to to
 * restrict access to certain routes in application.
 *
 * Note that actual access check is done by currently signed in player.
 */
(function() {
    'use strict';

    angular.module('HipsterShipster')
        .constant('AccessLevels', {
            anon: 0,
            player: 1
        });
}());
