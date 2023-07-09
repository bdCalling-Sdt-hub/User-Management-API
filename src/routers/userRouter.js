const  express = require('express');
const { getUsers, getUserById, deleteUserById } = require('../controller/userController');
const userRouter = express.Router();

userRouter.get("/", getUsers);
userRouter.get("/:id", getUserById);
userRouter.delete("/:id", deleteUserById);

module.exports = userRouter;