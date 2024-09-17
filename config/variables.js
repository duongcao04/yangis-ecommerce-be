require('dotenv').config()

const variablesEnv = {
    port: process.env.PORT,
    // mongo vars
    mongodb_uri: process.env.MONGODB_URI,
    // jwt vars
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    access_token_life: process.env.ACCESS_TOKEN_LIFE,
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
    refresh_token_life: process.env.REFRESH_TOKEN_LIFE,
    // cloudinary vars
    cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
    cloudinary_secret_key: process.env.CLOUDINARY_SECRET_KEY,
    cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
}

module.exports = variablesEnv
