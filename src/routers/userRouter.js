const  express = require('express');
const { getUsers } = require('../controller/userController');
const userRouter = express.Router();

userRouter.get("/", getUsers);

module.exports = userRouter;