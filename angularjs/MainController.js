app.controller('MainController', function($scope){

    $scope.inputs = {
        incomeAgeAtRetirement :  55
    };


    function doSomething() {
        console.log('Age retirement: ' + $scope.inputs.incomeAgeAtRetirement);
    }

    $scope.$watch('inputs',doSomething, true);

});