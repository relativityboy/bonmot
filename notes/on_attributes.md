#On attribute binding & rendering
**Binding attributes of a model into that model's view.**

If BonMot is about anything, it's about handling bindings 
to attributes, views, or whatever as easily as possible.

##Simple Attributes .x
We use .uiBindings with a list of attribute names, or .bindings - which conforms to the stickit standard.
.bindings will take precedence over .uiBindings.

##Attributes that need their own views.
We'll use *.atrViews[someAttributeName] = SomeView* declaration. The view itself will handle instantiation.
We'll expect that Model.get('someAttributeName') returns a model that is compatible with SomeView.

##Attributes that are lists of things .[]
###Lists of things 1 - Framing the problem
The book-ends to the world of 'lists of things' are as follows:
1. Very simple lists, composed of an array of primitive 
values, available on 'new' that never changes. 
1. Collections with models in them that justify their own views.
    1. Pagination on these lists

**Thinking about a solution - Enter *list-bindings*** 

A list-binding applies to an attribute on the current
model that doesn't warrant its own view or set of views, but is either an array or a collection.
The attribute may or may-not change its members, and those members may be strings, ints, objects
with properties we want to render, or full-fledged models. 
**We don't want to *have* to declare a view, or a special model, to manage the list. After-all, 
basic list management tasks are pretty straight-forward.**

We'll automatically manage any attribute that's a list, so long as it has either a View or a Handlebars 
template described at the appropirate attribute in .atrViews. Internally Bonmot will create a list view 
manager to handle creating and updating the html. 

###Lists of things 2 - pagination
Users could create pagination setups without too much difficulty by creating a parent view to handle controls, 
page-number, etc, but automating the process is a nicer path.
 
To take care of the tedium described above, ysers will have the ability to paginate, sort, search, and set page 
lengths just by declaring controls and attributes in the HTML.
1. works with in-browser data (for now)
1. have a page-length
1. support previous & next controls
1. support go-to page select & input controls
1. search (by specified field)

###Lists of things 3 - execution
The initial version is done as described above. It's more powerful than what's described above, too.
* also we need to enable pagination for things that done have views

##Binding UI to multiple attributes - in progress
Sometimes we may want to output the result of two or more attributes. This can be done by creating a 'for display'
attribute on the model, but that kind-of sucks; because models are models.

I'm thinking right now about a .w-< something >-functionName standard. Functions declared according to the standard will
have updated attribute values passed to them, and be triggered on change of any-one. What they return is put into 
.val() .html() or .text(). I'm not sure how to best define the standard for attribute listening, as minification may 
collapse attribute names.

##Abandoned thoughts
 
###Lists of things

* Lists of things
    * Any input that can update state via the UI introduces complexity, os we will assume there are 
no *input* elements other than buttons in a list like this. 

    * As such, a list-binding should be easily declarable in *uiBindings*. A classic binding there looks
like **'attributeName'**. A list binding needs more. Given its possible complexity, we need to know
that it's a list, what its markup should look like, and possibly more. 
**'attributeName,type,hbsName,??'**.
hbsName referrs the the hbsTemplate that's to be used on the attribute instance. Growning on this,
we may want that attribute
    * Some thoughts around what we'll need.
        * attribute Name
        * type - list/object/string (?? can introspect @ runtime, but this may provide advantages)
        * hbsTemplate - ??where do we assign the template? Do we want to somehow merge this with atrViews?
    * What about times when we do want input, or when we want to display a list of things, with checkboxes
but then want to bind *into those* checkboxes to define a different list attribute?