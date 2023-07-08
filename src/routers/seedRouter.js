const express = require('express');
const { seedUser } = require('../controller/seedController');
const seedRouter = express.Router();

seedRouter.get('/users', seedUser);

module.exports = seedRouter;