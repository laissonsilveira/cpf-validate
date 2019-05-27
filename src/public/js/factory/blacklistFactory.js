angular.module('CPFValidateApp').factory('$BlacklistService', function ($http) {
    const validate = cpf => $http.get('blacklist', { params: { cpf } });
    const insert = cpf => $http.post('blacklist', { cpf });
    const remove = cpf => $http.delete(`blacklist/${cpf}`);
    return { validate, insert, remove };
});