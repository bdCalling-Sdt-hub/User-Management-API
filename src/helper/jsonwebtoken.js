const jwt = require('jsonwebtoken');

const createJSONWebToken = ( payload, secretKey, expiresIn) => {
    if (typeof payload != 'object' || !payload) {
        throw new Error('Payload must be a non-empty object');
    }

    if ( typeof secretKey != 'string' || secretKey === '') {
        throw new Error('Secretkey must be a non-empty string');
    }
    try {
        const token = jwt.sign(payload, secretKey, {expiresIn});
        return token;
    } catch (error) {
        console.error('Failed to sign in with JWT:', error);
        throw error;
    }
};

module.exports = {createJSONWebToken};