const mongoose = require('mongoose');
const { mongoDBUrl } = require('../secret');

const connectDatabase = async(options = {}) => {
    try {
        await mongoose.connect(mongoDBUrl, options);
        console.log('MongoDb Connection Successfull');
        mongoose.connection.on('error', (error) =>{
            console.error('Database connection error ', error);
        });
    } catch (error) {
        console.error('Could not connect to DB ', error.toString());
    }
}

module.exports = {
    connectDatabase
}