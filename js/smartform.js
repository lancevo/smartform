/* smartform 

  a form plug-in to validate inputs and very flexible to customize notifications.

  it adds necessary classes to input container so you can customize your message to however you see fit. 
  
  ** note ** : if the value is empty, no pattern test is applied meaning there's no class "valid" or "invalid" in parent container. 

  
  

  to do: 
    - test for textarea / select
    - clone base notifications
    - allow override notifcations
    - select
    - form submit validation

  
*/

/* 
  smartform
  A plug-in to validate form fields. It utilizes HTML5 form field attributes. 
  It adds necessasy classes to field container as, and so you can customize your messages 
  https://github.com/lancevo/smartform
*/

// requires jQuery 1.7+

// a helper to add/remove classes to input container
$.fn.yayNay = function(condition, classesToAdd, classesToRemove) {
  "use strict";
  var $el = $(this),
      classesToRemove = classesToRemove || classesToAdd;

  condition ? 
    $el.addClass(classesToAdd) :
    $el.removeClass(classesToRemove)
}

$.fn.smartform = function() {

  // customize classes for input field container
  var stateClasses = {
    	'mouseover'     : 'hover',
    	'mouseout'      : 'hover',
    	'focus'         : 'focus',
    	'focusin'       : 'focus',
    	'focusout'      : 'visited',
    	'blur'          : 'visited',
    	'invalid'       : 'invalid',
    	'valid'         : 'valid',
    	'required'			: 'required',
    	'unchecked'     : 'unchecked',
    	'checked'       : 'checked',
    	'indeterminate' : 'indeterminate',
    	'selected'      : 'selected',
    	'unselected'    : 'unselected',
    	'in-range'      : 'in-range',
    	'out-of-range'  : 'out-of-range'
    },
    $form = $(this);



  function validateField(ev){
    var $el = $(this),
        $wrapper = $el.attr('data-smartform-container') ? $el.closest( $el.attr('data-smartform-container') ) : $el.parent(),
        $messages = $el.find( $el.attr('data-smartform') ),
        val = $el.val().replace(/^\s+$/g,''), // remove empty spaces 
        pattern = $el.attr('pattern') ? new RegExp( $el.attr('pattern') ) : false,
        isValid =  true,
        isRequired = $el.attr('required'),
        isCheckbox = $el.attr('type') == 'checkbox',
        isRadio = $el.attr('type') == 'radio',
        isSelect = $el.is('select'),
        isTextarea = $el.is('textarea'),
        elName = $el.attr('name')     
        ;

    ev.stopPropagation();

    // test pattern for non-empty value
    if (val!== '' && pattern) {
      isValid = pattern.test( val )
    }

    // add any valid type to the wrapper by default
    stateClasses[ev.type] ? $wrapper.addClass( stateClasses[ev.type] ) : '';

    switch (ev.type) {
      //case 'focusin' : 
      //          $wrapper.removeClass( stateClasses['hover'] )
      //          break;

      case 'focusout': 
      case 'blur'    :
      case 'change'  :
                $wrapper.removeClass( stateClasses['focusin'] ); 
                
                // validate the pattern when value is not empty and there is a pattern
                $wrapper.yayNay( (val!=='' && !isValid), stateClasses['invalid'] );

                // add class "valid" or "invalid" when the value and pattern are not empty 
                $wrapper.yayNay( (val!=='' && isValid && pattern), stateClasses['valid'] );

                // add class "visited", there's no focusout/blur for checkbox 
                $wrapper.yayNay( isCheckbox , stateClasses['blur'] , ' ')
                $wrapper.yayNay( isCheckbox && $el.is(':checked'), stateClasses['checked'])
                $wrapper.yayNay( isCheckbox && !$el.is(':checked'), stateClasses['unchecked'])

                //  careful here, don't let $wrapper.yayNay overrides each other add/remove class
                if (isCheckbox || isRadio) {
                  $wrapper.yayNay( isCheckbox && isRequired && !$el.is(":checked"), stateClasses['required'])
                } else {
                  $wrapper.yayNay(isRequired && val ==='', stateClasses['required']);
                }

                // radio
                $wrapper.yayNay( isRadio , stateClasses['blur'] + ' checked', ' ')

                break;

      case 'mouseout' : 
                $wrapper.removeClass(stateClasses['mouseout']);
                break;
    }
    
  } // validateField

  $form.on("focus blur change keyup mouseover mouseout",":input", validateField)


}; // smartform







	


