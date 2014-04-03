/*

 A jQuery plug-in to validate form fields. It only adds elClass to the
 form fields, and you customize how it appears.

 source: https://www.github.com/lancevo/smartform
 author: Lance Vo

 requires: jQuery 1.7+
 ver: 1.0
 */


var SmartFormValidator;
;(function($){
	"use strict";
	SmartFormValidator = Validator;

	// @param formFn : form callback function after it's validated
	$.fn.smartform = function(formFn){
		return this.each(function(){
			var form = $(this);

			// turn off browser validator to hide browser tooltips messages,
			// so it doesn't conflict with smartform validator
			form.attr('novalidate','novalidate');

			form.on('submit', function(e){
				var isFormValid = true;

				form.find(':input, select').each(function(){
					var el = $(this),
						type = el.attr('type'),
						validator,
						wrapper,
						klasses;

					if (type =='submit' || type=='reset' || type=='button') {
						return true;
					}

					validator = new Validator(el, form);
					validator.required().checked().match(true).testPattern(true);
					klasses = validator.getClass();

					wrapper = el.attr('data-smartform-wrapper') ? $( el.attr('data-smartform-wrapper') ) : el.parent();

					//temporary remove all applied classes
					wrapper.removeClass(klasses);
					// add classes back
					validator.addClass();



					if (klasses.match(/(required|invalid)/g)) {
						isFormValid = false;
					}
				}); // form.find();


				if (!isFormValid) {
					form.addClass('submit-invalid');
					e.preventDefault();
				}

				// callback
				if (formFn) {
					formFn(e, form);
				}

				return isFormValid;

			}); // form.on('submit');

			form.find(':input, select').each(function(){
				var el = $(this),
					type = el.attr('type');

				if (type =='submit' || type=='reset' || type=='button') {
					return true;
				}

				var	validator = new Validator(el, form),
					wrapper = el.attr('data-smartform-wrapper') ? $( el.attr('data-smartform-wrapper') ) : el.parent(),
					elFn = el.attr('data-smartform-fn') ? $.trim(el.attr('data-smartform-fn')) : undefined; // individual input field callback


				el.on('keyup change focusin focusout', function(e){


					switch(e.type) {
						case 'keyup':
							validator.match(false).testPattern(false);
							break;

						case 'change' :
							validator.checked().required();
							break;

						case 'focusin':
							validator.addClass('focus');
							break;

						case 'focusout' :
							validator.removeClass('focus').required().match(true).testPattern(true).addClass('visited');
							break;
					} // switch

					//temporary remove all applied classes
					wrapper.removeClass( validator.getClass() );

					// add classes back
					validator.addClass();

					// callback
					if (elFn) {
						eval(elFn + '(e, el, form, validator)');
					}

				}); // on(..)
			});

		}); // return
	} // smartform




	// is the value empty?
	function isRequiredText(el) {
		return el.val().trim() === '';
	}

	function isRequiredCheckbox(el) {
        var isChecked = false;

        // check for array
        if (el.attr('name').match(/\[\]/)) {
            isChecked = form.find('input[name="'+ el.attr('name') +'"').is(':checked')
        } else {
            isChecked = el.is(':checked');
        }
		return !isChecked;
	}

	function isRequiredSelect(el) {
		var val = el.val();

		// single option select box
		if (typeof val==='string' || val == null) {
			return !( typeof val==='string' ? val.trim() : val);
		}

		// multiple select options
		if (val.length === 0) {
			return true;
		}

		var areSelectedOptionsEmpty = true;

		for (var i= 0, l = val.length; i < l && areSelectedOptionsEmpty; i++) {
			if ($.trim(val[i]).length > 0) {
				areSelectedOptionsEmpty = false;
			}
		}

		return areSelectedOptionsEmpty;
	}


	// @return true : if the value is empty or not selected / checked
	//         false : passed the required requirement
	function isRequired(el) {
		var type = el.attr('type') || el[0].nodeName.toLowerCase();
		var b;

		if (!el.attr('required') || type === 'radio' || type === 'submit' || type === 'reset' || type === 'button' || !type) {
			return false;
		}
		switch (type) {
			case 'checkbox' :
				b = isRequiredCheckbox(el);
				break;

			case 'select' :
				b = isRequiredSelect(el);
				break;

			// catch all: textarea text / date / number ...
			default :
				b = isRequiredText(el);

		}

		return b;
	}


	// check both radio and checkbox to see if it's checked
	function isChecked(el, form) {
		var elType = el.attr('type'),
			checked = false;

		if (elType !=='radio' && elType !== 'checkbox') {
			throw new Error('this element is not a radio or checkbox');
		}

		if (elType === 'checkbox') {
			checked = el.is(':checked');
		} else {
			checked = form.find('input[name="' + el.attr('name') + '"]').is(':checked');
		}

		return checked;
	}


	// ### patterns
	// Validates a pattern or data-pattern* attributes.
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
	// *If both "pattern" and "data-pattern[-name]" attributes are present
	// smartform will use attribute "pattern"

	function testSinglePattern(el) {
		// test `pattern` attribute
		var pattern = el.attr('pattern') ? new RegExp( el.attr('pattern') ) : undefined;

		if (typeof pattern === 'undefined') {
			throw new Error('there is no "pattern" attribute', el);
		} else {
			return pattern.test(el.val());
		}
	}

	// @return {
	//            data-pattern-name1 : boolean, // (true: pass, false: fail)
	//            data-pattern-name2 : boolean ...
	// }
	// or {} if there's no data-pattern-...
	function testMultiPatterns(el) {
		var patterns = {},
			attrs = el[0].attributes,
			val = el.val(),
			hasPattern = false;

		// test all attribute name starting with `data-pattern`,
		// store attribute name with its test value
		for (var i=0, j=attrs.length, attrName, p; i<j; i++) {
			if (attrs[i].name.match(/^data-pattern.*$/)) {
				hasPattern = true;
				attrName = attrs[i].name;
				p = new RegExp( el.attr(attrName) );
				patterns[attrName] = p.test(val);
			}
		}

		return hasPattern ? patterns : undefined;
	}



	// Compares its value to the target element's value
	//
	//     <input name="password">
	//     <input name="password-verify" data-smartform-match="password">
	//
	function isMatched(el, form) {
		var targetEl = el.attr('data-smartform-match');

		if (!targetEl || $.trim(targetEl)==='') {
			throw new Error('Invalid data-smartform-match "' + el.attr('data-smartform-match') + '"');
		}

		targetEl = $.trim(targetEl);

		if (targetEl.substr(0,1)==='.' || targetEl.substr(0,1)==='#') {
			targetEl = $(targetEl)[0];
		} else {
			// it's a name of an input field
			targetEl = form.find('[name="' + targetEl + '"]')[0];
		}

		if (!targetEl) {
			throw new Error('Unable to find element of "' + el.attr('data-smartform-match') + '" for data-smartform-match ');
		}

		return $(targetEl).val() === el.val();
	}


	// validate an input field
	// @param el : input element
	// @param form: form element
	// @return Validator object

	function Validator(el, form) {
		el = $(el);

		var self = {},

			elType = el.attr('type'),
			wrapper = el.attr('data-smartform-wrapper') ? $( el.attr('data-smartform-wrapper') ) : el.parent(),
			wrapperClass = {},
			classPrefix = el.attr('data-smartform-prefix') ? el.attr('data-smartform-prefix') + '-' : '';




		// a helper fn to convert property names of `wrapperClass` to a string
		self.getClass = function() {
			var arr = [];

			arr = $.map(wrapperClass, function(val, propName){
				return propName;
			});

			return arr.join(' ');
		}

		// add wrapperClass to the element
		// @param klasses : a string of classes to be applied to the element wrapper
		self.addClass = function (klasses){
			var klasses = $.trim(klasses).replace(/\s{2,}/g,' ').split(' '),
				tmp = {};

			$(klasses).each(function(i, klass){
				if (klass !=="") {
					klass = classPrefix + klass;
					tmp[klass] = 1;
				}
			});
			wrapperClass = $.extend(wrapperClass, tmp);
			wrapper.addClass( self.getClass() );

			return this;
		}

		self.removeClass = function(klasses) {
			var klasses = $.trim(klasses).replace(/\s{2,}/g,' ').split(' '),
				str = '';

			$(klasses).each(function(i, klass){
				klass = classPrefix + klass;
				str = str + ' ' + klass;
				delete wrapperClass[klass];
			});
			wrapper.removeClass(str);
			return this;
		}

		// remove all the wrapperClass that are added to the element
		self.resetClass = function(){
			wrapper.removeClass( self.getClass() );
			wrapperClass = {};
			return this;
		}


		self.required = function() {
			if (isRequired(el)) {
				self.addClass('required');
			} else {
				self.removeClass('required');
			}
			return this;
		} // required()


		self.checked = function() {
			if (elType !=='radio' && elType !== 'checkbox') {
				return this;
			}

			if (isChecked(el, form)) {
				self.addClass('checked').removeClass('not-checked');
			} else {
				self.addClass('not-checked').removeClass('checked');
			}

			return this;
		}

		// @done (boolean) : true: add .pattern-invalid when pattern is failed
		//                   false: do not .pattern-invalid when pattern is failed
		//                   the purpose is to validate pattern(s) realtime, so it adds .pattern-valid
		//                   while user is typing, only adds .pattern-invalid when user is done typing.
		self.testPattern = function(done){
			var patterns,
				isAllValid = true;



			// test single `pattern` attribute

			// it tests the pattern as user is typing
			// if it satisfies the pattern, it adds `.pattern-valid` instantly
			// if it doesn't satisfies and `done` is `true`, it adds `.pattern-invalid` and removes `.pattern-valid`,
			// otherwise it only remove `.pattern-valid`
			if (typeof el.attr('pattern') == 'string' ) {
                if (el.val() ==='') {
                    // reset classes when value is empty
                    self.removeClass('pattern-valid pattern-invalid');
                } else if (testSinglePattern(el)) {
					self.addClass('pattern-valid').removeClass('pattern-invalid');
				} else if (done) {
                    // add pattern-invalid right away when the test is failed
					self.addClass('pattern-invalid').removeClass('pattern-valid');
				} else {
                    // just remove pattern-valid when the test is failed
					self.removeClass('pattern-valid');
				}

				return this;
			}

			patterns = testMultiPatterns(el);

			// there is no multi patterns to test
			if (!patterns) {
				return this;
			}

            for (var p in patterns) {
                p = p.replace(/^data-/,'');
                // `data-` is removed from `data-pattern[-customName]` for class name
				// eg: <input data-pattern-numbers="/^\d{1,}$/">
				//     depends on the outcome of the value, the class names are
				// `.pattern-numbers-valid` and `.pattern-numbers-invalid`
                if (el.val() === '') {
                    self.removeClass(p + '-valid ' + p + '-invalid');
                } else if (patterns['data-' + p]) {
					self.addClass(p + '-valid').removeClass(p + '-invalid');
				} else {
					self.addClass(p + '-invalid').removeClass(p + '-valid');
					isAllValid = false;
				}
			}

			// if all patterns passed, `.pattern-valid` is added
			// otherwise if any of the pattern failed, `.pattern-invalid` is added when `done` is `true`
            if (el.val() ==='') {
                // reset classes when value is empty
                self.removeClass('pattern-valid pattern-invalid');
            } else if (isAllValid && done) {
				self.addClass('pattern-valid').removeClass('pattern-invalid');
			} else if (done) {
				self.addClass('pattern-invalid').removeClass('pattern-valid');
			} else {
				self.removeClass('pattern-valid')
			}

			return this;

		}

		// @done (boolean) : true: add .not-matched when both input values are not the same
		//                   false: do not .not-matched when both input values are not the same
		//                   the purpose is to show error when user is done typing.
		self.match = function(done){
			var targetEl = el.attr('data-smartform-match');

			if (el.val() === '' || !targetEl || $.trim(targetEl)==='') {
				return this;
			}

			if (isMatched(el, form)) {
				self.addClass('matched').removeClass('not-matched');
			} else if (done) {
				self.addClass('not-matched').removeClass('matched');
			}

			return this;
		}

		return self;
	}



})(jQuery);