## Off the cuff
I'm thinking about state a little bit, and there's a part of me that wonders if
and invisible model, one that lives in a view for the life of the view would be 
a good thing. It wouldn't be instantiated, managed, or touchable by the developers
it would be a way to represent important parts of the view's overall state, and
broadcast events/trigger functions on the view. It might also serve as a kind of
translation layer between the UI & the Model.