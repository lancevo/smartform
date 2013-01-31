smartform
=========

It works with HTML5 attributes, and validates the value as soon the input field is out of focus. 
Extremely easy to customize your messages. 


**prerequisite: jQuery 1.7+**




### basic stylesheet

Depends on the action and input type, these classes will be added to input container: 

- **.visited** : have clicked on this input
- **.focus** : the input is in focus, and removed when it's out of focus 
- **.checked** : one of radio buttons or a checkbox is checked  
- **.unchecked** : all of radio buttons or a checkbox is unchecked
- **.required** : (input field must have "required" attribute) the value is empty or is not checked
- **.valid** : entered value is passed the pattern test
- **.invalid** :  entered value is not passed the pattern test


These 2 classes are added to the **&lt;form&gt;** element when the form is submitted:

- **.submit-invalid** : one or more input fields failed validation
- **.submit-invalid** : passed the validation

```css
/* hide all messages */
form .submit-invalid, 
.smartform > * {
  display: none;
}

/* supported events, 
the event class name is added to input field container when it's triggered  */
.focus .focus,
.checked .checked,
.unchecked .unchecked,
.required .required,
.valid .valid,
.invalid .invalid,
.submit-invalid .submit-invalid {
  display:block;
}
```

### focus event

The *.focus* is added to input container when the element is focused. Once it's out of focus, 
the class is removed from the input container.

input container is usually a parent element, however you can target input container to any element 
by adding attribute *data-smartform* to to the input field  

```html
<div> <!-- default input container, when it's in focus it will have <div class="focus">  -->
  <label for="name">Your name</label>
  <input id="name" type="text" name="name">
  <div class="smartform">
    <div class="focus"> Please enter your name </div> <!-- html elements go here for when it's in focus --> 
  </div>
</div>
```

### required 
add **required** attribute to the input field to make it a required field <br>
works with *input, select, textarea* elements. <br>


```html
<div> 
  <label for="name">Your name</label>
  <input id="name" type="text" name="name" required> <!-- required attribute is added to the input field -->
  <div class="smartform">
    <div class="focus"> Please enter your name </div> <!-- html elements go here for when it's in focus --> 
    <div class="required"> This field is required, please enter your name. </div> <!-- required error message when value is empty -->
  </div>
</div>

<div> 
  <label for="pizza">What pizza do you like</label>
  <input id="pizza" type="radio" name="pizza" value="cheese" required> Cheese  
  <input id="pizza" type="radio" name="pizza" value="pepperoni"> Pepperoni
  <input id="pizza" type="radio" name="pizza" value="bacon"> Bacon
  <div class="smartform">
     <div class="required"> This field is required</div> <!-- required error message when value is empty -->
  </div>
</div>
```

### visited

When an input field is clicked, 

```html
<div> 
  <label for="name">Your name</label>
  <input id="name" type="text" name="name" > 
  <div class="smartform">
    <div class="visited"> You already clicked on this input</div>
  </div>
</div>
```

### checked / unchecked

```html
<div>
  <input id="pizza" type="radio" name="pizza" value="cheese" required> Cheese  
  <input id="pizza" type="radio" name="pizza" value="pepperoni"> Pepperoni
  <input id="pizza" type="radio" name="pizza" value="bacon"> Bacon
  <div class="smartform">
     <div class="checked"> Delicious! </div>
     <div class="unchecked"> Pick your topping </div> 
  </div>
  
  <input type="checkbox" name="agree"> Sign up for promotions  
  <div class="smartform">
    <div class="checked"> Thank you! Delicious deals are coming to your inbox.</div>
    <div class="unchecked"> Check this box for delicious promotions. </div>
  </div>  
</div>
```

### selected 

```html
<div>   
  <select required>
    <option value="">Delivery Option:</option>
    <option value="a">Carry out</option>
    <option value="b">Home delivery</option>
  </select>
  
  <div class="smartform">
    <div class="required"> You must choose 1 of the options </div>
    <div class="selected"> Thank you for your selection </div>
  </div>  
</div>
```

### pattern 
Smartform validates an input based on the value in **pattern** attribute. If the value passes the validation, a class name **.valid** 
is added to the input container. Otherwise a class name **.invalid** is added if it fails the validation. *Empty value is tested for pattern.*


Some common patterns are:
  Letters and spaces only: [A-Za-z ]+
  Alphanumeric: [A-Za-z0-9]+
  Credit card numbers (13 to 16 digits): [0-9]{13,16}
  
For more patterns see this page [http://html5pattern.com/](http://html5pattern.com/). 


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





