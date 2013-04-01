see the demo [http://dev.lancevo.net/smartform/](http://dev.lancevo.net/smartform/)

source annotaion: [http://dev.lancevo.net/smartform/docs/smartform.html](http://dev.lancevo.net/smartform/docs/smartform.html)


smartform
=========

It's a jQuery plug-in to validate form fields. As it validates a field, it adds classes to the field's wrapper, either a parent element or the id/class in the data-smartform-wrapper attribute's value. You can use these classes to manipulate messages with CSS, that's why it's so easy to customize.

Also it uses error approach method, the field is activated when it has been interacted or the form is submitted. So there's no validation when the form is rendered.



###Features:
* check for required fields
* fields comparision
* field validator with Regular Expression
* support multiple validators

**requires jQuery 1.7+**  
tested on: IE7+, FireFox, Chrome, Safari


classes
=======
Depends on the attributes, some of the following will be added to the field's wrapper:

* **.focus**  field is in focus               
* **.required** field is blurred and value is empty or contain spaces only
* **.checked** checkbox or radio button is checked
* **.not-checked** checkbox or radio button is not checked
* **.matched** value of this field is the same as the target field 
* **.not-matched**  value of this field is the same as the target field
* **.pattern-valid** all of the patterns are tested true
* **.pattern-invalid** one or more patterns are tested false
* **.pattern[-name]-valid** (used in multiple patterns) this pattern is tested true
* **.pattern[-name]-invalid** (used in multiple patterns) this pattern is tested false

* **.submit-invalid** this class is added to the **form** when one of the field's value is invalid


field attributes
================

## required 

To ensure the field is required. Class **.required** is added to the wrapper when the field's value is empty or has only spaces 

```html
<label> 
  <input required name="username"> 
  <div class="smartform">
    <div class="required"> This field is required</div>
  </div>
</label>
```

## data-smartform-wrapper

If you want to add the classes to an element other than the parent's element, it can assigned in **data-smartform-wrapper** attribute. It's useful when you have 2 columns layout for the form. 

```html
<div id="wrapper1">
  <label class="left" for="username"> 
    Username:
  </label>
  
  <div class="right">
    <input data-smartform-wrapper="#wrapper1" id="username" name="username">
    <div class="smartform">
      <div class="required"> This field is required</div>
    </div>
  </div>
</div>
```
Now the wrapper is *#wrapper1* instead of parent element *.right*

## data-smartform-match

Compare values of the 2 fields, if they're both equal, class **.matched** is added to the current field's wrapper, otherwise **.not-matched** is added. The value of data-smartform-match attribute can be a field name, id, or a class.

```html
<label>
  Password <br>
  <input name="secret" type="password">
</label>

<label>
  Enter password again: <br>
  <input data-smartform-match="secret" name="password-verify"  type="password">
  <div class="smartform">
    <div class="matched">Password is matched.</div>
    <div class="not-matched">Password is not matched.</div>
  </div>
</label>
```

## pattern 

smartform uses [regular express](http://en.wikipedia.org/wiki/Regular_expression) for validation, so there's no need to write JavaScript for validation. If a pattern is valid, class **.pattern-valid** is added to the wrapper, or **.pattern-invalid** for invalid. 

*smartform turn off browser's builtin validator, so the plug-in already do all the validation and more. For some reason, you need to turn it back on just remove this line in the plug in form.attr('novalidate','novalidate')* 

```html
  <label> Name <br>
    <input name="name" pattern="^[A-z0-9]+$"> 
    <div class="smartform">
      <div class="pattern-invalid"> Value is good </div>
      <div class="pattern-valid"> Oh no, invalid character(s) is entered</div>
    </div>
  </label>
```

This example test the value for upper-case, lower-case, and numbers. 

## data-pattern[-name]



example
=======

###html
```html
<form>
  <label> Name <br>
    <input name="name" required pattern="^[A-z0-9]+$"> 
    <div class="smartform">
      <div class="focus"> This message will display when the field is in focus</div>
      <div class="required"> This message will display when value is left empty</div>
      <div class="pattern-invalid"> This message will display when a character other than letters and numbers entered</div>
      <div class="pattern-valid"> This message will display when characters are letters and numbers</div>
    </div>
  </label>
</form>
```

###JavaScript
```javascript
$(document).ready(function(){
  $(form).smartform();
});
```

###CSS
```css
/* hide all errors, and all children elements of .smartform*/
form .submit-invalid, 
.smartform > * {
  display: none;
}

/* show elements when a class is added to the wrapper */
.focus .focus,
.required .required,
.checked .checked,
.not-checked .not-checked, 
.matched .matched,
.not-matched .not-matched, 
.pattern-valid .pattern-valid, 
.pattern-invalid .pattern-invalid,
.submit-invalid .submit-invalid 
{
  display:block;
}

/**** YOUR CSS HERE ****/

/* set color of error message to red */
.required .required,
.pattern-invalid .pattern-invalid {
	color:red;
}
```

## What it does:

### .focus / .pattern-valid / .pattern-invalid

When a field is in focus, it adds class **.focus** to the wrapper either parent element or element of data-smartform-wrapper value if defined. As you're typing it will test the pattern value to see if it's valid, if it's valid it adds class **.pattern-valid**, otherwise **.pattern-invalid** to the wrapper. 

### .visited / .required

As you move to the next field, class .focus is replaced with  class *.visited* to mark this field is visited. If the field has a *required* attribute, and the value is left empty or spaces only, class **.required** to the wrapper as well.





    
