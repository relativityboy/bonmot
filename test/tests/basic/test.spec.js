define(['hbs!test/resources/index', 'jquery','underscore', 'hbs!./person/person', './person/person'],
  function(hbsTestContainer, $, _, hbsPerson, Person) {

  describe("Basic Functionality", function () {
    var $body, $example, exampleNode, person, personData;
    before(function() {
      $body = $('body');
    });
    beforeEach(function() {
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

    });

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
    it("binds controls to functions onclick", function () {
      person = new Person.View({
        el:exampleNode,
        model:personData
      });

      assert.isUndefined(person.model.get('controlValue'), 'controlValue is undefined');
      $('.w-ctrl-testFunction').click();
      expect(person.model.get('controlValue')).to.equal(person.model.get('displayName'));
    });

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

    it("injects its cid into its own root node", function () {
      person = new (Person.View.extend({}))({
        el:exampleNode,
        model:personData
      });

      alert(person.$el.attr('data-v-cid'));
      alert("test: " + $example.length + ' ' + ($example[0] === exampleNode) + ' ' + $example.data('v-cid') + ' ' + $example.attr('data-v-cid'));
      expect($example.data('v-cid')).to.equal(person.cid);
    });
  });

});
