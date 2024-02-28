const express = require('express');
const db = require('../models');
const router = express.Router();
const isLoggedIn = require('../middleware/is-logged-in');

router.use(isLoggedIn);

router.get('/approve/:id', async function (req, res, next) {
    try {
        const ad = await db.Ad.findByPk(req.params.id);
        await ad.update({ approved: true });
        res.redirect('/admin');
    } catch (error) {
        console.log('Error: ', error);
        res.redirect('/admin');
    }
});

router.get('/delete/:id', async function (req, res, next) {
    try {
        const ad = await db.Ad.findByPk(req.params.id);
        await ad.destroy();
        res.redirect('/admin');
    } catch (error) {
        console.log('Error: ', error);
        res.redirect('/admin');
    }
});

router.post('/edit/:id', async function (req, res, next) {
    try {
        const ad = await db.Ad.findByPk(req.params.id);
        await ad.update(req.body);
        res.redirect('/admin');
    } catch (error) {
        console.log('Error: ', error);
        res.redirect('/admin');
    }
});

router.get('/edit/:id', async function (req, res, next) {
    try {
        const ad = await db.Ad.findByPk(req.params.id);
        res.render('edit-ad', { ad });
    } catch (error) {
        console.log('Error: ', error);
        res.redirect('/admin');
    }
});

router.get('/', async function (req, res, next) {
    const ads = await db.Ad.findAll();

    res.render('index', { ads, user: req.session.user });
});



module.exports = router;
