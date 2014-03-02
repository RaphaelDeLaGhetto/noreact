
var gebo = require('gebo-server')(__dirname + '/../..'),
    schemata = require('../../schemata');

gebo.schemata.add(schemata);

/**
 * search
 */
exports.search = {
    setUp: function(callback) {

        var agentDb = new gebo.schemata.agent('dan@example.com');
        var friend = new agentDb.friendModel({
                        name: 'John',
                        email: 'john@painter.com',
                        gebo: 'https://somegebo.com',
                    });

        friend.save(function(err) {
            if (err) {
              console.log(err);
            }

            agentDb.connection.db.close();
            callback();
          });
    },

    tearDown: function(callback) {
        var agentDb = new gebo.schemata.agent('dan@example.com');
        agentDb.connection.on('open', function(err) {
            agentDb.connection.db.dropDatabase(function(err) {
                if (err) {
                  console.log(err);
                }
                agentDb.connection.db.close();
                callback();
              });
          });
    },

    'Return a list of drugs': function(test) {
//        test.expect(1);
//        var actions = require('../../actions')(gebo);
//        actions.search({ dbName: 'dan@example.com', read: true },
//                       { sender: 'john@painter.com' }).
//            then(function(greeting) {
//                test.equal(greeting, 'Hello, John. It\'s nice to hear from you');
//                test.done();
//              }).
//            catch(function(err) {
//                console.log(err);
//                test.ok(false, 'Shouldn\'t get here');      
//                test.done();
//              });
    },

//    'Return a friendly greeting to an unknown agent': function(test) {
//        test.expect(1);
//        var actions = require('../../actions')(gebo);
//        actions.search({ dbName: 'dan@example.com' },
//                       { sender: 'yanfen@example.com' }).
//            then(function(greeting) {
//                test.ok(false, 'Shouldn\'t get here');      
//                test.done();
//              }).
//            catch(function(err) {
//                test.equal(err, 'Hello, Stranger. Peace be with you');
//                test.done();
//              });
//    },
  };

/**
 * inventory
 */
exports.search = {
    setUp: function(callback) {

        var agentDb = new gebo.schemata.agent('dan@example.com');
        var friend = new agentDb.friendModel({
                        name: 'John',
                        email: 'john@painter.com',
                        gebo: 'https://somegebo.com',
                    });

        var drugDb = new gebo.schemata.noreactAgent('dan@example.com');
        drug = new drugDb.drugProductModel({
                        drug_product_id: 1,
                        drugname: 'RITALIN 10MG',
                    }); 
        friend.save(function(err) {
            agentDb.connection.db.close();
            if (err) {
              console.log(err);
            }
            drug.save(function(err) {
                drugDb.connection.db.close();
                if (err) {
                  console.log(err);
                }
                callback();
              });
          });
    },

    tearDown: function(callback) {
        var agentDb = new gebo.schemata.agent('dan@example.com');
        agentDb.connection.on('open', function(err) {
            agentDb.connection.db.dropDatabase(function(err) {
                if (err) {
                  console.log(err);
                }
                agentDb.connection.db.close();
                callback();
              });
          });
    },

    'Return a list of drugs in lowercase': function(test) {
        test.expect(2);
        var actions = require('../../actions')(gebo);
        actions.inventory({ dbName: 'dan@example.com', read: true },
                          { sender: 'john@painter.com' }).
            then(function(drugs) {
                test.equal(drugs.length, 1);
                //test.equal(drugs[0], 'ritalin 10mg');
                test.equal(drugs[0], 'RITALIN 10MG');
                test.done();
              }).
            catch(function(err) {
                console.log(err);
                test.ok(false, 'Shouldn\'t get here');      
                test.done();
              });
    },

  };
