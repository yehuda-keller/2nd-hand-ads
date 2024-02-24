const express = require('express');
const db = require('../models');
const createUserSession = require('../utils/create-user-session');
const router = express.Router();


router.get('/', function (req, res, next) {
    res.render('login');
});

router.post('/', async function (req, res, next) {
    try {
        const user = await db.User.findOne({ where: { username: req.body.username } });
        if (!user) {
            return res.redirect('/login');
        }
        await user.validatePassword(req.body.password);
        //return createUserSession(req, res, next, user);
        req.session.regenerate(function (err) {
            if (err) next(err)

            // store user information in session, typically a user id
            req.session.user = user.toJSON();

            // save the session before redirection to ensure page
            // load does not happen before session is saved
            req.session.save(function (err) {
                if (err) return next(err);
                res.redirect('/admin');
            })
        })
    } catch (error) {
        console.log('Error: ', error);
        return res.redirect('/login');
    }

});

module.exports = router;

