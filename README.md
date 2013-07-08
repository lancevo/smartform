demo [http://lancevo.github.io/smartform/](http://dev.lancevo.net/smartform/)  
source annotation: [http://lancevo.github.io/smartform/docs/smartform.html](http://dev.lancevo.net/smartform/docs/smartform.html)

smartform
=========

It's a jQuery plug-in to validate form fields. It adds necessary classes so you can customize your messages and it gets out of the way. Also, it supports [multiple regular expressions](#data-pattern-name), so you can write rules without writing JavaScripts.

It uses error approach method, the field is activated when it has been interacted or the form is submitted. So there's no validation when the form is initially rendered.



###Features:
* [check for required fields](#required)
* [fields comparision](#data-smartform-match)
* [field validator with Regular Expression](#pattern)
* [support multiple validators](#data-pattern-name)

**requires jQuery 1.7+**  
tested on: IE7+, FireFox, Chrome, Safari


classes
=======

Depends on the attributes, some of the following will be added to the field's wrapper, which is the field's parent element or the id/class or name in the data-smartform-wrapper attribute's value

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

To ensure the field is required. Class **.required** is added to the wrapper or parent element, which is <label> in this case,  when the field's value is empty or has only spaces 

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
<label id="field1">
  Password <br>
  <input name="secret" type="password">
</label>

<label id="field2">
  Enter password again: <br>
  <input data-smartform-match="secret" name="password-verify"  type="password">
  <div class="smartform">
    <div class="matched">Password is matched.</div>
    <div class="not-matched">Password is not matched.</div>
  </div>
</label>
```

When user's entering the password again, smartform compares the value as the user types. When both values are equal, class **.matched** is added to #field2. If the field is out of focus, and the values are not equal, class *.not-matched* is added to #field2. 

## pattern 

smartform uses [regular express](http://en.wikipedia.org/wiki/Regular_expression) for validation, so there's no need to write JavaScript for validation. If a pattern is valid, class **.pattern-valid** is added to the wrapper, or **.pattern-invalid** for invalid. 

*smartform turn off HTML5 browser's builtin validator, so the plug-in already do all the validation and more. For some reason, you need to turn it back on just remove this line in the plug in form.attr('novalidate','novalidate')* 

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

This allow to define multiple patterns. As each pattern is validated, a class *.pattern[-name]-valid* is added to the wrapper, otherwise it's *.pattern[-name]-invalid*.   
When all of the patterns are validated, class *.pattern-valid* is added to the wrapper. If one or more patterns are failed the validation, class *.pattern-invalid* is added to the wrapper.

This is useful to provide feedbacks to user for fields with complex requirement such as username or password.

*[-name]* is a definable. Ie: a *data-pattern-uppercase* attribute has class names of *pattern-uppercase-valid* *pattern-uppercase-invalid* 

```html
<label>
  Password: <br>

  <input name="password"  required id="password"
    data-pattern-uppercase="[A-Z]"
    data-pattern-lowercase="[a-z]"
    data-pattern-digit="\d"
    data-pattern-symbol="[$%.#]"
    data-pattern-nospace="^[\S]+$"
    data-pattern-size="^.{6,10}$"
    data-pattern-allow-chars="^[A-z0-9$%.#]+$">

  <div class="smartform">
    <div class="required">This field is required</div>
    <ul>
      <li class="pattern-uppercase"> At least 1 upper case letter </li>
      <li class="pattern-lowercase"> At least 1 lower case letter </li>
      <li class="pattern-digit"> At least 1 number </li>
      <li class="pattern-symbol"> At least 1 symbol of $ % . # </li>
      <li class="pattern-nospace"> No space </li>
      <li class="pattern-size"> 6 to 10 characters </li>
      <li class="pattern-allow-chars"> Valid characters </li>
    </ul>
  </div>
</label>
```

Add CSS for the new classes

```css
/* change color to green when a pattern is valid */
.pattern-uppercase-valid .pattern-uppercase,
.pattern-lowercase-valid .pattern-lowercase,
.pattern-digit-valid .pattern-digit,
.pattern-symbol-valid .pattern-symbol,
.pattern-nospace-valid .pattern-nospace,
.pattern-size-valid .pattern-size,
.pattern-allow-chars-valid .pattern-allow-chars 
{
  color:green;
}

/* change color to red when a pattern is invalid only when it's out of focus
   so not all of them display red when the field is in focus
*/
.visited.pattern-uppercase-invalid .pattern-uppercase,
.visited.pattern-lowercase-invalid .pattern-lowercase,
.visited.pattern-digit-invalid .pattern-digit,
.visited.pattern-symbol-invalid .pattern-symbol,
.visited.pattern-nospace-invalid .pattern-nospace,
.visited.pattern-size-invalid .pattern-size,
.visited.pattern-allow-chars-invalid .pattern-allow-chars 
{
  color:red;
}

/* always show the required list */
.smartform ul {
  display:block;
}
```

This password field requires at least 1 upper-case, 1 lower-case, 1 number, 1 symbol of $ % . #, 6 to 10 chactaers, and only allow letters and numbers and a set of defined symbols. 


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


    
