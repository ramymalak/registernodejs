(function() {


    var app = angular.module("validation", ['naif.base64','vcRecaptcha']).run(function($rootScope) {
        $rootScope.mode=0;

    });


    app.controller('RegistrationController',['vcRecaptchaService','$http','$scope',function(vcRecaptchaService,$http,$scope){




        //vm.submit = function(){
        //
        //    console.log(vcRecaptchaService.getResponse());
        //
        //
        //}
        var model = this;
        model.publicKey = "6LewMg0TAAAAALNS_rPaFdaCT0tpVmqlqvNCBVm6";
        $scope.emailPattern = /^([a-zA-Z0-9])+([a-zA-Z0-9._%+-])+@([a-zA-Z0-9_.-])+\.(([a-zA-Z]){2,6})$/;
        $scope.mobilPattern = /^((01\d{9}))$/;

        model.submit = function() {
            console.log("trying to add user");
            //console.log(vcRecaptchaService.getResponse());

            document.getElementById("loading").style.zIndex = "101";
            document.getElementById("regcontent").style.visibility = "hidden";
            //document.getElementById("page").style.backgroundImage = "url('./images/gold-iphone.png')";
            thedata = this.user;
            thedata.captcha=vcRecaptchaService.getResponse();
            if(!this.user.image){
                thedata.image='';
            }else{
                thedata.image=this.user.image.base64;
            }

            console.log(thedata);
            $http({
                url: 'http://localhost:3000/adduser',
                method: 'POST',
                data: thedata
            }).success(function(respose) {
                grecaptcha.reset();
                document.getElementById("loading").style.zIndex = "0";
                document.getElementById("regcontent").style.visibility = "visible";
                console.log("success");
                if (respose.split(':')[0] == "1") {
                    console.log(respose.substring(2,respose.length-1));
                    document.getElementById('thanks').innerHTML=respose.substring(2,respose.length-1);
                    $scope.mode=1;
                } else {
                    grecaptcha.reset();
                    console.log(respose);
                    $scope.output = respose.split(':')[1];
                    document.getElementById('image').value = '';
                    delete model.user.image;
                    document.getElementById('img_req').innerHTML = '';

                }
            }).error(function(error) {
                console.log("faild");
                console.log(error);
            });
        };
        $scope.check_type=function(){
		
		if(model.user.image.filetype!="image/png")
		{
		    alert(".png images only allowed");
                    document.getElementById('image').value = ''
                    delete model.user.image;
		}	
    	}

    }]);


    app.controller('ThanksController',['$scope',function($scope){
        $scope.mode=1;
    }]);
    
    var compareTo = function() {
        return {
            require: "ngModel",
            scope: {
                otherModelValue: "=compareTo"
            },
            link: function(scope, element, attributes, ngModel) {

                ngModel.$validators.compareTo = function(modelValue) {
                    return modelValue == scope.otherModelValue;
                };

                scope.$watch("otherModelValue", function() {
                    ngModel.$validate();
                });
            }
        };
    };

    
    app.directive("compareTo", compareTo);


}());
