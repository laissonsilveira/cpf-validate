angular.module('CPFSupportApp', []).controller('SupportCtrl', function ($scope, $http) {
    $scope.status = null;
    $http.get('status').then(res => {
        $scope.status = res.data;
    });
});