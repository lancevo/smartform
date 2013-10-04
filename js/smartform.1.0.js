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

	// validate element
	// @param el : form field element
	function Validate(el, form) {
		var self = {},
				elClass = {},
			  elType = el.attr('type'),
			  wrapper = el.attr('data-smartform-wrapper') ? $( el.attr('data-smartform-wrapper') ) : el.parent(),
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
				 tmp[el] = 1;
			});

			elClass = $.extend(elClass, tmp);
		}

		// add all the queued elClass to the element
		self.addClass = function (){
			wrapper.addClass(getClass());
		}

		// remove all the elClass that are added to the element
		self.resetClass = function(){
			wrapper.removeClass( getClass() );
			elClass = {};
		}


		// validate required attribute
		self.required = function() {
			if (!isRequired) return this;

			switch(elType) {

				case 'checkbox' :
					if(!el.is(':checked')) {self.queueClass('required')};
					break;

				case 'radio' :
					var name = el.attr('name'),
						  isChecked;
					if (!name) {
						throw new Error('required: radio input must have attribute name ' + el);
					}
					isChecked = form.find('[name="' + name + '":radio').is(':checked');

					if (!isChecked) {self.queueClass('required')};
					break;
			}

		} // required()

		el.on('keyup change focusin focusout', function(e){
			if (type =='submit' || type=='reset' || type=='button') {
				return true;
			}

			switch(e.type) {
				case 'changed' :
					self.required();
					break;
			}

		}); // on(..)

		return self;
	}

	// @param fn : callback function after validated
	$.fn.smartform = function(fn){
		return this.each(function(){
			var form = $(this);

			form.on('submit', function(e){
				var isValid = true;

				form.find(':input, select',function(){
					var el = $(this),
							validatedEl = new Validate(el, form);


				}); // form.find();

			}); // form.on('submit');

			form.find(':input, select', function(){
				validateEl()
			});


		}); // return
	} // smartform

})(jQuery);
