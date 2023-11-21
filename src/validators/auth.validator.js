const { check, validationResult } = require("express-validator");
const User = require("../models/user.model");

const validateUserSignIn = [

    check("email", "email field is required").exists(),
    check("email", "email field must be a string").isString(),
    check("email", "email field cannot be empty").not().isEmpty(),
    check("email", "email field has no valid value.").isEmail(),
    check("email").custom(
        async (value, { req, loc, path }) => {
            try {
                const user = await User.exists({ email: req.body.email })
                if (user == null) {
                    return Promise.reject("email is not registered");
                }
            } catch (error) {
                // Handle the error
                console.error("An error occurred:", error);
                // You can choose to return a rejection or handle the error differently
                return Promise.reject("DB error");
            }
        }
    ),

    check("password", "password field is required").exists(),
    check("password", "password field must be a string").isString(),
    check("password", "password field cannot be empty").not().isEmpty(),
    check("password", "password field needs 6 or more characters").isLength({ min: 6 }),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
    
];

const validateUserResetPwdEmail = [

    check("email", "email field is required").exists(),
    check("email", "email field must be a string").isString(),
    check("email", "email field cannot be empty").not().isEmpty(),
    check("email", "email field has no valid value.").isEmail(),
    check("email").custom(
        async (value, { req, loc, path }) => {
            try {
                const user = await User.exists({ email: req.body.email })
                if (user == null) {
                    return Promise.reject("email is not registered");
                }
            } catch (error) {
                // Handle the error
                console.error("An error occurred:", error);
                // You can choose to return a rejection or handle the error differently
                return Promise.reject("DB error");
            }
        }
    ),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateUserResetPwd = [

    check("password", "password field is required").exists(),
    check("password", "password field must be a string").isString(),
    check("password", "password field cannot be empty").not().isEmpty(),
    check("password", "password field needs 6 or more characters").isLength({ min: 6 }),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
    
];

module.exports = {
    validateUserSignIn,
    validateUserResetPwdEmail,
    validateUserResetPwd
};