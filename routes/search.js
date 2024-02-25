const express = require('express');
const db = require('../models');
const { Op } = require('sequelize');
const router = express.Router();

router.get('/', async function (req, res, next) {
    const ads = await db.Ad.findAll({
        where: {
            title: { [Op.like]: `${req.query.title}%` },
        },
    });
    res.render('index', { ads, user: req.session.user });
});


module.exports = router;

