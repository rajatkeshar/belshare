const jwt = require('jsonwebtoken');
const constants = require('./constants');

module.exports = {

    parseRequestToken: function(token) {
        try {
    				return jwt.verify(token, constants.cipher.key);
        } catch (e) {
            return false;
        }
    },

    generateToken: function(userId) {
        const token = jwt.sign({"userId": userId}, constants.cipher.key, {
            expiresIn: 60 * 60
        });
        return token;
    }
};
