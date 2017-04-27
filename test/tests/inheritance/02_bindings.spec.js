define(['hbs!test/resources/index', 'jquery','underscore', 'hbs!./bindings/person', './bindings/person'],
  function(hbsTestContainer, $, _, hbsPerson, Person) {

  describe("Inheritance - bindings", function () {
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

    it("can use custom class binding prefix for attributes and controls", function() {
      var person = new Person.ViewBindPrefix({
          el:exampleNode,
          model:personData
        }),
        ctrlKeys = { //these represent the control elements that have been searched for, and the number of elements that we expect to have been found.
          testFunction:1,
          keyUpFn:2
        },
        atrKeys = _.clone(personData);

      _.each(ctrlKeys, function(count, key) {
        assert(person.$ctrl.hasOwnProperty(key), 'person.$ctrl has property ' + key);
        assert(person.$ctrl[key].length === count, key + ' has ' + count + ' elements ');
      });

      _.each(atrKeys, function(count, key) {
        assert(person.$elf('.js-atr-' + key).val() == person.model.get(key), 'person.model has bound property ' + key);
      });

      assert(person.$elf('.w-atr-displayName').val() != person.model.get('displayName'), 'person.model does not have bound property \'displayName\'');
    });



    it("parent view retains own class binding prefix", function () {
      expect(Person.View.prototype.bindPrefix).to.equal('.w');

      var person = new Person.View({
          el:exampleNode,
          model:personData
        }),
        ctrlKeys = { //these represent the control elements that have been searched for, and the number of elements that we expect to have been found.
          testFunction:1,
          keyUpFn:0
        },
        atrKeys = _.clone(personData);

      _.each(ctrlKeys, function(count, key) {
        assert(person.$ctrl.hasOwnProperty(key), 'person.$ctrl has property ' + key);
        assert(person.$ctrl[key].length === count, key + ' has ' + count + ' elements ');
      });

      _.each(atrKeys, function(count, key) {
        assert(person.$elf('.w-atr-' + key).val() == person.model.get(key), 'person.model has bound property ' + key);
      });

      assert(person.$elf('.w-atr-displayName').text() == person.model.get('displayName'), 'person.model has bound property \'displayName\'');
    });
  });

});
