smartform
---------  

A jQuery plugin to validate form fields. It applies classes to the input field wrapper,
so the messages can be easy controlled by CSS. Several things it currently does:

* required fields
* pattern
* multiple patterns (example: Password Strength Meter)
* prefix class name for individual field to avoid class name colliding
* callback function for form and individual field
* submit invalid


See [DEMO](http://lancevo.github.io/smartform/index.html)


Since smartform is only adding and removing class names of the wrapper of input field,
so you don't need to follow the css/html below. Just be aware of the classnames that smartform is
adding the wrapper.

### Usage
```javascript
$("form").smartform();
```

### CSS example

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

### HTML example
```html
<form>
    <section>
        <label for="input1"> Input 1:</label>
        <input id="input1" type="text" required name="input1">

        <div class="sfm">
            <div class="focus">this is a .focus message</div>
            <div class="required">this field is required</div>
        </div>
    </section>
    <input type="submit" name="submit">
</form>
```

