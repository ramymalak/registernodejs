(function() {


    var app = angular.module("checking", []);


    app.controller('CheckController',['$http','$scope',function($http,$scope){


        var model = this;
        $scope.emailPattern = /^([a-zA-Z0-9])+([a-zA-Z0-9._%+-])+@([a-zA-Z0-9_.-])+\.(([a-zA-Z]){2,6})$/;
        $scope.mode=0;
        model.submit = function() {
            console.log("trying check email");
            thedata = this.user;
            console.log(thedata);
            $http({
                url: 'http://localhost:3000/checkuser',
                method: 'POST',
                data: thedata
            }).success(function(respose) {
                $scope.mode=1;
                console.log("success");
                console.log(respose);
                document.getElementById('result').innerHTML=respose;
                //if (respose.split(':')[0] == "1") {
                //    console.log(respose.substring(2,respose.length-1));
                //    document.getElementById('thanks').innerHTML=respose.substring(2,respose.length-1);
                //    $scope.mode=1;
                //} else {
                //    console.log(respose);
                //    $scope.output = respose.split(':')[1];
                //    document.getElementById('image').value = '';
                //    delete model.user.image;
                //    document.getElementById('img_req').innerHTML = '';
                //
                //}
            }).error(function(error) {
                console.log("faild");
                console.log(error);
            });
        };
    }]);
}());
