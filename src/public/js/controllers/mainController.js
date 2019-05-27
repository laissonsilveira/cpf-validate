'use strict';
/**
 * @ngdoc function
 * @name CPFValidateApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the CPFValidateApp
 */
angular.module('CPFValidateApp')
    .controller('MainCtrl', function ($scope, $BlacklistService, $AuthService, $ngConfirm, notify) {

        const onError = err => {
            $scope.status = null;
            notify({ message: err.data.message, duration: 5000, classes: 'alert-danger' });
        };

        $scope.onLogout = () => $AuthService.logout();

        $scope.onValidate = cpf => {
            $BlacklistService.validate(cpf)
                .then(res => {
                    const { status } = res.data;
                    $scope.status = status;
                })
                .catch(err => onError(err));
        };
        $scope.onSave = cpf => {
            $BlacklistService.insert(cpf)
                .then(() => {
                    $scope.status = null;
                    notify({ message: 'CPF bloqueado com sucesso', duration: 5000, classes: 'alert-info' });
                })
                .catch(err => onError(err));
        };

        $scope.onDelete = cpf => {
            $ngConfirm({
                boxWidth: '30%',
                useBootstrap: false,
                theme: 'dark',
                title: 'Remover usuário!',
                content: `Tem certeza que você quer remover da lista o CPF '<strong>${cpf}</strong>'?`,
                scope: $scope,
                buttons: {
                    Sim: {
                        btnClass: 'btn-info',
                        action: scope => {
                            $BlacklistService.remove(cpf)
                                .then(() => {
                                    scope.status = null;
                                    notify({ message: 'CPF liberado com sucesso', duration: 5000, classes: 'alert-info' });
                                })
                                .catch(err => onError(err));
                        }
                    },
                    Cancelar: {
                        btnClass: 'btn-secondary',
                        action: function () { }
                    },
                }
            });
        };

    });