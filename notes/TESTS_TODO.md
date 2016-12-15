#Tests to be written

###Inheritance preservation tests
        
* replace hbs.
    * parent/child hbs replacement. Be sure each renders correct template
* control binding inheritance
    * create parent with 2 ctrl functions, replace 1 ctrl binding in child. Be sure correct
    binding functions fire for both parent and child instances
* replace atr bindings on uiBindings

###Child View Tests
* Auto Instantiation of child view
    * if needs model == true
        * not instantiated if attribute missing
        * instantiated if present
        * instantiated if missing when created, and then SET
        * self deletes, including root node, if unset
* If needs model == false
    * instantiated when parent instantiated
    * changes model when parent model attribute changes
    * sticks around if parent model attribute is unset or set to 'undefined'

###Basic CollectionView Tests
* creation of child views
    * on instantiation
* re-ordering of child views 
    * collection sort
* destruction of child views 
    * based on model deletion
    * based on removal of element from collection
* subsets
    * pagination
        * pagelength
            * correct length
            * correct items, correct order
        * first
            * correct items, correct order
        * last
        * goto
        * next
        * prev
    * search
        * pagination in search
            * goto
            * correct items, correct order
