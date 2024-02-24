const express = require('express');
const db = require("../models");


const router = express.Router();

function mapValidationErrorToField(error) {
    //Validation error: Validation len on description failed
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
    res.render('add-ad', { error: null });
});

router.post('/', async function (req, res, next) {
    console.log(req.body);
    try {
        const ad = await db.Ad.create(req.body);
        return res.redirect('/');
    } catch (error) {
        console.log('Error: ', error);
        const fieldValidtionError = mapValidationErrorToField(error);
        return res.render('add-ad', { error: fieldValidtionError });
    }
});

module.exports = router;