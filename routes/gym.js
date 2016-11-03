var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    if (req.session.uniqueID) {
        res.render('gym', { title: req.session.gymNameSession });
    } 
    else {
        res.redirect('/logout');
    }
});

module.exports = router;
