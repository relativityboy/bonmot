## BonMot [![NPM version][npm-image]][npm-url] [![Join the chat at https://gitter.im/bonmotjs/Lobby](https://badges.gitter.im/bonmotjs/Lobby.svg)](https://gitter.im/bonmotjs/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)



**Important note for moving from 4.3->5.0+ update your 'stickit' dependency name to 'backbone.stickit'. 
(when using webpack you can probably remove the mapping entirely)

**Easy to Use. Nicely scalable.**

Backbone has a fantastic set of mature, reliable, and performant libraries. But getting them to work 
together requires a ton of glue code. Modern frontend frameworks try to negotiate away that glue code
 and lower the barrier to entry at the same time. While fine for small apps that don't do much between
  page reloads, they perform poorly in larger apps, and can outright fight you when trying to do things 
  'your way'.

Enter BonMot. The js app-engine for your future. 

BonMot eliminates much of the glue while still giving you control over how you create your application. 
Under the hood BonMot uses [Stickit](https://github.com/NYTimes/backbone.stickit), 
and [DW-Backbone](https://github.com/relativityboy/dw-backbone). It gives you all the power of these
libraries while providing you with a much more terse, and clear way to express yourself.

One of the best-parts, because most of BonMot's magic is done when you call Model.extend and 
View.extend - using BonMot results in pages that run as fast as if you'd hand-rolled your code.

Like Backbone, BonMot is *not* aimed at novice developers. You can learn Backbone and Bonmot at the same
time, but you should know how to bind events to elements, the purpose of .prototype, and MVC/MV*.


### Transparency & Testing

BonMot is designed with transparency in mind. The philosophy is all of the convenience and reliability
with none of the indirection. There may be times you need to do "*weird stuff because management*".
Developers can get at and understand the guts of BonMot with ease, and the patterns in BonMot are such
that 'awkward code' will stand out clearly, giving you opportunities to target tech-debt before it becomes
a problem.

BonMot's internal structure makes test writing simple and clear, without the need for special injectors or 
tooling above and beyond your regular test suite.
```javascript
  //some view you created by extending Bonmot.View
  var view = new MyView({model:{firstName:'x', lastName:'z'}}); 
  // $elf is an alias of view.$el.find()
  assert(view.$elf('js-atr-firstName').val() === 'x', 'firstName bound to the dom');
    
  //or
  
  //some model you created by extending Bonmot.Model
  var model = new MyModel({firstName:'x', lastName:'z'}); 
  var view = new MyView({model:model}); 
        
  assert(view.$elf('js-atr-firstName').val() === 'x', 'firstName bound to the dom');
```


#### Separation of concerns, all in one place

The way BonMot is built, you can put things where you want, but you're encouraged to keep your html, css, 
and javascript for a component in separate files, but all in the same directory.

### Bindings

You can prefix your binding classes with whatever you want. I like 'w'; Airbnb prefers 'js'. You can choose whatever 
you like by setting the *.bindPrefix* attribute in your view class.
 
#### Attribute bindings

To bind a data attribute from a Model into the page
 
```html
<!-- in your html, depending on if .bindPrefix:'.w' -->
<input class="js-atr-firstName">
<!-- or bindPrefix:'.js' -->
<span class="js-atr-lastName"></span>
```
```javascript
//In your view declaration
{
  uiBindings:['firstName', 'lastName']
}
```
 
This is enough to get you through most scenarios. You can add models right away, update them, or even change them.
 but you can do a **lot** more than simple values.

#### Control bindings

To add a control to the page
```html
<button class="js-ctrl-makeAllTheThings">Yep</button>
```
```javascript
//In your view declaration
{
  ctrlMakeAllTheThings:function(event) {
    //make all the things
  }
}

```

Bind that control to whatever html element you like by adding the class *w-ctrl-makeAllTheThings*

#### Views Are Easy
**Easily nest Models and Views** on complex pages. Declare a view, and set it as a child-view 
on another view via *.atrViews*. It will automatically 
be created, and have it's model assigned and updated as the parent view's model is updated.

**This works for Collections** too! If you have a list of things BonMot will manage your views for you. 
Support for collections comes with free in-browser support for next/prev/last/first/goto pagination, and search.

**Template Engine Agnostic** declare whatever template engine you want, or none. You may find BonMot is smart
enough that you don't need one. (Originally written with built-in handlebars support, I decided it was a liability, 
and with only one exeption, the example project's templates are static html). 

BonMot is even smart enough to use the pre-existing html within its dom element if no tempalate has 
been given to it. This is a big advantage in scenarios where server side devs really feel a need to 
output html for insecurity reasons.

#### Life Cycle Management
Once your app is started, instantiating models and views can be as simple as handing a servers response to 
your root view. If the models change, so do the associated views. they're updated, created, and deleted
to reflect current state of your model tree. 
If you need to do something peculiar, everything is easily accessible with
classic Backbone and DW-Backbone. 

#### Contained
If you use requirejs or some other AMD compatible loader on your site, BonMot is easy to add to a small 
part of your page. Try it in a widget!

#### The App is the Model Tree

That's not true, but the Model Tree IS the source of truth for the app. If the model changes, the view keeps up.
```javascript
/**
* On a personal note, I keep hearing about "hoisting values" from other modern frameworks. IMO, hoisting is a load of
* garbage. IMO, a tree is the way to go. Little views like leaves, and when the trunk sways, the branches and the leaves
* do the same.
* 
* Trees rock. Hoisting is lame.
*/
```

#### Working Examples
For an ever-evolving set of examples, see [bonmot-examples](https://github.com/relativityboy/bonmot-examples/)

[npm-image]: https://img.shields.io/npm/v/bonmot.svg
[npm-url]: https://www.npmjs.com/package/bonmot
