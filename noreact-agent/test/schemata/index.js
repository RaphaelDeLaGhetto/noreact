var fs = require('fs'),
    nconf = require('nconf'),
    path = require('path'),
    Schema = require('mongoose').Schema,
    utils = require('gebo-server')(__dirname + '/../../..').utils;

nconf.file({ file: 'gebo.json' });
var TEST_DB = utils.getMongoDbName(nconf.get('testDb'));

exports.onLoad = {

    tearDown: function(callback) {
        var files = fs.readdirSync(__dirname + '/../../schemata');

        files.forEach(function(file) {
            if (require.cache[path.resolve(__dirname + '/../../schemata/' + file)]) {
              delete require.cache[path.resolve(__dirname + '/../../schemata/' + file)]
            }
        });
        callback();
    },

    'Load every file in the schemata folder': function(test) {
        test.expect(1);
        var schemata = require('../../schemata');
        test.equal(typeof schemata.noreactAgent, 'function');
        test.done();
    },
};

/**
 * add
 */
exports.add = {

    tearDown: function(callback) {
        var files = fs.readdirSync(__dirname + '/../../schemata');

        files.forEach(function(file) {
            if (require.cache[path.resolve(__dirname + '/../../schemata/' + file)]) {
              delete require.cache[path.resolve(__dirname + '/../../schemata/' + file)]
            }
        });
        callback();
    },

    'Add a gebo schema function': function(test) {
        test.expect(4);

        var schemata = require('../../schemata');
        test.equal(typeof schemata.noreactAgent, 'function');
        test.equal(schemata.test1, undefined);

        var test1Schema = require('./mocks/test1');
        schemata.add('test1', test1Schema);

        test.equal(typeof schemata.test1, 'function');
        var db = new schemata.test1(TEST_DB);
        test.equal(typeof db, 'object');
        db.connection.db.close();

        test.done();
    },


    'Add a collection of gebo schemata': function(test) {
        test.expect(7);
                            
        var schemata = require('../../schemata');
        test.equal(typeof schemata.noreactAgent, 'function');
        test.equal(schemata.test1, undefined);
        test.equal(schemata.test2, undefined);
                                                      
        var testSchemata = require('./mocks');
        schemata.add(testSchemata);     
        
        test.equal(typeof schemata.test1, 'function');
        var db = new schemata.test1(TEST_DB);
        test.equal(typeof db, 'object');
        db.connection.db.close();       
        test.equal(typeof schemata.test2, 'function');
        db = new schemata.test2(TEST_DB);
        test.equal(typeof db, 'object');
        db.connection.db.close();       
        
        test.done();
    }, 

    'Throw an error if function provided has no name': function(test) {
        test.expect(3);

        var schemata = require('../../schemata');
        test.equal(typeof schemata.noreactAgent, 'function');
        test.equal(schemata.test1, undefined);

        var testSchema = require('./mocks/test1');

        try {
            schemata.add(testSchema);
            test.ok(false, 'This should throw an error');
        }
        catch(err) {
            test.equal(err.message, 'This schema needs a name');
        }

        test.done();
    },
};

/**
 * remove
 */
exports.remove = {
    'Remove a single action': function(test) {
        test.expect(9);

        var schemata = require('../../schemata');
        test.equal(typeof schemata.noreactAgent, 'function');
        test.equal(schemata.test1, undefined);
        test.equal(schemata.test2, undefined);

        var testSchema = require('./mocks/test1');
        schemata.add('test1', testSchema);
        testSchema = require('./mocks/test2');
        schemata.add('test2', testSchema);

        test.equal(typeof schemata.test1, 'function');
        test.equal(typeof new schemata.test1(TEST_DB), 'object');
        test.equal(typeof schemata.test2, 'function');
        test.equal(typeof new schemata.test2(TEST_DB), 'object');

        schemata.remove('test1');
        test.equal(schemata.test1, undefined);
        test.equal(typeof schemata.test2, 'function');

        test.done();
    },
};

