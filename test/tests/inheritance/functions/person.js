define([
  'hbs!./person',
  'bonmot'
  ],
  function(
    tplPerson,
    BonMot
  ) {
    var _export = {};

    _export.Model = BonMot.Model.extend({});

    _export.View = BonMot.View.extend({
      Model:_export.Model,
      hbs:tplPerson,
      fnInheritGetApple:function() {
        return this.model.get('firstName');
      },
      fnOverrideGetAttribute:function () {
        return this.model.get('firstName');
      },

    });

    _export.ViewExtended= _export.View.extend({
      fnOverrideGetAttribute:function () {
        return this.model.get('lastName');
      },
    });

    return _export;
});