let profilePage = angular.module('profileApp',[]);
let currentSession = JSON.parse(sessionStorage.getItem('currentSession'))

profilePage.controller('profileController', function ($scope, $http, $window){

    $scope.userCurrent = {
        'updatedEmail':currentSession.Email
    }
    $http.post('/getUser',JSON.stringify($scope.userCurrent)).then(function (res){
        sessionStorage.setItem('currentSession', JSON.stringify(res.data))
    })

    $scope.activate = false;
    $scope.exists = false;

    $scope.username = currentSession.Username;
    $scope.email = currentSession.Email;
    $scope.bio = currentSession.Bio;
    $scope.password = '';
    $scope.balance = parseFloat(currentSession.Balance);
    $scope.owned = currentSession.Owned;

    $scope.logout = function (){
        sessionStorage.removeItem("currentSession")
        $window.location.href = '/index.html';
    }

    $scope.checkPass = function (){
        if($scope.password == currentSession.Password){
            return true
        }
        else
        {
            return false
        }
    }


    $scope.refreshCollection = function (){
        $http.get('/getNftData').then(function (res) {
            $scope.images = res.data.filter(function (t){
                if(t.NFT_Owner_Name == $scope.username){
                    return t
                }
            });
        })
    }
    $scope.refreshCollection();

    $scope.refill = function (){
        $scope.activate = !$scope.activate;
    }

    $scope.updateBalance = function (){
        $scope.balance += $scope.addCredits
        $scope.data = {
            'Username':$scope.username,
            'Email':$scope.email,
            'updatedEmail':$scope.email,
            'Balance':$scope.balance.toString()
        }
        $http.post('/updateBalance',JSON.stringify($scope.data)).then(function (res){
            if (res.data){
                $http.post('/getUser',JSON.stringify($scope.data)).then(function (res){
                    sessionStorage.setItem('currentSession', JSON.stringify(res.data));
                })
            }
        })

    }

    $scope.updateDetails = function (){
        $scope.updated = {
            'Username':currentSession.Username,
            'Email':currentSession.Email,
            'updatedUsername':$scope.username,
            'updatedEmail':$scope.email,
            'updatedBio':$scope.bio
        }
        $http.post('/updateDetails',JSON.stringify($scope.updated)).then(function (res){
            if (res.data){
                console.log('Called')
                $scope.exists = false
                $http.post('/getUser',JSON.stringify($scope.updated)).then(function (res){
                    sessionStorage.setItem('currentSession', JSON.stringify(res.data));
                })
                $scope.refreshCollection();
            }
            else{
                $scope.exists = true
            }
        })
    }
});