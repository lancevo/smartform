/* 
  smartform
  A plug-in to validate form fields. It utilizes HTML5 form field attributes. 
  It adds necessasy classes to field container as, and so you can customize your messages 
  
  source: https://github.com/lancevo/smartform
  // requires jQuery 1.7+
*/


// a helper to add/remove classes to input container
// @param removeClasses is optional, if undefined it'll be the same as addClasses
$.fn.yayNay = function(condition, addClasses, removeClasses) {
  var el = $(this),
      removeClasses = typeof removeClasses === 'undefined' ? addClasses : removeClasses
      ;

  condition ? 
    el.addClass(addClasses) :
    el.removeClass(removeClasses)

  return this;
}

$.fn.smartform = function() {
  // customize classes for input field container
  var $form = $(this),
      // html5 browser validator
      checkValidity = typeof document.createElement( 'input' ).checkValidity === 'function';

  //$form.attr('novalidate','novalidate')

  function validateField(ev){
    ev.stopPropagation();
    var el = $(this),
        elContainer = el.attr('data-smartform') ? el.closest( el.attr('data-smartform') ) : el.parent(),
        value = el.val().replace(/^\s+$/g,''), // remove empty spaces 
        pattern = el.attr('pattern') ? new RegExp( el.attr('pattern') ) : undefined,
        isRequired = el.attr('required'),

        isCheckbox = el.attr('type') === 'checkbox',
        isRadio = el.attr('type') === 'radio',
        isSelect = el.is('select'),
        isTextarea = el.is('textarea'),

        isValid = pattern ? pattern.test(value) : true 
        ;

    // visited
    // add .visited if it doesn't have it
    elContainer.yayNay( !elContainer.hasClass('visited'), 'visited', '');

    // focus
    switch (ev.type) {
      case 'focusin' :
            elContainer.addClass('focus')
            break
      
      case 'focusout': 
      case 'change'  :
      case 'blur'    :
      case 'select'  : 
            // required
            elContainer.removeClass('focus')

            if (isCheckbox || isRadio) {
              var isChecked = el.is(':checked');
                                  
              if (isRadio) {
                isChecked = $form.find('input[name="' + el.attr('name') + '"]').is(':checked');
                $form.find('input[name="' + el.attr('name') + '"]').each(function(){
                  if ($(this).attr('required')) {
                    isRequired = true;
                  }
                })
              }

              elContainer.yayNay( isChecked, 'checked' )
                         .yayNay( !isChecked, 'unchecked' )
                         .yayNay( isRequired && !isChecked, 'required')
            } else {
              elContainer.yayNay( isRequired && value==='', 'required')
                         .yayNay( pattern && isValid, 'valid' )
                         .yayNay( pattern && !isValid, 'invalid' )
            }
            break
    }
 
  } // validateField


  $form.on("blur change focus focusin focusout select",":input", validateField)

  $form.submit( function(ev){
    var isValidated = true;
    
    $form.find(":input").each(function(){
      var el = $(this),
          elContainer = el.attr('data-smartform') ? el.closest( el.attr('data-smartform') ) : el.parent();

      el.blur()
      
      if (elContainer.hasClass('invalid') || elContainer.hasClass('required')) {
        isValidated = false;
      }
    })

    if (!isValidated) {
      $form.addClass('submit-invalid')
      return false
    } else {
      $form.addClass('submit-valid')
    }
  }) // submit

}; // smartform







	


