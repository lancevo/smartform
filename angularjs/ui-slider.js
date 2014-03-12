app.directive('noUiSlider', function(){
    return {
        restrict: 'C',
        link: function( scope, element, attrs ){
            var input = $("#" + attrs.for);

            element.noUiSlider({
                start: input.val() ,
                range: [attrs.min,attrs.max],
                step: attrs.step,
                handles: 1,
                serialization: {
                    to: input,
                    resolution: 1
                }
            }).change(function(){
                    // makes sure it trigger angularjs model change
                    input.trigger('input');
                });
        }
    }
});