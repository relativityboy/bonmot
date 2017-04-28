## Thinking about event propagation

* Is automatic bubbling up a good idea for models or views?
* onModel:{} - a binding object to perform functions when something in the model changes
This could be really good for persistent views, though most is already handled by dom
data-binding
* Anything that's "on" should probably be made 'listenTo'. For convention's sake (I think
we're good on memory management already, as we destroy listeners when the view goes away)





