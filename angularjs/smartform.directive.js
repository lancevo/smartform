app.directive('smartform', function(){
    return {
        link: function(scope, element) {
            element.smartform();
        }
    }
});