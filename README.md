smartform
=========

It works with HTML5 attributes, and validates the value as soon the input field is out of focus. 
Extremely easy to customize your messages. 


**prerequisite: jQuery 1.7+**


### supporting events
It supports common JavaScript events such as **mouseover, mouseout, focusin, focusout, blur, change, keyup**. 
Smartform translates the JavaScript events into a meaningful class names based on the action, 
and adds these class names to the input *field container*. <br/>
These event class names are in the css below.

### basic stylesheet
Hide the messages on page load, and show them when a class is add to the *field container*

```css
/* hide all messages */
.smartform > div {
  display: none;
}

/* supported events, 
the event class name is added to field container when it's triggered  */
.hover .hover,
.focus .focus,
.target .target,
.enabled .enabled,
.visited .visited,
.disabled .disabled,
.checked .checked,
.unchecked .unchecked,
.selected .selected,
.indeterminate .indeterminate,
.invalid .invalid,
.valid .valid,
.required .required,
.in-range .in-range,
.out-of-range .out-of-range {
  display:block;
}
```

### focus event

The *.focus* message is shown when you click on the input field or when the element is focused. 
Because a class name **focus** is added to the field container. Once it's out of focus, the class is removed from the field container.

```html
<div> <!-- this element is a field container, being used by smartform to add class names -->
  <label for="city">City name</label>
  
  <input id="city" type="text" name="city">
  
  <div class="smartform">
    <div class="focus"> Please enter the city name of your birthplace </div>
  </div>
</div>
```

### required 

add **required** to the *input* field to make it a required field <br>
works with *input[text, checkbox, tel..], select, textarea* elements. <br>
For *radio* buttons, make sure one of the radio is checked. 

```html
<div> <!-- this element is a field container, being used by smartform to add class names -->
  <label for="city">City name</label>
  
  <input id="city" type="text" name="city" required>
  
  <div class="smartform">
    <div class="focus"> Please enter the city name of your birthplace </div>
    <div class="required"> You must enter the city name </div>
  </div>
</div>
```

### visited

When an input field is clicked, 
```html
<div> 
  <label for="pizza">What pizza do you like</label>
  
  <input id="pizza" type="radio" name="pizza" value="cheese"> Cheese  
  <input id="pizza" type="radio" name="pizza" value="pepperoni"> Pepperoni
  <input id="pizza" type="radio" name="pizza" value="bacon"> Bacon
  
  <div class="smartform">
    <div class="visited"> Thank you for your selection. </div>
  </div>
</div>
```

### checked / unchecked

```html
<div>   
  <input type="checkbox" name="agree" required> You must agree to blah blah blah.  
  <div class="smartform">
    <div class="unchecked"> You must check this box before proceeding to the next step </div>
  </div>  
</div>
```

### selected 


```html
<div>   
  <select required>
    <option value="">Select 1 of the options</option>
    <option value="a">Option A</option>
    <option value="b">Option B</option>
  </select>
  
 
  <div class="smartform">
    <div class="required"> You must choose 1 of the options </div>
    <div class="selected"> Thank you for your selection </div>
  </div>  
</div>
```

### pattern 
You can validate the value with pattern attribute. If the value passes the validation, a class name **"valid"** 
is added to the field container. Otherwise a class name **"invalid"** is added if it fails the validation.

It accepts regular expression, for more common patterns see this page [http://html5pattern.com/](http://html5pattern.com/). 
It's super easy.

```html
<div> <!-- this element is a field container, being used by smartform to add class names -->
  <label for="city">City name</label>
  <input id="city" type="text" name="city" pattern="[A-Za-z \.]">
  <div class="smartform">
    <div class="focus"> Please enter the city name of your birthplace. </div>
    <div class="invalid"> Please enter only letters, spaces, or periods.</div>
    <div class="valid"> The city name is valid.</div>
  </div>
</div>
```





