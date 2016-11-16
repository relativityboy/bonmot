define(['hbs!test/resources/index', 'jquery','underscore', 'hbs!./person/person', './person/person'],
  function(hbsTestContainer, $, _, hbsPerson, Person) {

  describe("Basic Functionality", function () {
    var $body, $example, person, personData;
    before(function() {
      $body = $('body');
    });
    beforeEach(function() {
      if(person) {
        person.remove();
      }
      $body.html(hbsTestContainer());

      personData = {
        "firstName":"Molly",
        "lastName":"Ringwald"
      };

    });

    it("puts its template in the dom", function () {
      person = new Person.View({
        el:document.getElementById('example'),
      });
      expect(hbsPerson()).to.equal(document.getElementById('example').innerHTML);
    });
    it("hydrates model from json", function () {
      person = new Person.View({
        el:document.getElementById('example'),
        model:personData
      });
      expect(person.model.constructor).to.equal(Person.Model);
      expect(person.model.get('firstName')).to.equal(personData.firstName);
      expect(person.model.get('lastName')).to.equal(personData.lastName);
    });
    it("binds the model -> view", function () {
      person = new Person.View({
        el:document.getElementById('example'),
        model:personData
      });

      expect($('.w-atr-firstName').val()).to.equal(person.model.get('firstName'));
      expect($('.w-atr-lastName').val()).to.equal(person.model.get('lastName'));
    });
    it("binds the view -> model", function () {
      person = new Person.View({
        el:document.getElementById('example'),
        model:personData
      });
      $('.w-atr-firstName').val("pear").trigger('change');
      $('.w-atr-lastName').val("apple").trigger('change');
      expect($('.w-atr-firstName').val()).to.equal(person.model.get('firstName'));
      expect($('.w-atr-lastName').val()).to.equal(person.model.get('lastName'));
    });
    it("binds controls to functions onclick", function () {
      person = new Person.View({
        el:document.getElementById('example'),
        model:personData
      });

      assert.isUndefined(person.model.get('controlValue'), 'controlValue is undefined');
      $('.w-ctrl-testFunction').click();
      expect(person.model.get('controlValue')).to.equal(person.model.get('displayName'));
    });
  });

});
