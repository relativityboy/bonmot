/***
 * NEED TO CHANGE NAME TO TEMPLATE TESTS
 * AND TO TEXT FOR PROPER 'TEMPLATE COMPILER' INHERITANCE AND OVER-RIDING
 */


define(['hbs!test/resources/index', 'jquery','underscore', 'hbs!./hbstemplates/person', './hbstemplates/person'],
  function(hbsTestContainer, $, _, hbsPerson, Person) {

  describe("Inheritance - templating", function () {
    var $body, $example, exampleNode, person, personData;
    describe("templates", function() {
      it("inherits template from parent");
      it("is able to override parent's template");
      it("does not alter parent's template");
    });
    describe("controls", function() {
      it("inherits a control binding from parent");
      it("is able to override parents control binding");
      it("does not alter parent's control binding");
    });

    describe("attribute binding", function() {
      it("overrides uiBindings");
      it("does not alter parent's uiBindings");
    });
  });
});
