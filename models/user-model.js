'use strict';

const { DataTypes, Model } = require('sequelize');
const bcrypt = require("bcrypt");

module.exports = (sequelize) => {
    class User extends Model {


        validatePassword = async (password) => {
            return bcrypt.compare(password, this.password);
        }
    }
    User.init({
        username: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        password: DataTypes.STRING,
    }, {
        sequelize, // We need to pass the connection instance
        modelName: 'User',
        hooks: {
            beforeCreate: async (user) => {
                if (user.password) {
                    user.password = await bcrypt.hash(user.password, 10);
                }
            },
            beforeUpdate: async (user) => {
                if (user.password) {
                    user.password = await bcrypt.hash(user.password, 10);
                }
            }
        },
        instanceMethods: {
            validatePassword: async (password) => {
                return await bcrypt.compare(password, this.password);
            }
        }
    });
    return User;
};