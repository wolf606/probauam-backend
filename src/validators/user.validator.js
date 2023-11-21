const { check, validationResult } = require("express-validator");
const User = require("../models/user.model");

const validateUserStore = [
    check("email", "email field is required").exists(),
    check("email", "email field must be a string").isString(),
    check("email", "email field cannot be empty").not().isEmpty(),
    check("email", "email field has no valid value.").isEmail(),
    check("email").custom(
        async (value, { req, loc, path }) => {
            try {
                const user = await User.exists({ email: req.body.email })
                if (user !== null) {
                    return Promise.reject("email is already registered");
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

const validateUserUpdate = [
    check("id", "id field must be a valid ObjectId").isMongoId(),

    check("email", "email field must be a string").isString().optional(),
    check("email", "email field cannot be empty").not().isEmpty().optional(),
    check("email", "email field has no valid value.").isEmail().optional(),
    check("email").custom(
        async (value, { req, loc, path }) => {
            try {
                const user = await User.exists({ email: req.body.email })
                if (user !== null) {
                    return Promise.reject("email is already registered");
                }
            } catch (error) {
                // Handle the error
                console.error("An error occurred:", error);
                // You can choose to return a rejection or handle the error differently
                return Promise.reject("DB error");
            }
        }
    ).optional(),

    check("password", "password field must be a string").isString().optional(),
    check("password", "password field cannot be empty").not().isEmpty().optional(),
    check("password", "password field needs 6 or more characters").isLength({ min: 6 }).optional(),

    check("role", "role field must be an array").isArray().optional(),
    check("role")
    .custom((value) => {
        return value.every(role => Object.values(User.Roles).includes(role));
    })
    .withMessage("role field has no valid value.").optional(),

    check("active", "active field must be a boolean").isBoolean().optional(),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateUserShow = [
    check("id", "id field must be a valid ObjectId").isMongoId(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateUserDestroy = [
    check("id", "id field must be a valid ObjectId").isMongoId(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateUserIndex = [
    //Check if cargo is valid
    check("role").optional().isIn(Object.values(User.Roles)),
    //Check if active is valid
    check("active").optional().isBoolean(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateUserStore,
    validateUserUpdate,
    validateUserShow,
    validateUserDestroy,
    validateUserIndex
}