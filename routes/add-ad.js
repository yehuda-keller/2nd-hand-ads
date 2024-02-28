const express = require('express');
const db = require("../models");
const cookieParser = require('cookie-parser');


const router = express.Router();

function mapValidationErrorToField(error) {

    if (error.message.startsWith('Validation error:')) {
        switch (true) {
            case error.message.includes('title'):
                return { title: 'Title must be between 5 and 20 characters' };
            case error.message.includes('description'):
                return { description: 'Description must be between 5 and 200 characters' };
            case error.message.includes('price'):
                return { price: 'Price must be a positive number' };
            case error.message.includes('email'):
                return { email: 'Email must be a valid email' };
            case error.message.includes('phoneNumber'):
                return { phoneNumber: 'Phone number must be a valid phone number' };
            default:
                return null;
        }
    }

}

router.get('/', function (req, res, next) {
    res.render('add-ad', { error: null, adCreated: false });
});

router.post('/', async function (req, res, next) {
    const email = req.body.email;
    const existsEmail = await db.Ad.findOne({ where: { email } });




    let adCreated = false;

    try {
        const ad = await db.Ad.create(req.body);
        adCreated = true;
    } catch (error) {
        console.log('Error: ', error);
        const fieldValidationError = mapValidationErrorToField(error);

        return res.render('add-ad', { error: fieldValidationError, adCreated: false });
    }

    if (existsEmail && adCreated) {

        const ads = await db.Ad.findAll({ where: { approved: true } });

        return res.render('index', { ads, user: req.session.user, message: `Welcome back! ${email} Your ad has been published and is waiting for admin approval`, adCreated: true });


    } else if (adCreated) {

        const ads = await db.Ad.findAll({ where: { approved: true } });


        return res.render('index', { ads, user: req.session.user, message: `Your ad has been published and is waiting for admin approval`, adCreated: true });
    }

});




module.exports = router;