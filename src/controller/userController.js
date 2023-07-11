const createError = require('http-errors');
const fs = require('fs').promises;
const User = require('../models/userModel');
const { successResponse } = require('./responseController');
const { findWithId } = require('../services/findItem');
const { deleteImage } = require('../helper/deleteImage');
const { jwtActivationKey, clientURL } = require('../secret');
const { createJSONWebToken } = require('../helper/jsonwebtoken');
const emailWithNodeMailer = require('../helper/email');
const jwt = require('jsonwebtoken');

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

const proccessRegister = async (req, res, next) => {
    try {
        const {name, email, password, address, phone} = req.body;
        const userExist = await User.exists({email: email});
        if(userExist){
            throw createError(409, 'User already exist'); 
        }
        //Create jwt
        const token = createJSONWebToken({name, email, password, address, phone}, jwtActivationKey, '10m');

        //Prepare email
        const emailData = {
            email,
            subject: 'Account Activation E-Mail',
            html: `
                <h2>Hello, ${name}!</h2>
                <p><a href="${clientURL}/api/users/activate/${token}" target="_blank">Activate Your Account</a></p>
            `
        };

        //Send mailer with node mailer
        try {
            await emailWithNodeMailer(emailData);
        } catch (emailError) {
            next(createError(500, 'Failed to sent verification email'));
            return;
        }

        return successResponse(res, {
            statusCode: 200,
            message: `Check your ${email} and complete verification`,
            payload: {token}
        });
    } catch (error) {
        next(error);
    }
};

const activateUserAccount = async (req, res, next) => {
    try {
        const token = req.body.token;
        if(!token) throw createError(404, 'Token not found');

        const decoded = jwt.verify(token, jwtActivationKey);
        
        if(!decoded) throw createError(401, 'User is not verified');

        const userExist = await User.exists({email: decoded.email});
        if(userExist){
            throw createError(409, 'User already exist'); 
        }

        User.create(decoded);

        return successResponse(res, {
            statusCode: 201,
            message: 'User registered successfully',
        });
    } catch (error) {
        // if (error.name == 'TokenExpiredError') {
        //     throw createError(401, 'Token Has Expired');
        // }else if(error.name == 'JsonWebTokenError'){
        //     throw createError(401, 'Invalid Token')
        // }else{
        //     throw error;
        // }
        next(error);
    }
};

module.exports = {getUsers, getUserById, deleteUserById, proccessRegister, activateUserAccount};