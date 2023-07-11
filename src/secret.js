require('dotenv').config();

const serverPort = process.env.SERVER_PORT || 3002;
const mongoDBUrl = process.env.MONGODB_URL;
const defaultUserImagePath = process.env.DEFAULT_USER_IMAGE_PATH || "public/images/users/default.png";
const jwtActivationKey = process.env.JWT_ACTIVATION_KEY || '2WSXZAQ1';
const smtpUserName = process.env.SMTP_USERNAME || '';
const smtpPassword = process.env.SMTP_PASSWORD || ''; 
const clientURL = process.env.CLIENT_URL || ''; 

module.exports = {
    serverPort,
    mongoDBUrl,
    defaultUserImagePath,
    jwtActivationKey,
    smtpPassword,
    smtpUserName,
    clientURL
}