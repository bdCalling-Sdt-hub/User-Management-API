const  express = require('express');
const { getUsers, getUserById, deleteUserById, proccessRegister } = require('../controller/userController');
const userRouter = express.Router();

userRouter.post("/proccess-register", proccessRegister);
userRouter.get("/", getUsers);
userRouter.get("/:id", getUserById);
userRouter.delete("/:id", deleteUserById);

module.exports = userRouter;