var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    if (req.session.uniqueID == 'Tendollar') {
        res.redirect('/gym');
    }
    else {
        res.redirect('/');
    }
});

module.exports = router;
