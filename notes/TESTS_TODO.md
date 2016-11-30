#Tests to be written
Rough notes to organize my thoughts. Test-stubs to follow.

###Basic View Tests

####Fundamentals
* basic .hbs population - done
* model hydration via .Model - done
* event binding with .uiBindings   - done
* control binding - done
* injectunique class
    * injects class - done
    * throws error on duplicate unique class - done
* inject view cid - done
* inject model cid - done
* .$elf finds only within view dom scope - done
* .$ctrl contains control elements - done
* .classSuffix - done (all)
    * .$ctrl missing elements without suffix
    * .w-ctrl & .ctrl
        * not bound if missing suffix
        * bound if suffix
    * .w-atr elements
        * not bound if missing suffix
        * bound if suffix 
  
####Views & Models               
* support no model on creation
    * needModel == false
    * needModel == true
  
* setModel
    * from no model
        * control binding updated
            * test ui <> model
        * model cid injection updated
    * change model
        * control binding updated
            * test ui <> model
                * test old model to see that it is NOT updated
        * model cid injection updated
        
    * null model
        * for needsmodel == false
            * clearUIOnUndefinedModel == false
                * model cid injection updated
                * test ui <> model
                    * test old model to see that it is NOT updated
            * clearUIOnUndefinedModel == true
                * model cid injection updated
                * test ui <> model
                    * test old model to see that it is NOT updated
        * for needsmodel == true
            * test that html is gone.


###Inheritance preservation tests
* replace hbs. & preserve atr and ctrl
* replace 1 ctrl binding
* replace atr bindings

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
