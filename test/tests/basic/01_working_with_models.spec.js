define(['hbs!test/resources/index', 'jquery','underscore', 'hbs!./working_with_models/person', './working_with_models/person'],
  function(hbsTestContainer, $, _, hbsPerson, Person) {

  describe("Basic - working with models.", function () {
    var $body, $example, exampleFinder = '#example', exampleNode, person, personData;

    before(function() {
      $body = $('body');
    });


    describe("Model dependence (.needsModel).", function() {
      beforeEach(function() {
        if(person) {
          person.remove();
        }
        $body.html(hbsTestContainer());

        $example = $(exampleFinder);
        exampleNode = $example[0];

        personData = {
          "firstName":"Molly",
          "lastName":"Ringwald"
        };
      });

      it(".needsModel true. throw Error on new if no model.", function () {
        var threwException = false;
        try {
          person = new Person.ViewNeedsModel({
            el: exampleNode,
          });
        } catch(e) {
          threwException = true;
        }
        expect(threwException).to.be.true;
      });
      it(".needsModel true. do not throw Error on new if model.", function () {
        var threwException = false;
        try {
          person = new Person.ViewNeedsModel({
            el: exampleNode,
            model:personData
          });
        } catch(e) {
          threwException = true;
        }
        expect(threwException).to.be.false;
      });
      it(".needsModel false. do not throw Error on new if no model.", function () {
        var threwException = false;
        try {
          person = new Person.View({
            el: exampleNode,
          });
        } catch(e) {
          console.log(e.message)
          threwException = true;
        }
        expect(threwException).to.be.false;
      });
      it(".needsModel true. Remove from dom if .setModel(<empty>).", function () {
        person = new Person.ViewNeedsModel({
          el: exampleNode,
          model:personData
        });
        expect($body.find(exampleFinder).length).to.equal(1);
        person.setModel();
        expect($body.find(exampleFinder).length).to.equal(0);
      });
      it(".needsModel false. Still in dom if .setModel(<empty>).", function () {
        person = new Person.View({
          el: exampleNode,
          model:personData
        });
        expect($body.find(exampleFinder).length).to.equal(1);
        person.setModel();
        expect($body.find(exampleFinder).length).to.equal(1);
      });

    });
  });

});
