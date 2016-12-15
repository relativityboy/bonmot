define(['hbs!test/resources/index', 'jquery','underscore', 'hbs!./functions/person', './functions/person'],
  function(hbsTestContainer, $, _, hbsPerson, Person) {

  describe("Inheritance - functions", function () {
    var $body, $example, exampleNode, $example2, exampleNode2, person, personData, view, viewExtended;
    before(function() {
      $body = $('body');
    });
    beforeEach(function() {
      if(view) {
        view.remove();
      }
      if(viewExtended) {
        viewExtended.remove();
      }
      $body.html(hbsTestContainer());

      $example = $('#example');
      exampleNode = $example[0];
      $example2 = $('#example2');
      exampleNode2 = $example2[0];

      personData = {
        "firstName":"Molly",
        "lastName":"Ringwald"
      };
      person = new Person.Model(personData);
      view = new Person.View({el:exampleNode, model:person});
      viewExtended = new Person.ViewExtended({el:exampleNode2, model:person});
    });

    it("parent view retains correct function if extended and function is overridden by extendor", function () {
      expect(view.fnOverrideGetAttribute()).to.equal(person.get('firstName'));
    });

    it("extended view has parent defined function if not overridden", function () {
      expect(viewExtended.fnInheritGetApple()).to.equal(view.fnInheritGetApple());
    });

    it("extended view successfully overrides parent defined function", function () {
      expect(viewExtended.fnOverrideGetAttribute()).to.equal(person.get('lastName'));
    });
  });

});
