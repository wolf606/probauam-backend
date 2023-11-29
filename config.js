require("dotenv").config();

module.exports = {
    PORT: process.env.PORT,
    SECRET_KEY: process.env.SECRET_KEY,
    APP_HOST: process.env.APP_HOST,
    APP_PORT: process.env.APP_PORT,
    APP_URL: process.env.APP_HTTPS === 'True' ? `https://${process.env.APP_HOST}:${process.env.APP_PORT}` : `http://${process.env.APP_HOST}:${process.env.APP_PORT}`,
    FRONTEND_HOST: process.env.FRONTEND_HOST,
    FRONTEND_PORT: process.env.FRONTEND_PORT,
    FRONTEND_URL: process.env.FRONTEND_HTTPS === 'True' ? `https://${process.env.FRONTEND_HOST}:${process.env.FRONTEND_PORT}` : `http://${process.env.FRONTEND_HOST}:${process.env.FRONTEND_PORT}`,
    DB_NAME: process.env.DB_NAME,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    MAIL_SERVER: process.env.MAIL_SERVER,
    MAIL_PORT: process.env.MAIL_PORT,
    MAIL_USE_TLS: process.env.MAIL_USE_TLS === 'true',
    MAIL_USERNAME: process.env.MAIL_USERNAME,
    MAIL_PASSWORD: process.env.MAIL_PASSWORD,
    MAIL_DEFAULT_SENDER: process.env.MAIL_DEFAULT_SENDER
};
