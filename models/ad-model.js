'use strict';

const { DataTypes, Model } = require('sequelize');
/**
 * This model is not used in the example, it is only to show
 * you how to define associations in the model classes.
 * A contact may have many orders. An order belongs to a contact.
 *
 * note also the use of the defaultValue, unique constraints and custom validation.
 */
module.exports = (sequelize) => {
    class Ad extends Model {
    }

    /**
     * Here we define the model attributes (fields)
     */
    Ad.init({
        title: {
            type: DataTypes.STRING(20),
            allowNull: false,
            validate: {
                len: [1, 20]
            }
        },
        description: {
            type: DataTypes.STRING(200),
            allowNull: true,
            validate: {
                len: [0, 200]
            }
        },
        price: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            validate: {
                min: 0
            }
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        approved: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    }, {
        sequelize,
        modelName: 'Ad',
    });
    return Ad;
}