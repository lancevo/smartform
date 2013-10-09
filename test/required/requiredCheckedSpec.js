/**
 * Created by lancevo on 10/9/13.
 */

describe('isRequired() ', function(){
	var form, wrapper, input, select, textarea;

	beforeEach(function(){
		form = $('<form><div>' +
			'<input id="txt" type="text" required/>' +
			'<input id="cb" type="checkbox"  required />' +
			'<select id="ss" required ><option id="ss0" value="">Empty</option><option id="ss1">ss1</option><option id="ss2">ss2</option></select>' +
			'<select id="ms" required multiple="multiple"><option id="ms0" value="">Empty</option><option id="ms3" value="">ms3</option><option id="ms1">ms1</option><option id="ms2">ms2</option></select>' +
			'<textarea id="ta" required ></textarea>' +
			'</div><input type="submit"></form>');
		wrapper = form.find('div');
		select = undefined;
		input = undefined;
		textarea = form.find('#ta');
	});

  it(' type: text ', function(){
	  input = wrapper.find('#txt');
	  input.attr('required');
    expect(isRequired(input)).toBe(true);

	  input.val('something');
	  expect(isRequired(input)).toBe(false);
  })

	it(' type: checkbox ', function(){
		input = form.find('#cb');
		input.attr('required');
		expect(isRequired(input)).toBe(true);

		input.attr('checked','checked');
		expect(isRequired(input)).toBe(false);
	});

	it(' type: select (single option)', function(){
		select = form.find('#ss');
		expect( isRequired(select) ).toBe(true);
	});

	it(' type: select (ss) an empty value', function(){
		form.find('#ss0').attr('selected','selected');
		select = form.find('#ss');
		expect( isRequired(select) ).toBe(true);
	})

	it(' type: select (ss) an non empty value', function(){
		form.find('#ss1').attr('selected','selected');
		select = form.find('#ss');
		expect( isRequired(select) ).toBe(false);
	});

	it(' type: select (multiple option)', function(){
		select = form.find('#ms');
		expect( isRequired(select) ).toBe(true);
	});

	it(' type: select (multiple options) empty value', function(){
		form.find('#ms0').attr('selected','selected');
		select = form.find('#ms');
		expect( isRequired(select) ).toBe(true);

		// select multiple empty values
		form.find('#ms3').attr('selected','selected');
		expect( isRequired(select) ).toBe(true);
	});


	it(' type: select (ss) an non empty value', function(){
		form.find('#ms1').attr('selected','selected');
		select = form.find('#ms');
		expect( isRequired(select) ).toBe(false);
	});

	it(' type: select (ms) an non empty value with an empty value', function(){
		form.find('#ms1').attr('selected','selected');
		form.find('#ms0').attr('selected','selected');

		select = form.find('#ms');
		expect( isRequired(select) ).toBe(false);
	});

	it(' type: textarea', function(){
		expect( isRequired(textarea) ).toBe(true);

		textarea.val('something');
		expect( isRequired(textarea) ).toBe(false);
	});

});



describe('isChecked() ', function(){
	var form, wrapper, input, select, textarea;

	beforeEach(function(){
		form = $('<form><div>' +

			'<input id="cb" type="checkbox" />' +
			'<input id="rd1" type="radio" name="rad" value="1" />' +
			'<input id="rd2" type="radio" name="rad" value="2" />' +
			'<input id="rd3" type="radio" name="rad" value="3" />' +

			'</div><input type="submit"></form>');
		wrapper = form.find('div');
		input = undefined;
	});

	it(' checkbox ' , function(){
		input = form.find('#cb');

		expect( isChecked(input, form)).toBe(false);

		input.attr('checked','checked');
		expect( isChecked(input, form)).toBe(true);

	});

	it(' radio ' , function(){
		input = form.find('#rd1');

		expect( isChecked(input, form)).toBe(false);

		input.attr('checked','checked');
		expect( isChecked(input, form)).toBe(true);

		// check 2nd option, validate to see whether it's selected or not
		form.find('#rd2').attr('checked','checked');
		expect( isChecked(input, form)).toBe(true);

	});
});