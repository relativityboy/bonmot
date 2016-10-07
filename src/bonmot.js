define([
  'underscore',
  'backbone',
  'jquery',
  'handlebars',
  'stickit',
  'dw-backbone'
], function(
  _,
  Backbone,
  jQuery,
  Handlebars,
  Stickit,
  DWBackbone
) {
  var _export = _.clone(DWBackbone),
    View;

  //ROOT VIEW
  View = _export.View = Backbone.View.extend({
    parent:false,

    /**
     *
     */
    hbs:false,

    /**
     * Used to locate properly suffixed attribute or control elements within the views root DOM node.
     * It may be left as an empty string, but class name collisions could result if there are child-views.
     * And before you complain - performance comes at a price. Typing out a tiny string is no big deal compared
     * with the horrors of Angular.
     */
    classSuffix:'',

    /**
     * convenience function for finding elements within this view. Use it!
     * @param cssExpr
     * @returns {*}
     */
    $elf:function(cssExpr) {
      return this.$el.find(cssExpr);
    },

    constructor: function(options) {
      var $el;
      if (arguments.length > 0) {
        if(arguments[0].hasOwnProperty('parent')) {
          this.parent = arguments[0].parent;
        }
        this.options = options;
      } else {
        this.options = {};
      }
      if(typeof this.hbs === 'function') {
        if(options.el) {
          $el = jQuery(options.el);
          $el.append(this.hbs());
        } else {
          $el = jQuery(this.hbs());
          options.el = $el[0];
        }
        this.$el = $el;//needed for $elf & findControlElements
        this.findControlElements();
      }

      Backbone.View.apply(this, arguments);

      if(this.model) {
        this.stickit();
      }
    },

    findControlElements:function() {
      this.$ctrl = {};
      console.log(this.$el[0])
      _.each(this.ctrlElementClasses, function(cssExpr,key) {
        console.log(cssExpr)
        this.$ctrl[key] = this.$elf(cssExpr);
      }, this);
    },

    /**
     * called by 'setModel' adds this view to a models 'views' array (creates the array if it does not exist)
     * This allows views that use a particular model to be removed from the dom if the model is disposed.
     */
    setViewOnModel:function() {
      if(!this.model.hasOwnProperty('views')) {
        this.model.views = [];
      }
      this.model.views.push(this);
    },

    /**
     * Sets a model on this view and binds the model's attributes to the view.
     * If a model was already set on the view, it is unset, and unbound.
     * ** Nested views and models must be handled manually at this time.
     * @param model
     * @returns {_exports.View}
     */
    setModel:function(model) {
      this.unsetModel();
      if(model) {
        if(model) {
          this.model = model;
        }
      }
      this.model = model;
      this.setViewOnModel();
      this.trigger('setModel', model, this);
      this.stickit();
      return this;
    },
    /**
     * Unbinds and unsets the current model from this view.
     */
    unsetModel: function() {
      var model = false;
      if(this.model) {
        this.model.off(null, null, this);
        this.unstickit();
        if(this.model.views) {
          for (var i = 0; i < this.model.views.length; i++) {
            if (this === this.model.views[i]) {
              this.model.views.splice(i, 1);
              break;
            }
          }
        }
        this.trigger('unsetModel', model, this);
        model = this.model;
        delete this.model;
      }
      return model;
    },
    remove:function() {
      this.unsetModel();
      Backbone.View.prototype.remove.call(this);
    }
  });

  var ViewExtend = View.extend;

  //TODO: test this new extend functionality
  /**
   * Preprocessor to support Bon-Mot functionality.
   * 1. processes 'ctrl' prefixed functions and adds them to the events binding object
   * 2. Takes .uiBindings list and translates it into 'stickit' style bindings
   * @param childView
   * @returns {*}
   */
  View.extend = function(childView) {
    /**
     * Creates automatic event binding for functions conforming to
     *  ctrl[<Eventtype>]SomeName
     * where html css classes on dom elements to be bound are
     *  w-ctrl-someName
     * @type {string}
     */
    var classSuffix = (childView.hasOwnProperty('classSuffix')) ? '-' + childView.classSuffix : '',
      ctrlNameFragment, event, eventExpression, fnNameFragments;

    /**
     * Add atrViews declaration if it doesn't exist.
     * @type {{}}
     */
    childView.atrViews = (childView.hasOwnProperty('atrViews'))? childView.atrViews : {};

    if(!childView.events) {
      childView.events = {};
    };
    childView.ctrlElementClasses = {};

    _.each(childView, function(fn, fnName) {
      if((typeof fn === 'function') && (fnName.indexOf('ctrl') === 0)) {
        event = 'click';
        fnNameFragments = DWBackbone.toUnderscored(fnName.substring(4)).split('_');
        switch(fnNameFragments[0]) {
          case 'mouseout' :
          case 'mouseover' :
          case 'keypressed' :
          case 'keydown' :
          case 'keyup' :
          case 'click' :
            event = fnNameFragments.shift();
        }
        ctrlNameFragment = DWBackbone.toCamel(fnNameFragments.join('_'));

        ctrlNameFragment = ctrlNameFragment.replace(ctrlNameFragment.charAt(0), ctrlNameFragment.charAt(0).toLowerCase());
        childView.ctrlElementClasses[ctrlNameFragment] = '.w-ctrl-' + ctrlNameFragment + classSuffix;
        eventExpression = event + ' ' + childView.ctrlElementClasses[ctrlNameFragment];

        if(!childView.events.hasOwnProperty(eventExpression)) {
          childView.events[eventExpression] = fnName;
        }
      }
    });

    /**
     * Take .uiBindings list and translate into 'stickit' style bindings
     */
    if(!childView.hasOwnProperty('bindings')) {
      childView.bindings = {};
    };
    if(!childView.hasOwnProperty('uiBindings')) {
      childView.uiBindings = [];
    };
    if(childView.uiBindings.constructor !== Array) {
      throw new Error('uiBindings for view must be Array', childView);
    }
    _.each(childView.uiBindings, function(binder) {
      if(typeof binder === 'string') {
        binder = {
          observe:binder
        }
      }
      if(!binder.hasOwnProperty('observe')) {
        console.log('Error when constructing bindings. Cannot locate .observe:', binder, 'on view declaration:', childView)
        throw new Error('Error when constructing bindings. Cannot locate attribute name to observe on view declaration. See log statement');
      }

      if(!binder.hasOwnProperty('find')) {
        binder.find = '.w-atr-' + binder.observe + classSuffix;
      }

      if(!childView.bindings.hasOwnProperty(binder.find)) {
        childView.bindings[binder.find] = binder;
        delete binder.find;
      }
    });

    return ViewExtend.call(View, childView);
  };

  _export.Model = DWBackbone.Model.extend({});

  return _export;
});
