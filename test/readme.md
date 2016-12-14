###Basic View Tests

####Fundamentals
* basic .hbs population
* model hydration via .Model
* event binding with .uiBindings  
* control binding
* injectunique class
    * injects class
    * throws error on duplicate unique class
* inject view cid
* inject model cid
* .$elf finds only within view dom scope
* .$ctrl contains control elements
* .classSuffix (all)
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
        * clearUIOnUndefinedModel == false
            * model cid injection updated
            * test ui <> model
                * test old model to see that it is NOT updated
        * clearUIOnUndefinedModel == true
            * model cid injection updated
            * test ui <> model
                * test old model to see that it is NOT updated
