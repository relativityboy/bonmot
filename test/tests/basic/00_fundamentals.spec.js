define(['hbs!test/resources/index', 'jquery','underscore', 'bonmot', 'hbs!./fundamentals/person', './fundamentals/person'],
  function(hbsTestContainer, $, _, Bonmot, hbsPerson, Person) {

  describe("Basic Functionality - fundamentals", function () {
    var $body, $example, exampleNode, person, personData, fnBfe;

    fnBfe = function() {
      if(person) {
        person.remove();
      }
      $body.html(hbsTestContainer());

      $example = $('#example');
      exampleNode = $example[0];

      personData = {
        "firstName":"Molly",
        "lastName":"Ringwald"
      };

    }
    before(function() {
      $body = $('body');
    });
    beforeEach(fnBfe);

    it("puts its template in the dom", function () {
      person = new Person.View({
        el:exampleNode,
      });
      expect(hbsPerson()).to.equal(document.getElementById('example').innerHTML);
    });

    it("hydrates model from json", function () {
      person = new Person.View({
        el:exampleNode,
        model:personData
      });
      expect(person.model.constructor).to.equal(Person.Model);
      expect(person.model.get('firstName')).to.equal(personData.firstName);
      expect(person.model.get('lastName')).to.equal(personData.lastName);
    });


    describe("attribute binding", function() {
      beforeEach(fnBfe);
      it("binds the model -> view", function () {
        person = new Person.View({
          el:exampleNode,
          model:personData
        });

        expect($('.w-atr-firstName').val()).to.equal(person.model.get('firstName'));
        expect($('.w-atr-lastName').val()).to.equal(person.model.get('lastName'));
      });

      it("binds the view -> model", function () {
        person = new Person.View({
          el:exampleNode,
          model:personData
        });
        $('.w-atr-firstName').val("pear").trigger('change');
        $('.w-atr-lastName').val("apple").trigger('change');
        expect($('.w-atr-firstName').val()).to.equal(person.model.get('firstName'));
        expect($('.w-atr-lastName').val()).to.equal(person.model.get('lastName'));
      });

      it(".classSuffix existence causes binding elements with w-< ctrl|atr|... >-< x >-< classSuffix > only", function () {
        var person = new Person.ViewSuffix({
            el:exampleNode,
            model:personData
          }),
          ctrlKeys = { //these represent the control elements that have been searched for, and the number of elements that we expect to have been found.
            testFunction:0,
            keyUpFn:1
          },
          atrKeys = _.clone(personData);

        _.each(ctrlKeys, function(count, key) {
          assert(person.$ctrl.hasOwnProperty(key), 'person.$ctrl has property ' + key);
          assert(person.$ctrl[key].length === count, key + ' has ' + count + ' elements ');
        });

        _.each(atrKeys, function(count, key) {
          assert(person.$elf('.w-atr-' + key + '-' + person.classSuffix).val() == person.model.get(key), 'person.model has bound property ' + key);
        });

        assert(person.$elf('.w-atr-displayName').val() != person.model.get('displayName'), 'person.model does not have bound property \'displayName\'');
      });

      it("chooses .bindings declarations over uiBindings", function() {
        var bindings = {
            '.w-atr-firstName': {
              observe: 'lastName'
            }
          },
          View = Bonmot.View.extend({
            uiBindings:['firstName', 'lastName'],
            bindings:bindings,
            hbs:Person.View.prototype.hbs
          });

        expect(bindings['.w-atr-firstName']).to.equal(View.prototype.bindings['.w-atr-firstName']);

      });
    });

    describe("control bindings", function() {
      beforeEach(fnBfe);
      it("binds controls to functions onclick", function () {
        person = new Person.View({
          el:exampleNode,
          model:personData
        });

        assert.isUndefined(person.model.get('controlValue'), 'controlValue is undefined');
        $('.w-ctrl-testFunction').click();
        expect(person.model.get('controlValue')).to.equal(person.model.get('displayName'));
      });
    });

    describe("supports view set style class", function() {
      beforeEach(fnBfe);
      it("injects a unique class", function () {
        person = new (Person.View.extend({
          unique:'foop'
        }))({
          el:exampleNode,
          model:personData
        });
        expect($('.foop').length).to.equal(1);
      });

      it("throws error on duplicate unique class", function () {
        var exception = 'exception not thrown',
          PersonExtended = Person.View.extend({
            unique:'foop2'
          });

        try {
          var Person2Extended = PersonExtended.extend({
            unique: 'foop2'
          });
        } catch (e) {
          exception = 'exception thrown';
        }
        expect(exception).to.equal('exception thrown');
      });
    });


    describe("cid injection", function() {
      beforeEach(fnBfe);
      it("injects its cid into its own root node", function () {
        person = new (Person.View.extend({}))({
          el:exampleNode,
          model:personData
        });

        expect($example.data('v-cid')).to.equal(person.cid);
      });

      it("injects model cid into its own root node", function () {
        person = new (Person.View.extend({}))({
          el:exampleNode,
          model:personData
        });

        expect($example.data('m-cid')).to.equal(person.model.cid);
      });
    });


    describe("convenience found-elements", function() {
      it(".$elf - only finds elements within the view", function () {
        person = new (Person.View.extend({}))({
          el:exampleNode,
          model:personData
        });

        assert($('.elf-test').length > person.$elf('.elf-test').length, $('.elf-test').length + ' is less than ' + person.$elf('.elf-test').length);
      });

      it(".$ctrl contains only valid control elements", function () {
        person = new Person.View({
          el:exampleNode,
          model:personData
        });
        var $ctrlElementSearches = {
          'testFunction':$(person.el).find('.w-ctrl-testFunction'),
          'keyUpFn':$(person.el).find('.w-ctrl-keyUpFn')
        };

        var $ctrlClassedElements = {
          'notAFunction':$(person.el).find('.w-ctrl-notAFunction')
        };

        _.each($ctrlElementSearches, function($ctrl, key) {
          assert(person.$ctrl.hasOwnProperty(key), 'person.$ctrl has property ' + key);
          assert($ctrl.length == person.$ctrl[key].length, 'person.$ctrl.' + key + ' has the same length as the number of elements within the view\'s dom.');
        });

        _.each($ctrlClassedElements, function($ctrl, key) {
          assert(!person.$ctrl.hasOwnProperty(key), 'person.$ctrl does not have property ' + key);
        });
      });
    });
  });
});
