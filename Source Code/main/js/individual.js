let currentNFT = JSON.parse(sessionStorage.getItem('currentNFT'));
let currentSession = JSON.parse(sessionStorage.getItem('currentSession'));
let openNFT;

let individualPage = angular.module('individualPage',[]);

individualPage.controller('individualController', function ($scope, $http, $window){
    $scope.NFTname = currentNFT.NFT_Collection_Name;
    $scope.NFTimage = currentNFT.NFT_Image_Name;
    $scope.NFTdescription = currentNFT.NFT_Description;
    $scope.artistName = currentNFT.NFT_Creator_Name;
    $scope.topBidValue = parseFloat(currentNFT.NFT_Top_Bid_Amount);
    $scope.ownerName = currentNFT.NFT_Owner_Name;
    $scope.buyOut = parseFloat(currentNFT.NFT_BuyOut);
    $scope.bidderName = currentNFT.NFT_Current_Bidder;

    $scope.balance = currentSession.Balance;

    $scope.isBid = false;
    $scope.activate = function (){
        $scope.isBid = !$scope.isBid;
    }

    $http.get('/getNftData').then(function (res) {
        let currentSession = JSON.parse(sessionStorage.getItem('currentSession'))
        console.log(currentSession.Username)
        $scope.images = res.data.filter(function (t){
            if(t.NFT_Owner_Name != currentSession.Username && t.isOnSale == true){
                return t
            }
        });
    })

    $scope.selfUpdate = function(){

        $scope.NFTcurrent = {
            'NFT_Collection_Name':$scope.NFTname
        }

        console.log($scope.NFTcurrent)

        $http.post('/getNFT',JSON.stringify($scope.NFTcurrent)).then(function (res){
            sessionStorage.setItem('currentNFT', JSON.stringify(res.data))
            currentNFT = JSON.parse(sessionStorage.getItem('currentNFT'));
            $scope.topBidValue = parseFloat(currentNFT.NFT_Top_Bid_Amount);
            $scope.bidderName = currentNFT.NFT_Current_Bidder;
            console.log($scope.topBidValue)
        })


        $scope.userCurrent = {
            'updatedEmail':currentSession.Email
        }

        $http.post('/getUser',JSON.stringify($scope.userCurrent)).then(function (res){
            sessionStorage.setItem('currentSession', JSON.stringify(res.data))
            currentSession = JSON.parse(sessionStorage.getItem('currentSession'));
            $scope.balance = currentSession.Balance;
            console.log($scope.balance)
        })
    }

    setInterval(()=>{$scope.selfUpdate()}, 5 * 1000)

    $scope.clickBid = function(i){
        openNFT = i;
        console.log(openNFT)
        sessionStorage.setItem('currentNFT', JSON.stringify(openNFT))
    }

    $scope.placeBid = function(){
        if($scope.bidValue + $scope.topBidValue > $scope.buyOut){
            console.log('First')
            $scope.isLess = true;
        }
        else if($scope.balance - $scope.bidValue < 0){
            console.log('Second')
            $scope.isPoor = true
        }
        else if($scope.bidValue < $scope.buyOut){
            $scope.bidder = {
                'Email':currentSession.Email,
                'Balance':($scope.balance - $scope.bidValue).toString(),
                'NFT_Collection_Name':currentNFT.NFT_Collection_Name,
                'NFT_Top_Bid_Amount':($scope.bidValue + $scope.topBidValue).toString(),
                'NFT_Current_Bidder':currentSession.Username
            }
            console.log($scope.bidder)
            $http.post('/placeBid',JSON.stringify($scope.bidder)).then(function (res){
                if(res.data){

                    $scope.NFTcurrent = {
                        'NFT_Collection_Name':$scope.NFTname
                    }

                    $http.post('/getNFT',JSON.stringify($scope.NFTcurrent)).then(function (res){
                        sessionStorage.setItem('currentNFT', JSON.stringify(res.data))
                        currentNFT = JSON.parse(sessionStorage.getItem('currentNFT'));
                        $scope.topBidValue = parseFloat(currentNFT.NFT_Top_Bid_Amount);
                        console.log($scope.topBidValue)
                    })

                    $scope.userCurrent = {
                        'updatedEmail':currentSession.Email
                    }

                    $http.post('/getUser',JSON.stringify($scope.userCurrent)).then(function (res){
                        sessionStorage.setItem('currentSession', JSON.stringify(res.data))
                        currentSession = JSON.parse(sessionStorage.getItem('currentSession'));
                        $scope.balance = currentSession.Balance;
                        console.log($scope.balance)
                    })

                    if(($scope.topBidValue + $scope.bidValue) == $scope.buyOut){
                        $scope.buy = {
                            'Username':currentSession.Username,
                            'NFT_Collection_Name':currentNFT.NFT_Collection_Name,
                        }
                        $http.post('/buyOut', JSON.stringify($scope.buy)).then(function (res){
                            if (res.data){
                                $window.location.href = '/profile.html';
                            }
                        })

                    }

                }
            })
        }
    }

});