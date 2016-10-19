#BonMot

Easy to Use. Nicely scalable.

Backbone has a fantastic set of mature, reliable, and performant libraries. But getting them to work 
together requires a ton of glue code. Marionette used to fill this gap, but applications have grown 
more complex, and developer expectations are higher. Browser performance can be a real issue with 
some of the more popular frameworks.

Enter BonMot. The js app-engine for your future.

BonMot removes much of the glue while still giving you control over how you create your application. 
Under the hood BonMot uses Stickit, Handlebars, and DW-Backbone. It gives you all the power of these
libraries while providing you with a much more terse, and clear way to express yourself.

One of the best-parts, because most of BonMot's magic is done when you call Model.extend and 
View.extend - using BonMot results in pages that run as fast as if you'd hand-rolled your code.
 
 
####Attribute bindings

To bind a data attribute from a Model into the page, for example 'name', in the html add the class *w-atr-name* 
to the corresponding element, and add 'name' to the uiBindings array on the view *uiBindings:['name']*
 
This is enough to get you through most scenarios, but you can do a **lot** more.

####Control bindings

To add a control to the page, define a control function in your View like *ctrlMakeAllTheThings:function(){...}*

Bind that control to whatever html element you like by adding the class *w-ctrl-makeAllTheThings*

####Easy Views

Easily nest Models and Views on complex pages. Declare a view, and set it as a child-view 
on another view via *.atrViews*. It will automatically 
be created, and have it's model assigned and updated as the parent view's model is updated.

*This works for collections too if you use BonMot based models and set the optional 
.modelInfo attribute on the parent-view.


####Life Cycle Managment
*TODO:Describe View life cycle management*

####Working Examples
For an ever-evolving set of examples, see [bonmot-examples](https://github.com/relativityboy/bonmot-examples/)
