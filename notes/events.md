#Thinking about event propagation

Is automatic bubbling up a good idea for models or views?

Anything that's "on" should probably be made 'listenTo'. Just for modern convention (I think
we're good on memory management already)