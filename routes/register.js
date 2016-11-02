var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/myproject';

/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.session.uniqueID) {
    res.redirect('/redirect');
  } else {
    res.render('register', { title: 'Register New Gym!' });
  }
});

router.post('/', function (req, res) {
  var insertDocuments = function (db, callback) {
    // Get the documents collection
    var collection = db.collection('documents');
    // Insert some documents
    collection.insertMany([
      {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        gymname: req.body.gymname
      }
    ], function (err, result) {
      assert.equal(err, null);
      assert.equal(1, result.result.n);
      assert.equal(1, result.ops.length);
      console.log("Registerd a new Gym!");
      callback(result);
    });
  }


  var findDocuments = function (db, callback) {
    // Get the documents collection
    var collection = db.collection('documents');
    // Find some documents
    collection.find({}).toArray(function (err, docs) {
      assert.equal(err, null);
      console.log("Found the following records");
      console.log(docs)
      callback(docs);
    });
  }

  if (req.session.uniqueID) {
    res.redirect('/redirect');
  } else {
    var match = req.body.email.match(/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i);
    if (req.body.username.length < 26 && req.body.username.length > 1 &&
      req.body.gymname.length < 26 && req.body.gymname.length > 1 &&
      req.body.password == req.body.repeatpassword &&
      match !== null) {
      // Use connect method to connect to the server
      MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        console.log("Connected successfully to registration server");

        insertDocuments(db, function () {
          findDocuments(db, function () {
            db.close();
          });
        });
      });
    req.flash("info", "Registration was successfull, please login!");
    res.redirect('/');
    } else {
      req.flash("info", "Something went wrong, try again!");
      res.redirect('/register');
    }
  }
});

module.exports = router;
