/*

A jQuery plug-in to validate form fields. It only adds elClass to the
form fields, and you customize how it appears.

source: https://www.github.com/lancevo/smartform
author: Lance Vo

requires: jQuery 1.7+
ver: 1.0
*/


;(function($){
  "use strict";


	// is the value empty?
	function isRequiredText(el) {
		return el.val().trim() === '';
	}

	function isRequiredCheckbox(el) {
		return !el.is(':checked');
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

		var stillEmptyValue = true;

		for (var i= 0, l = val.length; i < l && stillEmptyValue; i++) {
			if ($.trim(val[i]).length > 0) {
				stillEmptyValue = false;
			}
		}

		if (stillEmptyValue) {
			return true;
		}

		return false;
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
				val = el.val();

		// test all attribute name starting with `data-pattern`,
		// store attribute name with its test value
		for (var i=0, j=attrs.length, attrName, p; i<j; i++) {
			if (attrs[i].name.match(/^data-pattern.*$/)) {
				attrName = attrs[i].name;
				p = new RegExp( el.attr(attrName) );
				patterns[attrName] = p.test(val);
			}
		}

		return patterns;
	}


	// validate element
	// @param el : form field element
	function Validator(el, form) {
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
			console.log(str);
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


		self.testPattern = function(){
			var patterns,
					count = 0;


			// test single `pattern` attribute
			if (typeof el.attr('pattern') == 'string' ) {
				if (testSinglePattern(el)) {
					self.addClass('pattern-valid').removeClass('pattern-invalid');
				} else {
					self.addClass('pattern-invalid').removeClass('pattern-valid');
				}

				return this;
			}

			patterns = testMultiPatterns(el);

			for (var p in patterns) {
				count++;
				if (patterns[p]) {
					// shorten pattern name, remove `data-`
					p = p.replace(/^data-/,'');
					self.addClass(p + '-valid').removeClass(p + '-invalid');
				} else {
					p = p.replace(/^data-/,'');
					self.addClass(p + '-invalid').removeClass(p + '-valid');
				}
			}

			return this;

		}

		return self;
	}


	// @param fn : callback function after validated
	$.fn.smartform = function(fn){
		return this.each(function(){
			var form = $(this);

			// turn off browser validator to hide browser's validator tooltips,
			// so it doesn't interfere with css smartform messages
			form.attr('novalidate','novalidate');

			form.on('submit', function(e){
				var isValid = true;

//				form.find(':input, select',function(){
//					var el = $(this),
//							validatedEl = new Validate(el, form);
//
//
//				}); // form.find();

				return false;

			}); // form.on('submit');

			form.find(':input, select').each(function(){
				var el = $(this),
						type = el.attr('type'),
						validate = new Validator(el, form),
						wrapper = el.attr('data-smartform-wrapper') ? $( el.attr('data-smartform-wrapper') ) : el.parent();


				if (type =='submit' || type=='reset' || type=='button') {
					return true;
				}

				el.on('keyup change focusin focusout', function(e){
					var tmp;

					switch(e.type) {
						case 'keyup':
							validate.testPattern();
						case 'change' :
							validate.checked().required();
							break;

						case 'focusin':
							validate.addClass('focus');
							break;

						case 'focusout' :
							validate.removeClass('focus').required().addClass('visited');
					} // switch

					//temporary remove all classes
					wrapper.removeClass( validate.getClass() );

					// add classes back
					validate.addClass();

				}); // on(..)
			});


		}); // return
	} // smartform

})(jQuery);




