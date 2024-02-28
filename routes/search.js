const express = require('express');
const db = require('../models');
const { Op } = require('sequelize');
const router = express.Router();

router.get('/', async function (req, res, next) {
    const ads = await db.Ad.findAll({
        where: {
            title: { [Op.like]: `%${req.query.title}%` },
        },
    });
    const adsCount = ads.length;

    res.render('index', { ads, user: req.session.user,message:`I found ${adsCount} matching ads for you` });
});


module.exports = router;

