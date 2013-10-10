/*

A jQuery plug-in to validate form fields. It only adds elClass to the
form fields, and you customize how it appears.

source: https://www.github.com/lancevo/smartform
author: Lance Vo

requires: jQuery 1.7+
ver: 1.0
*/

/*
;(function($){
  "use strict";

*/


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
			return false;
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

	function testPattern(el) {
		// test `pattern` attribute
		var pattern = el.attr('pattern') ? new RegExp( el.attr('pattern') ) : undefined;

		if (typeof pattern === 'undefined') {
			throw new Error('there is no "pattern" attribute', el);
		} else {
			return pattern.test(el.val());
		}
	}

	function testMultiPattern(el) {
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


/*

	// validate element
	// @param el : form field element
	function Validate(el, form) {
		var self = {},
				elClass = {},
			  elType = el.attr('type'),
			  wrapper = el.attr('data-smartform-wrapper') ? $( el.attr('data-smartform-wrapper') ) : el.parent(),
			  classPrefix = el.attr('data-smartform-prefix') ? el.attr('data-smartform-prefix') + '-' : '',
				isRequired = el.attr('required');




		// a helper fn to convert property names of `elClass` to a string
		self.getClass = function() {
			var arr = [];

			arr = $.map(elClass, function(val, propName){
				return propName;
			});

			return arr.join(' ');
		}

		// queue a string of elClass being added
		// @param str (string) : classes to be added to the input wrapper
		self.queueClass = function(str) {
			var str = str.trim(str).replace(/\s{2,}/g,' ').split(' '),
				  tmp = {};

			$(str).each(function(i, el){
				 tmp[classPrefix + el] = 1;
			});

			elClass = $.extend(elClass, tmp);
			return this;
		}

		// add all the queued elClass to the element
		self.addClass = function (str){
			self.queueClass(str);
			wrapper.addClass( self.getClass() );
		  return this;
		}

		// remove all the elClass that are added to the element
		self.resetClass = function(){
			wrapper.removeClass( self.getClass() );
			elClass = {};
			return this;
		}


		// validate required attribute
		self.required = function() {

			if (!isRequired) return this;

			if (elType === 'checkbox') {
				if(!el.is(':checked')) {self.queueClass('required')};
			}
			else if (el.is('select')) {
				var val = el.val();

				// is this a single option select box
				if (val == null || (typeof val==='string' && val==='')) {
					self.queueClass('required');
				}
			}

			return this;

		} // required()



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

				*//*form.find(':input, select',function(){
					var el = $(this),
							validatedEl = new Validate(el, form);


				}); // form.find();*//*

				return false;

			}); // form.on('submit');

			form.find(':input, select').each(function(){
				var el = $(this),
						type = el.attr('type'),
						validator = new Validate(el, form);

				el.on('keyup change focusin focusout', function(e){
					if (type =='submit' || type=='reset' || type=='button') {
						return true;
					}
					switch(e.type) {
						case 'changed' :
							validator.required();
							break;

						case 'focusin':
							validator.queueClass('focus').addClass();
							break;

						case 'focusout' :
							validator.resetClass().queueClass('visited').required().addClass();
					} // switch

				}); // on(..)
			});


		}); // return
	} // smartform*/
/*
})(jQuery);*/




