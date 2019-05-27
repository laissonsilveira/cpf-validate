'use strict';
/**
 * @name CPFValidateApp
 * @description
 * # CPFValidateApp
 *
 * Main module of the application.
 */
angular
    .module('CPFValidateApp', ['angular-loading-bar', 'ui.router', 'cp.ngConfirm', 'cgNotify', 'ngMask'])
    .constant('AUTH_EVENTS', { notAuthenticated: 'auth-not-authenticated' })
    .config(['$stateProvider', '$urlRouterProvider', '$httpProvider', 'cfpLoadingBarProvider',
        function ($stateProvider, $urlRouterProvider, $httpProvider, cfpLoadingBarProvider) {
            cfpLoadingBarProvider.includeSpinner = false;
            $httpProvider.interceptors.push('$AuthInterceptor');
            $urlRouterProvider.otherwise('/login');

            $stateProvider
                .state('login', {
                    url: '/login',
                    controller: 'LoginCtrl',
                    templateUrl: 'views/login.html',
                    isPrivate: false
                })
                .state('main', {
                    url: '/main',
                    controller: 'MainCtrl',
                    templateUrl: 'views/main.html',
                    isPrivate: true
                });
        }])
    .service('$AuthService', function ($q, $http, $window, $state) {
        const _LOCAL_TOKEN_KEY = 'autoupdate_token_id';
        let _authenticated = false;
        let _authToken;

        function _useCredentials(token) {
            _authenticated = true;
            _authToken = token;
            $http.defaults.headers.common.Authorization = `Bearer ${_authToken}`;
        }

        function loadUserCredentials() {
            let token = $window.localStorage.getItem(_LOCAL_TOKEN_KEY);
            if (!token) token = $window.sessionStorage.getItem(_LOCAL_TOKEN_KEY);
            if (token) _useCredentials(token);
        }

        function storeUserCredentials(data, remember) {
            const token = data.token;
            if (remember) {
                $window.localStorage.setItem(_LOCAL_TOKEN_KEY, token);
            } else {
                $window.sessionStorage.setItem(_LOCAL_TOKEN_KEY, token);
            }
            _useCredentials(token);
        }

        function destroyUserCredentials() {
            _authToken = undefined;
            _authenticated = false;
            $http.defaults.headers.common.Authorization = undefined;
            $window.localStorage.removeItem(_LOCAL_TOKEN_KEY);
            $window.sessionStorage.removeItem(_LOCAL_TOKEN_KEY);
            $state.go('login');
        }

        const logout = function () {
            destroyUserCredentials();
        };

        const isAuthenticated = function () {
            return _authenticated;
        };

        const login = function (user, remember) {
            return $q(function (resolve, reject) {
                $http.post('auth/login', user)
                    .then(result => {
                        const data = result.data;
                        if (data.token) {
                            storeUserCredentials(data, remember);
                            resolve();
                        } else {
                            reject(data.message);
                        }
                    })
                    .catch(err => reject(err));
            });
        };

        loadUserCredentials();

        return { login, logout, isAuthenticated };
    })
    .factory('$AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
        return {
            responseError: function (response) {
                if (response.status && (response.status === 400 || response.status === 401)) {
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated, response);
                }
                return $q.reject(response);
            }
        };
    })
    .run(function ($rootScope, $location, $AuthService, AUTH_EVENTS, $state) {
        function _getOut() {
            $AuthService.logout();
            $state.go('login');
        }

        $rootScope.$on('$stateChangeStart', function (event, toState) {
            if (toState && toState.name === 'login' && $AuthService.isAuthenticated()) {
                event.preventDefault();
                return $state.go('main');
            }
            if (!toState.isPrivate) return;
            if (!$AuthService.isAuthenticated()) {
                event.preventDefault();
                _getOut();
            }
        });
        $rootScope.$on(AUTH_EVENTS.notAuthenticated, function () {
            _getOut();
        });
    });