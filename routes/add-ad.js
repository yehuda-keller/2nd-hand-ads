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
    const email = req.body.email;
    const existsEmail = await db.Ad.findOne({ where: { email } });
    let adCreated = false;

    try {
        const ad = await db.Ad.create(req.body);
        adCreated = true; // Indicate that the ad was successfully created
    } catch (error) {
        console.log('Error: ', error);
        const fieldValidationError = mapValidationErrorToField(error);
        // Render the add-ad page again with validation errors if the ad creation fails
        return res.render('add-ad', { error: fieldValidationError });
    }

    if (existsEmail && adCreated) {
        // If the email exists and the ad was created, fetch all necessary data for the index view
        const ads = await db.Ad.findAll({ where: { approved: true } });
        // Then, render the index view with a welcome back message, including the newly created ad
        return res.render('index', { ads, user: req.session.user, message: `Welcome back! ${email}` });
    } else if (adCreated) {
        // Redirect to home page normally if a new ad is successfully created and no existing email was found
        return res.redirect('/');
    }
    // Handle any other cases if necessary
});





module.exports = router;