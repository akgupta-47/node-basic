const express = require('express');
const router = express.Router();

router.route('/').get((req,res) => {
    res.status(200).json({
        message: 'holaaa from the server side!!', app: 'test-login'
    });
});

module.exports = router;