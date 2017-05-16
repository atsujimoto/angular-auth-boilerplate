angular.module('MainCtrls', ['MainServices'])
    .controller('NavCtrl', ['$scope', 'Auth', function($scope, Auth) {
        $scope.Auth = Auth;
        $scope.logout = function() {
            Auth.removeToken();
            console.log('My token:', Auth.getToken());
        };
    }])
    .controller('SignupCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {
        $scope.user = {
            email: '',
            password: ''
        };
        $scope.userSignup = function() {
            $http.post('/api/users', $scope.user).then(function success(data) {
                $location.path('/');
            }, function error(data) {
                console.log(data);
            });
        };
    }])
    .controller('LoginCtrl', ['$scope', '$http', '$location', 'Auth', function($scope, $http, $location, Auth) {
        $scope.user = {
            email: '',
            password: ''
        };
        $scope.userLogin = function() {
            $http.post('/api/auth', $scope.user).then(function success(data) {
                Auth.saveToken(data.data.token);
                console.log('Token is:', data.data.token);
                $location.path('/');
            }, function error(data) {
                console.log(data);
            });
        };
    }]);
