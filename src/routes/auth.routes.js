const express = require("express");
const {
    signIn,
    activateAccount,
    resetPasswordSendEmail,
    resetPassword
} = require("../controllers/auth.controller");
const { 
    validateUserSignIn,
    validateUserResetPwdEmail,
    validateUserResetPwd
} = require("../validators/auth.validator");

const api = express.Router();

api.post("/login", validateUserSignIn, signIn);
api.get("/auth/activate/:uid/:token", activateAccount);
api.post("/auth/reset-password", validateUserResetPwdEmail, resetPasswordSendEmail);
api.post("/auth/reset-password/:uid/:token", validateUserResetPwd, resetPassword);

module.exports = api;