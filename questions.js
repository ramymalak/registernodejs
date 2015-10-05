(function() {

    var app = angular.module("questionsapp", []);
    app.controller('QuestionController',['$http','$scope',function($http,$scope){
        var model=this;
        model.counter=0;
        model.getquestions=function() {
            $http({
                url: 'http://localhost:3000/allquestions',
                method: 'POST',
                data:{quesion:'allquestions'}
            }).success(function(respose) {
                console.log("success");
                console.log(respose);
                model.speakerquestions=respose;
            }).error(function(error) {
                console.log("faild");
                console.log(error);
            });
        };
        model.getquestions();



    }]);

}());
