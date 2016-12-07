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

    describe("Testing .setModel(someModel) ", function() {
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

      it("updates data-cid & data bindings when instantiated empty.", function () {
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

      it("updates data-cid & data bindings when instantiated w/model.", function () {
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

    /**
     * tests below for when .needsModel === true are not necessary because UI is removed from dom, so the below scenarios
     * are not possible.
     *
     * Removed from DOM test is in .needsModel tests.
     */
    describe("Testing .setModel(null/undefined) .needsModel=false", function() {
      var beforeEachNullModel = function() {
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
        person = new Person.View({
          el: exampleNode,
          model:personData
        });
      };

      describe("when .clearUIOnUndefinedModel is false", function() {
        beforeEach(beforeEachNullModel);
        it("updates m-cid to null string", function() {
          person.clearUIOnUndefinedModel = false;
          person.setModel();
          expect($example.attr('data-m-cid')).to.equal('');
        });


        it("does not clear ui of data", function() {
          person.clearUIOnUndefinedModel = false; //the behavior can be configured per-instance, or in the .extend declaration

          var personModel = person.model;

          person.setModel();
          assert($example.find('.w-atr-firstName').val() === personModel.get('firstName'), '.w-atr-firstName is unchanged after unset');
          assert($example.find('.w-atr-lastName').val() === personModel.get('lastName'), '.w-atr-lastName is unchanged after unset');
          assert($example.find('.w-atr-displayName').html() === personModel.get('displayName'), '.w-atr-displayName is unchanged after unset');
        });

        it("removes event bindings on old model", function() {
          var personModel = person.model;
          person.setModel();

          $example.find('.w-atr-firstName').val(personData.firstName + "asdf");
          $example.find('.w-atr-firstName').trigger('change'); //manual triggering of user event

          assert(personData.firstName === personModel.get('firstName'), '.firstName of original model is unmodified');
        });
      });

      describe("when .clearUIOnUndefinedModel is true", function() {
        beforeEach(beforeEachNullModel);
        it("updates m-cid to null string", function() {
          person.setModel();
          expect($example.attr('data-m-cid')).to.equal('');
        });


        it("clears ui of data", function() {
          person.setModel();
          assert($example.find('.w-atr-firstName').val() === '', '.w-atr-firstName is empty');
          assert($example.find('.w-atr-lastName').val() === '', '.w-atr-lastName is empty');
          assert($example.find('.w-atr-displayName').html() === '', '.w-atr-displayName is empty');
        });

        it("removes event bindings on old model", function() {
          var personModel = person.model;
          person.setModel();

          $example.find('.w-atr-firstName').val(personData.firstName + "asdf");
          $example.find('.w-atr-firstName').trigger('change'); //manual triggering of user event

          assert(personData.firstName === personModel.get('firstName'), '.firstName of original model is unmodified');
        });
      });



      /*
       * for needsmodel == false
       * clearUIOnUndefinedModel == false
       * model cid injection updated
       * test ui <> model
       * test old model to see that it is NOT updated
       * clearUIOnUndefinedModel == true
       * model cid injection updated
       * test ui <> model
       * test old model to see that it is NOT updated
       * for needsmodel == true
       * test that html is gone.
       */
    });
  });

});
