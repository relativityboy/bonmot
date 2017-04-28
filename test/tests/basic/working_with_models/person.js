define([
  'hbs!./person',
  'hbs!./person_suffix',
  'bonmot'
  ],
  function(
    tplPerson,
    tplPersonSuffix,
    BonMot
  ) {
    var _export = {};

    /**
     * This model is just simple model with a little attribute update function to make our examples more interesting
     */
    _export.Model = BonMot.Model.extend({
      initialize:function() {
        this.on('change:firstName change:lastName', this.setDisplayName, this);
        this.setDisplayName();
      },
      setDisplayName:function() {
        this.set('displayName', this.get('lastName') + ', ' + this.get('firstName'));
      }
    });

    _export.View = BonMot.View.extend({
      /**
       * This model assignment allows BonMot to do all kinds of introspection based on the features & standards
       * established in DWBackbone
       */
      Model:_export.Model,

      /**
       * This handlebars template will be automatically rendered when the view is instantiated
       */
      tpl:tplPerson,

      /**
       * These model attributes will be respectively bound to .w-atr-firstName , .w-atr-lastName , .w-atr-displayName
       */
      uiBindings:['firstName','lastName', 'displayName'],
      ctrlTestFunction:function () {
        this.model.set('controlValue', this.model.get("displayName"));
      },
      ctrlKeyUpFn:function() {
        //no-op
      }

    });

    _export.ViewNeedsModel = _export.View.extend({
      needsModel:true
    });

    return _export;
});