const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('form-main-container');

let currentSession;

signUpButton.addEventListener('click', () => {
    console.log('Listener added')
    container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
    container.classList.remove("right-panel-active");
});

let formApp = angular.module('formApp',[]);

formApp.controller('formController', function ($scope, $http, $window){
    $scope.found = true
    $scope.taken = false
    $scope.signUp = function (){
        $scope.signUpData = {
            'Username':$scope.signUpUser,
            'Email':$scope.signUpEmail.toLowerCase(),
            'Password':$scope.signUpPassword,
            'Balance':'0.0',
            'Owned':0,
            'Bio':''
        }
        $http.post('/createAccount',JSON.stringify($scope.signUpData)).then(function (res){
            console.log(res.data)
            if(res.data == 'ERR420'){
                $scope.taken = true
            }
            else{
                $scope.taken = false
                $window.location.href = '/index.html';
                sessionStorage.setItem('currentSession', JSON.stringify($scope.signUpData));
            }
        })
    }

    $scope.signIn = function (){
        $scope.signInData = {
            'Email':$scope.signInEmail.toLowerCase(),
            'Password':$scope.signInPassword
        }
        $http.post('/loginAccount',JSON.stringify($scope.signInData)).then(function (res){
            console.log('Help')
            console.log(res.data)
            if (res.data != ''){
                console.log('Logged In')
                sessionStorage.setItem('currentSession', JSON.stringify(res.data));
                console.log(JSON.parse(sessionStorage.getItem('currentSession')))
                $scope.found = true
                $window.location.href = '/index.html';
            }
            else{
                $scope.found = false
            }
        })
    }
});