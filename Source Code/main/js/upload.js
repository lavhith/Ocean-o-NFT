let uploadPage = angular.module('uploadPage',[]);
let currentSession = JSON.parse(sessionStorage.getItem('currentSession'))

let name;

function showPreview(event){
    if(event.target.files.length > 0){
        name = event.target.files[0];
        let src = URL.createObjectURL(event.target.files[0]);
        let preview = document.getElementById("file-ip-1-preview");
        preview.src = src;
        preview.style.display = "block";
    }
}

uploadPage.controller('uploadController', function ($scope, $http, $window) {

    $scope.failed = false;
    $scope.notFailed = true;
    $scope.upload = function(){
        $scope.NFT_obj = {
            'NFT_Creator_Name': currentSession.Username,
            'NFT_Owner_Name': currentSession.Username,
            'NFT_Top_Bid_Amount': $scope.NFTprice.toString(),
            'NFT_Description': $scope.NFTdescription,
            'NFT_Image_Name': name.name,
            'isOnSale':true,
            'NFT_Collection_Name': $scope.NFTname,
            'NFT_Current_Bidder': currentSession.Username,
            'NFT_BuyOut': $scope.NFTbuy.toString()
        }
        $http.post('/uploadForm',JSON.stringify($scope.NFT_obj)).then(function (res){
            if(res.data){
                $scope.failed = false;
                $window.location.href = '/profile.html';
            }
            else{
                $scope.failed = true;
            }

        })
        $scope.notFailed = false;
    }
});