//     A very flexible jQuery plug-in to validate form fields. It validates input fields 
//     and adds classes to the input field's wrapper, so it makes it easy to style
//     
//     source: https:// github.com/lancevo/smartform
//     author: Lance Vo
//     **requires jQuery 1.7+**  
//     
//     tested on: IE7+
//     
//     version 0.2
//     
//     ###Features:
//     
//     * super easy to customize messages
//     * check for required fields
//     * fields comparision
//     * field validator with Regular Expression
//     * Support multiple regular expressions for an input field
//     
//     
//     smartform uses error approach method, so it doesn't validate 
//     the form or input fields unless user activates an input field or submits the form. 



(function($){
  "use strict;"
  $.fn.smartform = function(){
    return this.each(function(){
      var form = $(this),
          resetClasses = ' required checked not-checked matched not-matched pattern-valid pattern-invalid '
          ;

      // turn off browser validator
      form.attr('novalidate','novalidate')


      form.on('submit', function(e){
        
        var isValidated = true;

        form.find(":input").each(function(){
          var el = $(this),
              type = el.attr('type'),
              wrapper = el.attr('data-smartform-wrapper') ? $( el.attr('data-smartform-wrapper') ) : el.parent(),
              v = Validate(el)
              ;

          if (type =='submit' || type=='reset' || type=='button') {
            return true;
          }

          v.required().checked().matched().pattern();

          wrapper.removeClass(resetClasses + ' ' + v.getResetPatternClasses())
               .addClass(v.getClasses());

          if (wrapper.hasClass('pattern-invalid') || wrapper.hasClass('required')) {
            isValidated = false;
          }
        }) 

        if (!isValidated) {
          form.addClass('submit-invalid');
          return false;
        } 
        
      })

      form.on('keyup change focusin focusout ',':input', function(ev){
        var el = $(this),
            // element's container that classes will be applied to 
            wrapper = el.attr('data-smartform-wrapper') ? $( el.attr('data-smartform-wrapper') ) : el.parent(),
            v = Validate(el),
            type = el.attr('type')
            ;

        if (type =='submit' || type=='reset' || type=='button') {
          return true;
        }

        switch(ev.type) {
          case 'keyup' :
            v.matched().pattern(); 
            break;
          
          case 'change' :
            v.checked().required();
            break;

          case 'focusin': 
            wrapper.addClass('focus');
            break;

          case 'focusout':
            wrapper.removeClass('focus').addClass('visited');
            // matched(true) to make sure it adds .not-matched if values are not equal
            v.required().matched(true);
            break;
        }

        wrapper.removeClass(resetClasses + ' ' + v.getResetPatternClasses())
               .addClass(v.getClasses());
      })


      // ##Validate
      // An object has methods to validate input fields and return a string of classes
      function Validate(el) {
        var value = el.val(),
            type = el.attr('type'), 
            isRequired = el.attr('required'),
            classes = '',
            // reset wrapper classes everytime an event happen
            resetPatternClasses = '',            
            v = {} 
            ;

        // do not validate buttons
        if (type =='submit' || type=='reset' || type=='button') {
          return this;
        }

        // ### required()
        // If an input field (except radio button) has a required attribute
        // it validates the value whether it's empty or not checked,
        // and adds class *.required* to classes variable.
        //      
        // **It doesn't validate radio buttons.** For radio buttons, just check
        // one of the buttons to make it a required field. 
        v.required = function(){
          if (!isRequired) {
            return this;
          }

          if (type === 'checkbox') {
            classes += el.is(':checked') ? '' : ' required';
          } else if (type !=='radio') {
            // value has only spaces will treat it as an empty string
            classes += value.replace(/^\s+$/g,'') === '' ? ' required' : ''; 
          }

          return this;
        }

        //### checked()
        // Validates a checkbox or radio button   
        // If it's checked class *.checked* is added to classes variable
        // Not checked, class *.not-checked* is added to classes variable
        v.checked = function() {
          var type = el.attr('type');

          if (type !=='radio' && type !== 'checkbox') {
            return this;
          }

          // if it's not checked, test all radio button with the same name  
          var isChecked = el.is(':checked') || 
                          form.find('input[name="' + el.attr('name') + '"]').is(':checked');

          classes += isChecked ? ' checked' : ' not-checked';
          return this;
        }

        // ### matched()
        // 
        // Compares its value to the target element's value
        // *reportNotMatched* (bool) - force to add class .not-matched to classes variable if
        // both values are not equal, to show .not-matched when input field is blured.      
        // It's only added to classes variable on *focusout* event          
        // 
        // 
        //     <input name="password">  
        //     <input name="password-verify" data-smartform-match="password">  
        // 
        // the value of *data-smartform-match* can be an id, class, or input field name
        v.matched = function(reportNotMatched){
          var matchEl = el.attr('data-smartform-match');

          if (!matchEl || value==='') {
            return this;
          }

          // it's a class or an id
          if (matchEl.substr(0,1)==='.' || matchEl.substr(0,1)==='#') {
            matchEl = $(matchEl)[0];
          } else {
            // it's a name of an input field
            matchEl = form.find('[name="' + matchEl + '"]')[0];
          }

          if (!matchEl) {
            classes += ' not-matched';
            throw 'smartform data-smartform-match error: "' + el.attr('data-smartform-match') + '" is invalid';
            return this;
          }

          if ($(matchEl).val() === value) {
            classes += ' matched';
          } else if (reportNotMatched) {
            classes += ' not-matched';
          }

          return this;
        }



        // ### pattern()
        // Validates pattern or data-pattern* attributes. 
        // 
        // **Single pattern:**
        // 
        //     <div class="wrapper">  
        //       <input type="text" pattern="^[A-z]+$" />
        //        ...
        //     </div>
        // 
        // It validates the pattern value and adds class *.pattern-valid* 
        // to .wrapper if it's true, or class *.pattern-invalid* if it's 
        // false  
        // 
        // 
        // **Multiple patterns:**
        //  
        // 
        //     <div class="wrapper">  
        //     <input name="name"  
        //       data-pattern-uppercase="[A-Z]"  
        //       data-pattern-lowercase="[a-z]"  
        //       data-pattern-digit="\d"  
        //       data-pattern-symbol="[$%.#]"  
        //       data-pattern-nospace="^[\S]+$"  
        //       data-pattern-size="^.{6,10}$"  
        //       data-pattern-allow-chars="^[A-z0-9$%.#]+$"/>  
        //   
        //     <div class="smartforms">
        //       <ul class="validations">
        //         <li class="pattern-uppercase"> At least 1 upper case letter </li>
        //         <li class="pattern-lowercase"> At least 1 lower case letter </li>
        //         <li class="pattern-digit"> At least 1 number </li>
        //         <li class="pattern-symbol"> At least 1 symbol of $ % . # </li>
        //         <li class="pattern-nospace"> No space </li>
        //         <li class="pattern-size"> 6 to 10 characters </li>
        //         <li class="pattern-allow-chars"> Valid characters </li>
        //       </ul>
        //     </div>
        //     ...
        //     </div>
        //   
        // 
        // it validates each of the data-pattern[-name], if it passes the test 
        // class .pattern[-name]-valid is added to .wrapper, otherwise class 
        // .pattern[-name]-invalid is added to .wrapper
        // 
        // 
        // *If both "pattern" and "data-pattern[-name]" attributes are present
        // smartform will use attribute "pattern".*
        v.pattern = function(){
          
          var pattern = el.attr('pattern') ? new RegExp( el.attr('pattern') ) : undefined,
              isValid = ' pattern-valid',
              hasPattern = false
              ;

          if (value ==='') {
            return this;
          }
          if (pattern) {
            classes += pattern.test(value) ?  ' pattern-valid' : ' pattern-invalid';
          } else {
            // get all data-smartform-pattern* attributes
            for (var a = $(el)[0].attributes, i=0, j=a.length, p, s; i<j; i++) {
              if (a[i].name.match(/^data-pattern.*$/)) {
                // extract pattern name, data-smartform-pattern1 -> s = pattern1 
                s = a[i].name.replace(/data-/,'');
                p = new RegExp( el.attr(a[i].name) );
                
                if (p.test(value)) {
                  classes += ' ' + s + '-valid';
                } else {
                  isValid = ' pattern-invalid';
                  classes += ' ' + s + '-invalid';
                }

                resetPatternClasses += ' ' + s +'-valid' +
                                            ' ' + s +'-invalid';
                hasPattern = true;                                                       
              }
            }

            // adds .pattern-valid if all patterns are passed or 
            // .pattern-invalid if one of them is not
            if (hasPattern) {
              classes += isValid;
            } 
            
          }

          return this;
        }


        // ### getClasses()
        // return a string of validated classes
        v.getClasses = function() {
          return classes;
        }

        // ### getResetPatternClasses()
        // return a string of all of pattern[-name]-valid and pattern[-name]-invalid
        // to reset wrapper's classes.
        v.getResetPatternClasses = function() {
          return resetPatternClasses;
        }

        return v;
      }      



    })
  }
})(jQuery);