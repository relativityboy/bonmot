#On attribute binding & rendering
**Binding attributes of a model into that model's view.**

If BonMot is about anything, it's about handling bindings, 
to attributes, views, or whatever as easily as possible.

##Simple Attributes .x

##Attributes that are lists of things .[]
**Framing the problem**

The book-ends to the world of 'lists of things' are as follows:
1. Very simple lists, composed of an array of primitive 
values, available on 'new' that never changes. 
1. Collections with models in them that justify their own views.

The 1st case is relatively easy to deal with. Use a Handlebars #each in the .hbs template

The 2nd case is technically difficult, but we've addressed add/remove/order events already, 
and other forms of event binding are handled by the child views.

**The actual problem** 

Between those book-ends is a mess of subtlety. If we wanted to approach lists 'The Java Way' we could declare
the second case the one that most completely covers all situations and be done. But declaring a 
new view+model+collection for every list in a user interface doesn't sound fun at all.
  
**Thinking about a solution - Enter *list-bindings*** 

I should be fair and tell you I have very little idea what a list-binding
is at this moment, but let's explore the idea. A list-binding applies to an attribute on the current
model that doesn't warrant its own view or set of views, but is either an array or a collection.
The attribute may or may-not change its members, and those members may be strings, ints, objects
with properties we want to render, or full-fledged models. 
**So mostly, we just don't want to have to declare a view or *necessarily* a model**

Any input that can update state via the UI introduces complexity, os we will assume there are 
no *input* elements other than buttons in a list like this. 

As such, a list-binding should be easily declarable in *uiBindings*. A classic binding there looks
like **'attributeName'**. A list binding needs more. Given its possible complexity, we need to know
that it's a list, what its markup should look like, and possibly more. 
**'attributeName,type,hbsName,??'**.
hbsName referrs the the hbsTemplate that's to be used on the attribute instance. Growning on this,
we may want that attribute

* attribute Name
* type - list/object/string (?? can introspect @ runtime, but this may provide advantages)
* hbsTemplate - ??where do we assign the template? Do we want to somehow merge this with atrViews?

What about times when we do want input, or when we want to display a list of things, with checkboxes
but then want to bind *into those* checkboxes to define a different list attribute?

##Lists of things 2 - pagination
Pagination and result limiting is something definitely worth talking about, particularly with our 
automatic list view hydration schema. People could create pagination setups without too much difficulty
by creating a parent view to handle the controls, page-number, etc, and using a second collection with all
the models (or objects) from which to pull the actual information we wanted to display.

Still Is there an easy way for us to automate that process? The pattern is frequent enough that we may 
want to take care of the tedium. I should:
1. focus on working with in-browser data (for now)
1. have a page-length
1. support previous & next controls
1. support go-to input, & go-to submit control
1. Support both 1 child-view per item, and simple html output
1. Search (by specified field)

**So how are we going to do this?**

Well, clearly we're going to need a 'default' view that handles all these things.
We'll first take the two list render views (the backbone one and the 'simple' one) and build them up 
to support everything in the above list. the .hbs attribute being present & non-null is what will 
cause it to branch down the more complex rendering path.

While we're doing that, we'll figure out a way to have them directly addable in atrViews, and allow an 
itemView to be declared off them (this will take the place of the atrView item)

##Lists of things 3 - execution
1. in-browser, page length, page, next last previous first - done
1. need search
1. want pageLength configurable in html, and in class definition
1. want 'sort in view'
1. want 'simple html' view/output
1. want server-calls?