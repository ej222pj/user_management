var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    if (req.session.uniqueID) {
        res.render('gym', { title: 'GymName' });
    } 
    else {
        res.redirect('/logout');
    }
});

module.exports = router;
