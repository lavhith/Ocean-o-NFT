//Angular for loading Content in grids and swiper
let openNFT;
let homePage = angular.module('homePage', []);
homePage.controller('homeController', function ($scope, $http){

    $scope.checkSession = function(){
        if(JSON.parse(sessionStorage.getItem('currentSession'))){
            return true
        }
        return false
    }
     $scope.refreshCollection = function (){
        if (!$scope.checkSession()){
            $http.get('/getNftData').then(function (res) {
                $scope.images = res.data;
            })
        }
        else{
            $http.get('/getNftData').then(function (res) {
                let currentSession = JSON.parse(sessionStorage.getItem('currentSession'))
                console.log(currentSession.Username)
                $scope.images = res.data.filter(function (t){
                    if(t.NFT_Owner_Name != currentSession.Username && t.isOnSale == true){
                        return t
                    }
                });
            })
        }
    }
    $scope.refreshCollection();
    let interval = setInterval(()=> {$scope.refreshCollection()}, 10 * 1000)

    /*$scope.fetchLow = function(){
        clearInterval(interval)
        if (!$scope.checkSession()){
            $http.get('/getNftLowest').then(function (res) {
                $scope.images = res.data;
            })
        }
        else{
            $http.get('/getNftLowest').then(function (res) {
                let currentSession = JSON.parse(sessionStorage.getItem('currentSession'))
                console.log(currentSession.Username)
                $scope.images = res.data.filter(function (t){
                    if(t.NFT_Owner_Name != currentSession.Username){
                        return t
                    }
                });
            })
        }
    }

    $scope.fetchHigh = function(){
        clearInterval(interval)
        if (!$scope.checkSession()){
            $http.get('/getNftHighest').then(function (res) {
                $scope.images = res.data;
            })
        }
        else{
            $http.get('/getNftHighest').then(function (res) {
                let currentSession = JSON.parse(sessionStorage.getItem('currentSession'))
                console.log(currentSession.Username)
                $scope.images = res.data.filter(function (t){
                    if(t.NFT_Owner_Name != currentSession.Username){
                        return t
                    }
                });
            })
        }
    }

    $scope.fetchFirst = function(){
        clearInterval(interval)
        if (!$scope.checkSession()){
            $http.get('/getNftNameF').then(function (res) {
                $scope.images = res.data;
            })
        }
        else{
            $http.get('/getNftNameF').then(function (res) {
                let currentSession = JSON.parse(sessionStorage.getItem('currentSession'))
                console.log(currentSession.Username)
                $scope.images = res.data.filter(function (t){
                    if(t.NFT_Owner_Name != currentSession.Username){
                        return t
                    }
                });
            })
        }
    }

    $scope.fetchLast = function(){
        clearInterval(interval)
        if (!$scope.checkSession()){
            $http.get('/getNftNameL').then(function (res) {
                $scope.images = res.data;
            })
        }
        else{
            $http.get('/getNftNameL').then(function (res) {
                let currentSession = JSON.parse(sessionStorage.getItem('currentSession'))
                console.log(currentSession.Username)
                $scope.images = res.data.filter(function (t){
                    if(t.NFT_Owner_Name != currentSession.Username){
                        return t
                    }
                });
            })
        }
    }*/

    $scope.clickBid = function(i){
        openNFT = i;
        console.log(openNFT)
        sessionStorage.setItem('currentNFT', JSON.stringify(openNFT))
    }

})


