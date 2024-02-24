const express = require('express');
const db = require('../models');
const router = express.Router();

/* GET home page. */
router.get('/', async function (req, res, next) {
  const ads = await db.Ad.findAll({ where: { approved: true } });

  res.render('index', { ads, user: null });
});



module.exports = router;
