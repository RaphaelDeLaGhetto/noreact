
var gebo = require('gebo-server')(__dirname + '/../..');

exports.onLoad = {

    'Load and initialize every file in the actions folder': function(test) {
        test.expect(2);
        test.ok(!!gebo);

        var actions = require('../../actions')(gebo);
        test.equal(typeof actions.search, 'function');
        test.done();
    },
};

