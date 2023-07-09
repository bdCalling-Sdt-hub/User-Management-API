const createError = require('http-errors');
const fs = require('fs').promises;
const User = require('../models/userModel');
const { successResponse } = require('./responseController');
const { findWithId } = require('../services/findItem');
const { deleteImage } = require('../helper/deleteImage');

//Get all users
const getUsers = async(req, res, next) => {
    try {
        const  search = req.query.search || "";
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;

        const searchRegExp = new RegExp('.*' + search + '.*', 'i');
        const filter = {
            isAdmin: { $ne:true },
            $or: [
                {name: {$regex: searchRegExp}},
                {email: {$regex: searchRegExp}},
                {phone: {$regex: searchRegExp}},
            ]
        };
        const option = {
            password: 0
        }

        const users = await User.find(filter, option).limit(limit).skip((page - 1) * limit);
        const count = await User.find(filter).countDocuments();
        
        if(!users){
            throw createError(404, 'User not found');
        };

        return successResponse(res, {
            statusCode: 200,
            message: "Users returned succesfully",
            payload: {
                users,
                pagination: {
                    totalPages: Math.ceil(count / limit),
                    currentPage: page,
                    previousPage: page - 1 > 0 ? page - 1 : null,
                    nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
                },
            }
        });

    } catch (error) {
        next(error);
    }
};

//Get single user
const getUserById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const options = {password: 0};
        const user = await findWithId(User, id, options);
        return successResponse(res, {
            statusCode: 200,
            message: "User returned succesfully",
            payload: {
                user,
            }
        });
    } catch (error) {
        next(error);
    }
};

//Delete single user
const deleteUserById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const options = {password: 0};
        const user = await findWithId(User, id, options);
        
        const userImagePath = user.image;
        deleteImage(userImagePath);
        
        await User.findByIdAndDelete({_id: id, isAdmin: false})

        return successResponse(res, {
            statusCode: 200,
            message: "User deleteed succesfully",
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {getUsers, getUserById, deleteUserById};