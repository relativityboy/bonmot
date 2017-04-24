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
  var exports = _.clone(DWBackbone),
    CollectionView,
    View,
    vTemp, //here because pointers are a terrible thing to waste
    uniques = {};

  var AttributeRenderer = function(options) {
    this.$el = jQuery(options.el);
    this.hbs = options.hbs;
    //options.model = (options.model)? options.model : {};
    this.setModel(options.model);
  };

  AttributeRenderer.prototype.needsModel = false;

  AttributeRenderer.prototype.setModel = function(object) {
    object = (!!object)? object : {};
    var html = '';
    object = (object instanceof Backbone.Collection || object instanceof Backbone.Model)? object.toJSON() : object;
    if(object.constructor === Array) {
      for(var i = 0; i < object.length; i++) {
        html += this.hbs(object[i]);
      }
    } else {
      html = this.hbs(object);
    }
    this.$el.html(html);
  };

  /**
   * Stub functions for parent view
   */
  AttributeRenderer.prototype.remove = function() {
    delete this.$el;
    delete this.hbs;
  };

  AttributeRenderer.prototype.on = function() {
    //no-op
  };

  //ROOT VIEW
  View = Backbone.View.extend({
    /**
     * This is the declaration of the Model 'type' to be used with this view.
     * It is strongly recommended if this view has child-views.
     * It is recommended that the model have BonMot.Model in its prototype chain...
     * IE, the result of a BonMot.Model.extend() operation.
     */
    Model:false,

    parentView:false,

    /**
     * Handlebars Template or other 'function callable' template. Called when the view is instantiated.
     * If model is present on construction, will also be passed a toJSON representation of the model.
     */
    hbs:'',

    /**
     * Data used to populate the HBS templates.
     */
    hbsData:false,

    /**
     * Used to locate properly suffixed attribute or control elements within the views root DOM node.
     * It may be left as an empty string, but class name collisions could result if there are child-views.
     * And before you complain - performance comes at a price. Typing out a tiny string is no big deal compared
     * with the horrors of Angular.
     */
    classSuffix:'',

    /**
     * This is a unique string or function that identifies this type of view.
     * You can think of it as a code-accessible class name. Leave undeclared if you don't care.
     *
     * String Definition: may be mixed case and contain dots or dashes.
     *
     * If a function, function should return a string conforming to String Definition
     *
     * String will be injected into the view's root node as a
     * css class. Before injection, dots are transformed to dashes.
     */
    unique:'',

    /**
     * If true and the view's model's 'dispose' function is called,
     * this view's 'remove' function will be called, removing it from the DOM.
     */
    needsModel:false,

    /**
     * If view persists on .setModel(undefined) ...
     * Clears all inputs and content as defined in .uiBindings & .bindings.
     * Does not affect child-views.
     *
     * **does this by creating a new BonMot.Model instance, calling
     * .stickit() and .unstickit(), then destroying the model.
     * The only negative side-effect of this is if something is listening
     * for 'stickit' events; additional ones will be generated.
     */
    clearUIOnUndefinedModel:true,

    /**
     * convenience function for finding elements within this view. Use it!
     * @param cssExpr
     * @returns {*}
     */
    $elf:function(cssExpr) {
      return this.$el.find(cssExpr);
    },

    constructor: function(options) {
      var $el,
        hbs = (options.hbs)? options.hbs : this.hbs,
        hbsData = {};

      options = (options)? options : {};

      this.childViews = {};

      if(options.model && !(options.model instanceof this.Model)) {
        options.model = new this.Model(options.model);
      }
      if(this.needsModel && (typeof options !== 'object' || !options.hasOwnProperty('model'))) {
        throw new Error('This View requires a model on instantiation. (.needsModel == true in View declaration  )');
      }

      if(options.hasOwnProperty('parentView')) {
        this.parentView = options.parentView;
      }

      if(options.el) {
        $el = jQuery(options.el);
        this.$el = $el;//needed for $elf & findControlElements
      }

      if (typeof hbs === 'string') {
        hbs = Handlebars.compile(hbs);
      }
      if(this.hbsData) {
        if (this.hbsData === true && options.model) {
          hbsData = options.model.toJSON();
        } else {
          hbsData = this.hbsData;
        }
      }

      $el = jQuery(hbs(hbsData));

      if(options.el) {
        this.el = options.el;
        this.$el = jQuery(options.el);
        if($el.html()) {
          this.$el.html($el);
        }
      } else {
        this.el = options.el = $el[0];
        this.$el = $el;
      }

      this.findControlElements();

      Backbone.View.apply(this, arguments);

      this.injectUnique();

      if(options.model) {
        delete this.model; //because eliminating backbone side-effects
        this.setModel(options.model);
      }

    },

    injectModelCid:function(cid) {
      if(arguments.length !== 1) {
        cid = this.model.cid;
      }
      this.$el.attr('data-m-cid', cid);
      this.$el.data('m-cid', cid); //because caching.
    },

    injectUnique:function() {
      this.$el.attr('data-v-cid', this.cid);
      if(this.unique) {
        if(typeof this.unique === 'function') {
          this.$el.addClass(this.unique().split('.').join('-'));
        } else {
          this.$el.addClass(this.unique.split('.').join('-'));
        }
      }
    },

    findControlElements:function() {
      this.$ctrl = {};
      _.each(this.ctrlElementClasses, function(cssExpr,key) {
        this.$ctrl[key] = this.$elf(cssExpr);
      }, this);
    },

    /**
     * Should be callable multiple times.
     */
    initChildViews:function() {
      var atrs = (this.hasOwnProperty('model'))? this.model.attributes : {};

      _.each(this.atrViews, function(init, atrName) {
        if(!this.childViews.hasOwnProperty(atrName)) {
          if(atrs.hasOwnProperty(atrName) || init.view.prototype.needsModel === false) {
            this.newChildView(atrName, init, atrs[atrName]);
          }
        } else {
          this.childViews[atrName].setModel(atrs[atrName]);
        }
      }, this);
    },

    newChildView:function(atrName, init, model) {
      var options = {
        el: this.$elf(init.find)[0],
        parentView:this
      };
      if(model) {
        options.model = model;
      }

      if(!init.primitiveRender && this.Model && this.Model.prototype._setCollections[atrName] ) {
        options.childView = init.view;
        this.childViews[atrName] = new CollectionView(options);
      } else {
        this.childViews[atrName] = new init.view(options);
      }

      this.childViews[atrName].on('remove', function() {
        this.childViews[atrName].off(null, null, this);
        delete this.childViews[atrName];
      }, this);
    },

    /**
     * Sets a model on this view and binds the model's attributes to the view.
     * If a model was already set on the view, it is unset, and unbound.
     * ** Nested views and models must be handled manually at this time via the 'unsetModel' and 'setModel' events.
     * @param model
     * @returns {exportss.View}
     */
    setModel:function(model) {
      if(model === this.model) {
        return this;
      }

      this._unsetModel(model);
      if(model) {
        this.model = model;

        this.initChildViews();

        //This is outside initChildViews because we want initChildViews to be callable multiple times with no addl side
        //effects.
        _.each(this.childViews, function(view, atrName) {
          view.setModel(this.model.get(atrName));
          this.model.on('change:' + atrName, function(x, model){
            this.childViews[atrName].setModel(model);
          }, this);
        }, this);

        this.model.on('destroy', function() {
          this.setModel();
        }, this);


        this.injectModelCid();
        this.trigger('setModel', model, this);
        this.stickit();
      } else {
        if(this.needsModel) {
          return this.remove();
        } else if(this.clearUIOnUndefinedModel) {
          this.model = new Model();
          this.stickit();
          this.unstickit();
          delete this.model;
        }
      }

      return this;
    },
    /**
     * Internal function. Use setModel(undefined) instead!
     *
     * Unbinds and unsets the current model from this view. May also trigger removal of
     * view from DOM.
     * @param newModel - used only to test if the model should call .setModel(undefined) on child models.
     * @returns {boolean/Model}
     */
    _unsetModel: function(newModel) {
      var model = false;
      if(this.model) {
        this.injectModelCid('');
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
        if(!newModel) {
          _.each(this.childViews, function(view) {
            view.setModel();
          });
        }
        model = this.model;
        delete this.model;
        this.trigger('unsetModel', model, this);
      }
      return model;
    },
    remove:function() {
      this._unsetModel();

      this.trigger('remove', this);
      this.off(null, null, null);
      _.each(this.childViews, function(view) {
        view.off(null,null,this);
        view.remove();
      }, this);
      delete this.options;
      delete this.parentView;
      return Backbone.View.prototype.remove.call(this);
    }
  });

  var ViewExtend = View.extend;

  /**
   * Preprocessor to support Bon-Mot functionality.
   * 1. processes 'ctrl' prefixed functions and adds them to the events binding object
   * 2. Takes .uiBindings list and translates it into 'stickit' style bindings
   * @param childView
   * @returns {*}
   */
  View.extend = function(subView) {
    var classSuffix = (subView.classSuffix) ? '-' + subView.classSuffix : '',
      parentClassSuffix = (this.prototype.classSuffix) ? '-' + subView.classSuffix : '';

    if(this.prototype instanceof View) {
      if(!subView.Model && !this.prototype.Model) {
        throw new Error('This view must define a .Model attribute that is an extension of BonMot or DWBackbone');
      }
    }

    //declared here to make use of classSuffix
    var ctrlEvents = function(fn, fnName) {

      var ctrlNameFragment,
        event,
        eventExpression,
        fnNameFragments;
      if((typeof fn === 'function') && (fnName.indexOf('ctrl') === 0)) {
        event = 'click';
        fnNameFragments = DWBackbone.toUnderscored(fnName.substring(4)).substring(1).split('_');
        switch(fnNameFragments[0].toLowerCase()) { //todo: support these different event types
          case 'change' :
          case 'mouseout' :
          case 'mouseover' :
          case 'keypressed' :
          case 'keydown' :
          case 'keyup' :
          case 'click' :
            event = fnNameFragments.shift();
        }

        ctrlNameFragment = DWBackbone.toCamel(fnNameFragments.join('_'));
        this.ctrlElementClasses[ctrlNameFragment] = '.w-ctrl-' + ctrlNameFragment + classSuffix;
        eventExpression = event + ' ' + this.ctrlElementClasses[ctrlNameFragment];

        if(!this.events.hasOwnProperty(eventExpression)) {
          this.events[eventExpression] = fnName;
        }
      }
    };

    if(subView.hbs && typeof subView.hbs !== 'function') {
      subView.hbs = Handlebars.compile(subView.hbs);
    }

    /**
     * atrViews defines the which attributes get their own views automagically.
     *
     * if it exists, format it with appropriate declarations
     * else - create a blank, and inherit any atrViews from this view's parent, correcting the css find as appropriate.
     * @type {{}}
     */
    if(subView.hasOwnProperty('atrViews')) {
      _.each(subView.atrViews, function (viewDeclaration, atrName) {
        if (viewDeclaration.prototype instanceof Backbone.View) {
          subView.atrViews[atrName] = {
            find: '.w-atr-' + atrName + classSuffix,
            view: viewDeclaration
          };
        } else if(typeof viewDeclaration === 'string' || typeof viewDeclaration === 'function') {
          viewDeclaration = (typeof viewDeclaration === 'string')? Handlebars.compile(viewDeclaration) : viewDeclaration;

          subView.atrViews[atrName] = {
            find: '.w-atr-' + atrName + classSuffix,
            view: function(options) {
              options.hbs = viewDeclaration;
              return new AttributeRenderer(options);
            }
          };
          subView.atrViews[atrName].primitiveRender = true;
        } else if (viewDeclaration.hasOwnProperty('find') === false || viewDeclaration.hasOwnProperty('view') === false) {
          throw new Error('atrViews has bad declaration', viewDeclaration);
        }
      });
    } else {
      subView.atrViews = {};
      if(this.prototype.atrViews) {
        _.each(this.prototype.atrViews, function (viewDeclaration, atrName) {
          subView.atrViews[atrName] = _.clone(viewDeclaration);
          if(subView.atrViews[atrName].find === '.w-atr-' + atrName + parentClassSuffix) {
            subView.atrViews[atrName].find = '.w-atr-' + atrName + classSuffix;
          }
        }, this);
      }
    }

    if(!subView.events) {
      subView.events = {};
    }
    subView.ctrlElementClasses = {};

    _.each(subView, ctrlEvents, subView);
    _.each(this.prototype, ctrlEvents, subView);

    /**
     * Take .uiBindings list and translate into 'stickit' style bindings
     */
    if(!subView.hasOwnProperty('bindings')) {
      subView.bindings = {};
    }
    if(!subView.hasOwnProperty('uiBindings')) {
      if(this.prototype.uiBindings) {
        subView.uiBindings = _.clone(this.prototype.uiBindings);
      } else {
        subView.uiBindings = [];
      }
    }
    if(subView.uiBindings.constructor !== Array) {
      throw new Error('uiBindings for view must be Array', subView);
    }
    _.each(subView.uiBindings, function(binder) {
      if(typeof binder === 'string') {
        binder = {
          observe:binder
        };
      } else {
        binder = _.clone(binder);
      }
      if(!binder.hasOwnProperty('observe')) {
        console.log('Error when constructing bindings. Cannot locate .observe:', binder, 'on view declaration:', subView);
        throw new Error('Error when constructing bindings. Cannot locate attribute name to observe on view declaration. See log statement');
      }

      if(!binder.hasOwnProperty('find')) {
        binder.find = '.w-atr-' + binder.observe + classSuffix;
      } else if(binder.find === '.w-atr-' + binder.observe + parentClassSuffix) {
        binder.find = '.w-atr-' + binder.observe + classSuffix;
      }

      if(!subView.bindings.hasOwnProperty(binder.find)) {
        subView.bindings[binder.find] = binder;
        delete binder.find;
      }
    });

    vTemp = ViewExtend.call(this, subView);
    /**
     * A unique check. Is this thing really unique within the BonMot Universe?
     */
    if(subView.unique) {
      if(uniques.hasOwnProperty(subView.unique)) {
        throw new Error('BonMot error when extending subView.unique ' + subView.unique + '. A subview with that name already exists:', uniques[subView.unique]);
      }
      uniques[subView.unique] = vTemp;
    }
    return vTemp;
  };

  var Model = DWBackbone.Model.extend({
    /**
     * This should get into DW-Backbone @ some point. Fingers crossed.
     */
    dispose:function() {
      for(var i in this.attributes) if(this.hasOwnProperty(i)) {
        if(((this.attributes[i] instanceof Backbone.Model) === true) || ((this.attributes[i] instanceof DWBackbone.Collection) === true)) {
          try {
            this.attributes[i].dispose();
          } catch (e) {
            console.log('When disposing of', this, 'child model .' + i, this.attributes[i], 'did not have dispose function');
          }
        }
      }
      this.removeParent();
      this.trigger('dispose', this); //likely this should be eliminated in favor of everything listening for destroy.
      this.trigger('destroy', this);
    },
  });


  /**
   * Manages a set of child-views created from a collection of models.
   * More specifically it is intended to be auto-invoked by a parent-View
   * to manage a collection of models that is an attribute of a parent-view's Model.
   *
   * It can be used on its own, but you'll need to refer to source to understand how to use it.
   *
   * Some information on its operation and declaration. Because we expect it to work within a parent
   * view that doesn't make distinctions between Model and Collection (nor should it need to)
   * "setModel" could be considered to mean "set the item of interest".. which (we hope) is a collection
   * BUT CollectionView also uses a Model to bind controls and store values, and needs to keep that
   * Model instance at .model so that event and attribute bindings are created and handled correctly.
   * This model is instantiated in the constructor, and NEVER changes.
   *
   * So .setModel() takes a collection.
   *
   * There's a lot of code in this contstructor's class that's been duplicated from the primary View
   * constructor... that's because we can't call it directly, as it calls 'setModel' at the end
   * this would be disasterous for CollectionView. So we copy.
   *
   * @type {any}
   */
  var CollectionView = View.extend({
    Model:DWBackbone.Collection,
    firstPage:1,
    bindings:{'.w-atr-page':'page', '.w-atr-pageLength':'pageLength'},
    constructor:function(options) {
      var $el,
        collection = false,
        hbs = (options.hbs)? options.hbs : this.hbs,
        hbsData = {},
        model;

      this.firstPage = (this.firstPage === 0)? 0 : 1;
      this.childViews = {};
      if(!options.el) {
        throw new Error('CollectionView must be passed an element on construction!');
      }
      if(!this.atrViews) {
        this.atrViews = {};
      }
      if(options.childView) {
        this.ChildView = options.childView;
      }
      if(!this.ChildView) {
        throw new Error('CollectionView: must have a  this.ChildView or be passed .childView at construction.');
      }

      if(options.model) {
        if(!(options.model instanceof Backbone.Collection)) {
          throw new Error('CollectionView: .model must be instanceof Backbone.Collection');
        }
        collection = options.model;
        delete options.model;
      } else if (this.Model && this.Model.prototype instanceof Backbone.Collection) {
        collection = new this.Model();
      } else {
        throw new Error("CollectionView: must have a this.Model, or have .model instance passed on construction. These must be instanceof Backbone.Collection");
      }

      if (typeof hbs === 'string') {
        hbs = Handlebars.compile(hbs);
      }
      if(this.hbsData) {
        hbsData = this.hbsData;
      }

      $el = jQuery(hbs(hbsData));

      if(options.el) {
        this.el = options.el;
        this.$el = jQuery(options.el);
        if($el.html()) {
          this.$el.html($el);
        }
      } else {
        this.el = options.el = $el[0];
        this.$el = $el;
      }

      this.findControlElements();

      this.$collection = this.$elf('.w-collection:first');
      if(this.$collection.length === 0) {
        this.$collection = this.$el;
      }

      model = new DWBackbone.Model({
        page:1,
        pageLength: (this.$collection.data('page-length'))? parseInt(this.$collection.data('page-length')) : 0,
        sortOn:false,
        searchOn:'',
        search:''
      });
      options.model = model;
      this.listenTo(model, 'change:page change:pageLength change:search change:searchBy', this.renderChildViews);

      Backbone.View.apply(this, arguments);

      this.injectUnique();

      this.stickit();

      this.setModel(collection);
    },
    setModel:function(collection) {
      if(this.collection === collection) {
        return this;
      }
      if(collection && !(collection instanceof Backbone.Collection)) {
        throw new Error('Bonmot.CollectionView.setModel(collection) was not passed a collection!');
      }

      if(this.collection && !collection) {
        _.each(this.childViews,function(view, key) {
          view.remove();
          delete this.childViews[key];
        }, this);
        this.collection.off(null, null, this);
        delete this.collection;
        return this;
      }

      this.collection = collection;
      this.renderChildViews();

      this.collection.on('add', this.renderChildViews, this);
      this.collection.on('remove', this.renderChildViews, this);
      this.collection.on('reset', this.renderChildViews, this);
      this.collection.on('sort', this.renderChildViews, this);
    },
    /**
     * removes and adds child views as needed, then orders them.
     * assumes sort, etc have already been called;
     */
    renderChildViews:function() {
      var page = this.model.get('page') - this.firstPage,
        pageLength = parseInt(this.model.get('pageLength')),
        collection = this.collection,
        search = this.model.get('search'),
        searchBy = this.model.get('searchBy');

        if(search.length > 0 ) {
          collection = new this.collection.constructor(this.collection.filter(function(model) {
            return (model.get(searchBy).indexOf(search) > -1);
          }, this));
        }
        if((pageLength > 0) && (collection.length > 0)) {
          if((page * pageLength) > collection.length) {
            this.model.set('page', ((page - 1) + this.firstPage));
            return;
          }
          collection = new this.collection.constructor(collection.slice(page * pageLength, (page + 1) * pageLength))
        }

      _.each(this.childViews, function(view, cid) {
        if(!collection.get(cid)) {
          this.removeChildView(cid);
        }
      }, this);
      collection.each(function(model) {
        if(!this.childViews.hasOwnProperty(model.cid)) {
          this.newChildView(model);
        }
      }, this);
      this.sortChildViews(collection);

    },
    sortChildViews:function(collection) {
      var $lastEl = false, page, pageLength;
      if(!collection) {
        pageLength = this.model.get('pageLength');
        if(pageLength === 0) {
          collection = this.collection;
        } else {
          page = this.model.get('page');
          collection =  new this.collection.constructor(this.collection.slice((page - 1) * pageLength, page * pageLength));
        }
      }

      collection.each(function(model, i) {
        if(i === 0) {
          this.$collection.prepend(this.childViews[model.cid].$el);
        } else {
          $lastEl.after(this.childViews[model.cid].$el);
        }
        $lastEl = this.childViews[model.cid].$el;
      }, this);
    },
    newChildView:function(model) {
      this.childViews[model.cid] = new this.ChildView({
        model:model,
        parentView:this.parentView
      });
      this.$collection.append(this.childViews[model.cid].$el);
    },
    removeChildView:function(cid) {
      this.childViews[cid].off(null, null, this);
      this.childViews[cid].remove();
      delete this.childViews[cid];
    },
    remove:function() {
      _.each(this.childViews, function(view) {
        view.off(null,null,this);
        view.remove();
      }, this);
      this.collection.off(null,null,this);
      delete this.options;
      delete this.parentView;
      return Backbone.View.prototype.remove.call(this);
    },
    ctrlKeyupSearch:function(evt) {
      var $search = $(evt.currentTarget);
      this.model.set('searchBy', $search.data('search-by'));
      this.model.set('search', $search.val());
    },
    ctrlSortBy:function(evt) {
      this.model.set('sortBy', $(evt.currentTarget).data('sort-by'));
    },
    ctrlFirst:function() {
      this.model.set({'page': this.firstPage});
    },
    ctrlPrev:function() {
      var page = this.model.get('page');
      if(page > this.firstPage) {
        this.model.set({'page': (page-1)});
      } else {
        this.ctrlFirst();
      }
    },
    ctrlNext:function() {
      var page = this.model.get('page');
      var minus = (this.firstPage === 1)? 0 : 1;
      if(page < (Math.ceil(this.collection.length / this.model.get('pageLength')) - minus)) {
        this.model.set({'page': (page+1)});
      } else {
        this.ctrlLast();
      }
    },
    ctrlLast:function() {
      var minus = (this.firstPage === 1)? 0 : 1;
      this.model.set({'page': (Math.floor(this.collection.length / this.model.get('pageLength')) - minus)});
    }
  });

  exports = {
    Model: Model,
    View: View,
    CollectionView: CollectionView
  }

  return exports;
});
