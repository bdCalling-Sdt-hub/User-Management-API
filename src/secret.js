require('dotenv').config();

const serverPort = process.env.SERVER_PORT || 3002;
const mongoDBUrl = process.env.MONGODB_URL;
const defaultUserImagePath = process.env.DEFAULT_USER_IMAGE_PATH || "public/images/users/default.png";

module.exports = {
    serverPort,
    mongoDBUrl,
    defaultUserImagePath
}