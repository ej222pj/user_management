var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/myproject';

router.get('/', function (req, res) {

    var findDocuments = function (db, callback) {
        // Get the documents collection
        var collection = db.collection('documents');
        // Find some documents
        collection.find({ username: req.session.uniqueID }).toArray(function (err, docs) {
            assert.equal(err, null);
            console.log("Found the following records");
            console.log(docs)
            callback(docs);

            if (docs.length == 0) {
                res.redirect('/');
            }
            else {
                res.redirect('/gym');
            }
        });
    }

    // Use connect method to connect to the server
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        console.log("Connected successfully to registration server");

        findDocuments(db, function () {
            db.close();
        });
    });
});

module.exports = router;
