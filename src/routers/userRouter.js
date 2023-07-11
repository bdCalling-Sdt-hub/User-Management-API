const  express = require('express');
const { getUsers, getUserById, deleteUserById, proccessRegister, activateUserAccount } = require('../controller/userController');
const userRouter = express.Router();

userRouter.post("/proccess-register", proccessRegister);
userRouter.post("/verify", activateUserAccount);
userRouter.get("/", getUsers);
userRouter.get("/:id", getUserById);
userRouter.delete("/:id", deleteUserById);

module.exports = userRouter;