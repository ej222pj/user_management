var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/myproject';

router.get('/', function (req, res, next) {
  if (req.session.uniqueID) {
    res.redirect('/redirect');
  } else {
    res.render('index', { title: 'Your User Managing Website!' });
  }
});

router.post('/', function (req, res) {
  if (req.session.uniqueID) {
    res.redirect('/redirect');
  } else {
    var username;
    var password;
    var findDocuments = function (db, callback) {
      // Get the documents collection
      var collection = db.collection('documents');
      // Find some documents
      collection.find({ username: req.body.username }).toArray(function (err, docs) {
        assert.equal(err, null);
        console.log("Found the following records");
        console.log(docs)
        callback(docs);
        if (docs.length == 0) {
          username = "";
          password = "";
        }
        else {
          username = docs[0].username;
          password = docs[0].password;
        }

        if (req.body.username == username && req.body.password == password) {
          req.session.uniqueID = username;
          res.redirect('/redirect');
        } else {
          req.flash("info", "Wrong username or password!");
          res.redirect('/redirect');
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
  }
});

module.exports = router;
