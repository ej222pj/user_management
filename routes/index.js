var express = require('express');
var router = express.Router();

/* GET home page. */
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
    if (req.body.username == 'admin' && req.body.password == 'admin') {
      req.session.uniqueID = req.body.username;
    }
    req.flash("info", "Wrong username or password!");
    res.redirect('/redirect');
  }
});

module.exports = router;
