var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/myproject';

router.get('/', function (req, res, next) {
    if (req.session.uniqueID) {
        res.render('add', { title: 'req.session.gymNameSession' });
    }
    else {
        res.redirect('/redirect');
    }
});

router.post('/', function (req, res) {
    if (req.session.uniqueID) {
        var insertDocuments = function (db, callback) {
            // Get the documents collection
            var collection = db.collection('documents');
            // Insert
            collection.insert([
                {
                    gym: req.session.gymNameSession,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    birthdate: req.body.birthdate,
                    email: req.body.email,
                    gender: req.body.gender,
                    status: req.body.status
                }
            ], function (err, result) {
                assert.equal(err, null);
                assert.equal(1, result.result.n);
                assert.equal(1, result.ops.length);

                console.log("Registerd new member!");
                callback(result);
            });
        }

        var findDocuments = function (db, callback) {
            // Get the documents collection
            var collection = db.collection('documents');
            // Find all
            collection.find({}).toArray(function (err, docs) {
                assert.equal(err, null);
                console.log("Found the following records");
                console.log(docs)
                callback(docs);
            });
        }
        var matchBirthDate = req.body.birthdate.match(/^((19|20)[0-9][0-9])-(0[1-9]|1[1-2])-(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/)
        var matchEmail = req.body.email.match(/^.+@.+\..+$/);

        if (req.body.firstname.length < 26 && req.body.firstname.length > 0 &&
            req.body.lastname.length < 26 && req.body.lastname.length > 0 &&
            matchEmail !== null && matchBirthDate !== null &&
            req.body.gender.length > 0 && req.body.status.length > 0) {
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
            req.flash("info", "New member was added!");
            res.redirect('/gym/add');
        } else {
            req.flash("info", "Something went wrong, try again!");
            res.redirect('/gym/add');
        }
    } else {
        res.redirect('/redirect');
    }
});


module.exports = router;
