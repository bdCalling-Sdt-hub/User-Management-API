const User = require('../models/userModel');
const data = require('../routers/data');

const seedUser = async(req, res, next) => {
    try {
        // Deleting all existing users
        await User.deleteMany({});
        //Creating new users
        const users = await User.insertMany(data.users);

        //Succesfull response
        return res.status(201).json(users);
    } catch (error) {
        next(error);
    }
};

module.exports = {seedUser};