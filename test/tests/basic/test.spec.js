define(['hbs!test/resources/index', 'jquery','underscore', 'hbs!./person/person', './person/person'],
  function(hbsTestContainer, $, _, hbsPerson, Person) {

  describe("Basic Functionality", function () {
    var $body, $example, person, personData;
    before(function() {
      $body = $('body');
    });
    beforeEach(function() {
      $body.html(hbsTestContainer());

      personData = {
        "firstName":"Molly",
        "lastName":"Ringwald"
      };

      person = new Person.View({
        el:document.getElementById('example'),
        //model:personData
      });
    });

    it("exists", function () {
      expect(hbsPerson()).to.equal(document.getElementById('example').innerHTML);
    });
  });

});
