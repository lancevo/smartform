describe('isRequired() ', function(){
	var form, wrapper, input, select, textarea;

	beforeEach(function(){
		form = $('<form><div>' +
			'<input id="p" type="text" pattern="^[A-z]+$"/>' +
			'</div><input type="submit"></form>');
		wrapper = form.find('div');
		input = undefined;
	});

	it(' test single pattern', function(){
		input = form.find('#p');

		// no value
		expect(testPattern(input)).toBe(false);

		// has non-letters
		input.val('1234');
		expect(testPattern(input)).toBe(false);

		// has letters
		input.val('abC');
		expect(testPattern(input)).toBe(true);
	});

	

});



