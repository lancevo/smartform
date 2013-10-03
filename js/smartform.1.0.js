/*

A jQuery plug-in to validate form fields. It only adds classes to the
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
	function Validate(el) {
		var self = this,
				classes = {},
			  wrapper = el.attr('data-smartform-wrapper') ? $( el.attr('data-smartform-wrapper') ) : el.parent();


		// a helper fn to convert classes name of property to a string
		function classToStr(){
			var arr = [];

			arr = $.map(classes, function(val, i){
				return i;
			});

			return arr.join(' ');
		}

		// queue a string of classes being added
		self.queueClass = function(str) {
			var str = str.trim(str).replace(/\s{2,}/g,' ').split(' '),
				  tmp = {};

			$(str).each(function(i, el){
				 tmp[el] = 1;
			});

			classes = $.extend(classes, tmp);
		}

		// add all the queued classes to the element
		self.addClass = function(){
			wrapper.addClass(classToStr());
		}

		// remove all the classes that are added to the element
		self.resetClasses = function(){
			wrapper.removeClass( classToStr() );
			classes = {};
		}

		self.classToStr = classToStr;




		return self;

	}

	// @param fn : callback function after validated
	$.fn.smartform = function(fn){
		return this.each(function(){
			var form = $(this);

			form.on('submit', function(e){
				var isValid = true;

				form.find(':input, select').each(function(){
					var el = $(this),
						  type = el.attr('type'),
						  validate = new Validate(el, fn);

					if (type==='submit' || type==='reset' || type==='button') {
						return true;
					}

					validate.resetClasses().required().checked().matched().pattern().addClass();


				}); // form.find();

			}); // form.on('submit');

			form.on('keyup change focusin focusout ',':input, select', function(e){


			});

		}); // return
	} // smartform

})(jQuery);
