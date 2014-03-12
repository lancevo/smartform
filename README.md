smartform
---------  

A jQuery plugin to validate form fields. It applies classes to the input fields,
so the necessary messages can be easy controlled by CSS. It also has a few features
to extend the common form validation such as:   


* pattern
* multiple patterns
* callback function for form and individual field
* prefix class name for individual field to avoid class name colliding

In most cases, smartform utilizes html5 attributes, however it disables browser built-in form validation
so that it doesn't conflict . If javascript is disabled, these html5 attributes will be validated by the browser.


Demo
----

* [Password strength meter](#)
* [Multiple select boxes - class name prefix](#)
* [Pattern](#)
* [Multiple patterns](#)
* [Callback function](#)

### Usage

```javascript
$("form").smartform();
```

### Basic CSS
Add your own css if you need to

```css
/* hide all smartform messages */
.sfm > * {
  display: none;
}

/* show smartform message */
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
```


### `.focus` and `.visited`

`.focus` class is added to a wrapper when the input field is in focus, and removed when it's blurred. 

`.visited` class is added to a wrapper once the input field is blurred. 

demo: <http://jsfiddle.net/lvo811/DEBLF/>


### attribute `required` 

attribute `required` works on most fields & options except `radio` buttons.
To require user to check one of the radio buttons, just add attribute `checked` on one of the radio button.

If the value of an input field is empty, `.required` class is added to the input wrapper, in the demo below the wrapper is `<section>`   

demo: <http://jsfiddle.net/lvo811/k4H5N/>




### `.checked`

Smartform automatically adds `.checked` and `.not-checked` to any radio buttons and check box wrapper.
If you want to display individual message for each radio button or check box, see `data-smartform-prefix` attribute example.

demo: <http://lancevo.github.io/smartform/demo/check-1.html>




	



  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
### OLD DOC ###


demo <http://lancevo.github.io/smartform/>  
source annotation: <http://lancevo.github.io/smartform/docs/smartform.html>

It's a jQuery plug-in to validate form fields. It adds necessary classes so you can customize your messages and it gets out of the way. Also, it supports [multiple regular expressions](#data-pattern-name), so you can write rules without writing JavaScripts.

It uses error approach method, there's no validation initially, unless the input field is focused or the form is submitted.


###Features:
* [check for required fields](#required)
* [fields comparision](#data-smartform-match)
* [field validator with Regular Expression](#pattern)
* [support multiple validators](#data-pattern-name)

**requires jQuery 1.7+**  
tested on: IE7+, FireFox, Chrome, Safari


classes
=======

Depending on the input field's validation, these classes are added to input field's parent element or ancestor's element. 

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


Validations
================

##  Required Input Field

To ensure the field is required, add `required` attribute to the input field. Class **.required** is added to the wrapper or parent element, which is `<label>` in this case,  when the input field's value is empty or has only spaces 

```html
<label> 
  <input required name="username"> 
  <div class="smartform">
    <div class="required"> This field is required</div>
  </div>
</label>
```

## Add the classes to the ancestor instead of parent's element

If you want to add the classes to an ancestor element other than the input field's parent element, it can be assigned in **data-smartform-wrapper** attribute. 

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

The classes are added to  `#wrapper1` instead of `.right`

## Compare this input field's value with another input field's value

It's commonly used for email/password verification. When 2 input fields' values need to be matched. 

Insert `data-smartform-match="comparingElement"` to the input field. **comparingElement** can be an input field's name, id, or a classname. If the values are the same, a class `.matched` is added to the input field's parent element, otherwise a class `.not-matched` is added.


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

Smartform is actively comparing the while the user's re-entering the password. Once the value of *password-verify* is the same as *secret*, it adds class `.matched` to the `#field2`.  
If the input field is out of focus, the value of *password-verify* doesn't match with *secret*, smartform will add `.not-matched` to `#field2`. This only happens when the input field is out of focus.


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


### Select Box

Smartform supports `required` attribute for `select` box. It checks
for the value of the select box, if the selected option(s) value is empty,
it adds `.required` to the `input` container. In case of multiple options,
if two or more options selected as long one of them is not empty that would
satisfy the validation.


demo: <http://lancevo.github.io/smartform/select.html>

```html
 <section>
     <label for="single-option"> Select an option </label>
     <select id="single-option" required>
         <option value=""> Empty</option>
         <option value="opt1"> Option 1</option>
         <option value="opt2"> Option 2</option>
         <option> Option 3</option>
     </select>
     <div class="smartform">
         <div class="required">
             This field is required. Please pick one
         </div>
     </div>
 </section>

 <section>
     <label for="multi-options"> Select multiple options </label> <br>
     <select id="multi-options" required multiple>
         <option value="">Empty</option>
         <option value="opt1"> Option 1</option>
         <option value="opt2"> Option 2</option>
         <option> Option 3</option>
     </select>
     <div class="smartform">
         <div class="required">
             This field is required. Please pick one
         </div>
     </div>
 </section>
```







    
