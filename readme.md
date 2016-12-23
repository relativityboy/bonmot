#BonMot

Easy to Use. Nicely scalable.

Backbone has a fantastic set of mature, reliable, and performant libraries. But getting them to work 
together requires a ton of glue code. Marionette used to fill this gap, but applications have grown 
more complex, and developer expectations are higher. Browser performance can be a real issue with 
some of the more popular frameworks.

Enter BonMot. The js app-engine for your future.

BonMot eliminates much of the glue while still giving you control over how you create your application. 
Under the hood BonMot uses [Stickit](https://github.com/NYTimes/backbone.stickit),
[Handlebars](https://github.com/wycats/handlebars.js), 
and [DW-Backbone](https://github.com/relativityboy/dw-backbone). It gives you all the power of these
libraries while providing you with a much more terse, and clear way to express yourself.

One of the best-parts, because most of BonMot's magic is done when you call Model.extend and 
View.extend - using BonMot results in pages that run as fast as if you'd hand-rolled your code.


####Transparency
BonMot is designed with transparency in mind. The philosophy is all of the convenience and reliability
with none of the indirection. There may be times you need to do "*weird stuff* because management".
Developers can get at and understand the guts of BonMot with ease, and the patterns in BonMot are such
that 'awkward code' will stand out clearly, giving you opportunities to target tech-debt before it becomes
a problem.

 
####Attribute bindings

To bind a data attribute from a Model into the page, for example 'name', in the html add the class *w-atr-name* 
to the corresponding element, and add 'name' to the uiBindings array on the view *uiBindings:['name']*
 
This is enough to get you through most scenarios, but you can do a **lot** more.

####Control bindings
To add a control to the page, define a control function in your View like *ctrlMakeAllTheThings:function(){...}*

Bind that control to whatever html element you like by adding the class *w-ctrl-makeAllTheThings*

####Easy Views
**Easily nest Models and Views** on complex pages. Declare a view, and set it as a child-view 
on another view via *.atrViews*. It will automatically 
be created, and have it's model assigned and updated as the parent view's model is updated.

**This works for Collections** too! If you have a list of things BonMot will manage your views for you. 
Support for collections comes with free in-browser support for next/prev/last/first/goto pagination, and search.

####Life Cycle Management
Once your app is started, instantiating models and views can be as simple as handing a server response to 
your root view. If the models change, so do the associated views, being updated, created, and deleted
to reflect current state. If you need to do something peculiar, everything is easily accessible with
classic Backbone and DW-Backbone 

####Contained
If you have requirejs on your site, BonMot is easy to add to a small part of your page. Try it in a widget!

####Working Examples
For an ever-evolving set of examples, see [bonmot-examples](https://github.com/relativityboy/bonmot-examples/)
