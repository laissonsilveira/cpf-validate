'use strict';
/**
 * @name CPFValidateApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the Login
 */
angular.module('CPFValidateApp')
    .controller('LoginCtrl', function ($scope, $AuthService, $state, notify) {
        $scope.remember = false;
        $scope.login = authentication => {
            $AuthService.login(authentication, $scope.remember)
                .then(() => $state.go('main'))
                .catch(res => {
                    let message = 'Erro ao tentar efetuar o login';
                    if (res.data && res.data.message) message = res.data.message;
                    notify({ message, duration: 5000, classes: 'alert-danger' });
                });
        };
        $('#username').focus();
    });