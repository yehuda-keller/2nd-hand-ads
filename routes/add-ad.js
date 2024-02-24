const express = require('express');
const db = require("../models");
const isLoggedIn = require('../middleware/is-logged-in');

const router = express.Router();

router.use(isLoggedIn);
router.get('/', function(req, res, next) {
    res.render('add-ad');
});

router.post('/', async function(req, res, next) {
    console.log(req.body);
    try {
        console.log(req.session.user);
        const ad = await db.Ad.create({...req.body,user_id: req.session.user.id});
        return res.redirect('/');
    } catch (error) {
        console.log('Error: ', error);
        return res.redirect('/add-ad');
    }
});

module.exports = router;