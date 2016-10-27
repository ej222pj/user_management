var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    if (req.session.uniqueID == 'admin') {
        res.redirect('/gym');
    }
    else {
        req.flash("info", "Wrong username or password!");
        res.redirect('/');
    }
});

module.exports = router;
