/**
 * Auth service which is used to authenticate users with backend server and provide simple
 * methods to check if user is authenticated or not.
 *
 * Within successfully login process service will store user data and JWT token to local
 * storage where those are accessible in the application.
 *
 * This service provides following methods:
 *
 *  Auth.authorize(access)
 *  Auth.isAuthenticated()
 *  Auth.login(credentials)
 *  Auth.logout()
 *
 * You can use this service fairly easy on your controllers and views if you like to. It's
 * recommend that you use this service with 'Player' service in your controllers and
 * views.
 *
 * Usage example in controller:
 *
 *  angular
 *      .module('app')
 *      .controller('SomeController',
 *          [
 *              '$scope', 'Auth', 'Player',
 *              function ($scope, Auth, Player) {
 *                  $scope.auth = Auth;
 *                  $scope.user = Player.player;
 *              }
 *          ]
 *      );
 *
 * Usage example in view:
 *
 *  <div data-ng-show="auth.isAuthenticated()">
 *      Hello, <strong>{{player().nick}}</strong>
 *  </div>
 *
 * Happy coding!
 *
 * @todo    Revoke method?
 */
(function() {
    'use strict';

    angular.module('HipsterShipster.services')
        .factory('Auth',
            [
                '$sailsSocket', '$state', 'Storage', 'AccessLevels', 'BackendConfig',
                function($sailsSocket, $state, Storage, AccessLevels, BackendConfig) {
                    return {
                        /**
                         * Method to authorize current user with given access level in application.
                         *
                         * @param   {Number}    access  Access level to check
                         *
                         * @returns {*}
                         */
                        authorize: function(access) {
                            if (access === AccessLevels.player) {
                                return this.isAuthenticated();
                            } else {
                                return true;
                            }
                        },

                        /**
                         * Method to check if current user is authenticated or not. This will just
                         * simply call 'Storage' service 'get' method and returns it results.
                         *
                         * @returns {*}
                         */
                        isAuthenticated: function() {
                            return Storage.get('auth_token');
                        },

                        /**
                         * Method make login request to backend server. Successfully response from
                         * server contains user data and JWT token as in JSON object. After successful
                         * authentication method will store user data and JWT token to local storage
                         * where those can be used.
                         *
                         * @param   {*} nick
                         *
                         * @returns {*|Promise}
                         */
                        join: function(nick) {
                            return $sailsSocket
                                .post(BackendConfig.url + '/game/joinLobby', {nick: nick})
                                .success(function(response) {
                                    Storage.set('auth_token', JSON.stringify(response));
                                });
                        },

                        /**
                         * The backend doesn't care about logouts, delete the token and you're good to go.
                         *
                         * Should we still make logout process to backend side?
                         */
                        logout: function() {
                            Storage.unset('auth_token');

                            $state.go('anon.login');
                        }
                    };
                }
            ]
        );
}());
