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

    describe("Testing .setModel & related effects", function() {
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

      it("instantiated empty. .setModel updates data-cid & data bindings", function () {
        var personModel = new Person.Model(personData),
          upatedFirstName = "CornCob",
          upatedLastName = "Applecore";
        person = new Person.View({
          el: exampleNode
        });

        person.setModel(personModel);

        expect($example.data('m-cid')).to.equal(personModel.cid);

        assert($example.find('.w-atr-firstName').val() === personModel.get('firstName'), '.w-atr-firstName is bound to .firstName value');
        assert($example.find('.w-atr-lastName').val() === personModel.get('lastName'), '.w-atr-lastName is bound to .lastName value');

        personModel.set('lastName', upatedLastName);

        assert($example.find('.w-atr-lastName').val() === upatedLastName, '.w-atr-lastName updates on model update');

        $example.find('.w-atr-firstName').val(upatedFirstName);
        $example.find('.w-atr-firstName').trigger('change'); //manual triggering of user event

        assert(upatedFirstName === personModel.get('firstName'), '.firstName updates on .w-atr-firstName input element update');

        assert($example.find('.w-atr-displayName').html() === personModel.get('displayName'), '.w-atr-displayName is bound to .displayName (innerHTML)');
      });

      it("instantiated w/model. .setModel updates data-cid & data bindings", function () {
        var oldMCID,
          personModel = new Person.Model(personData),
          updateModelJSON = {
            firstName:"Glorp",
            lastName:"Frop"
          },
          updateModel = new Person.Model(updateModelJSON),
          upatedFirstName = "CornCob",
          upatedLastName = "Applecore";

        person = new Person.View({
          el: exampleNode,
          model:personModel
        });

        oldMCID = $example.data('m-cid');

        person.setModel(updateModel);


        expect(oldMCID).to.not.equal(updateModel.cid);

        expect($example.data('m-cid')).to.equal(updateModel.cid);

        assert($example.find('.w-atr-firstName').val() === updateModel.get('firstName'), '.w-atr-firstName is bound to .firstName value');
        assert($example.find('.w-atr-lastName').val() === updateModel.get('lastName'), '.w-atr-lastName is bound to .lastName value');

        updateModel.set('lastName', upatedLastName);

        assert($example.find('.w-atr-lastName').val() === upatedLastName, '.w-atr-lastName updates on model update');

        $example.find('.w-atr-firstName').val(upatedFirstName);
        $example.find('.w-atr-firstName').trigger('change'); //manual triggering of user event

        assert(upatedFirstName === updateModel.get('firstName'), '.firstName updates on .w-atr-firstName input element update');

        assert($example.find('.w-atr-displayName').html() === updateModel.get('displayName'), '.w-atr-displayName is bound to .displayName (innerHTML)');

        assert(personData.firstName === personModel.get('firstName'), '.firstName of original model is unmodified');
        assert(personData.lastName === personModel.get('lastName'), '.lastName of original model is unmodified');
      });


    });
  });

});
