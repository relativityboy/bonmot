#Thinking about event propagation

* Is automatic bubbling up a good idea for models or views?

* Anything that's "on" should probably be made 'listenTo'. Just for modern convention (I think
we're good on memory management already)

* onSetModel - function to be called IMMEDIATELY after this.model = _**some new model**_

* onModel:{} - a binding object to perform functions when something in the model changes



