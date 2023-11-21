const { check, validationResult } = require("express-validator");
const User = require("../models/user.model");
const Entity = require("../models/entity.model");
const EntityUser = require("../models/entity-user.model");

const validateUserEntitiesIndex = [
    //check if params id is a valid ObjectId
    check("userId", "userId field must be a valid ObjectId").isMongoId(),
    //Check if user exists
    check("userId").custom(
        async (value, { req, loc, path }) => {
            try {
                const user = await User.exists({ _id: req.params.userId })
                if (user == null) {
                    return Promise.reject("userId is not registered");
                }
            } catch (error) {
                // Handle the error
                console.error("An error occurred:", error);
                // You can choose to return a rejection or handle the error differently
                return Promise.reject("DB error");
            }
        }
    ),

    //Validate query parameters

    //Check if cargo is valid
    check("cargo").optional().isIn(Object.values(EntityUser.Cargo)),
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

const validateUserEntitiesShow = [
    //check if params id is a valid ObjectId
    check("userId", "userId field must be a valid ObjectId").isMongoId(),
    //Check if user exists
    check("userId").custom(
        async (value, { req, loc, path }) => {
            try {
                const user = await User.exists({ _id: req.params.userId })
                if (user == null) {
                    return Promise.reject("userId is not registered");
                }
            } catch (error) {
                // Handle the error
                console.error("An error occurred:", error);
                // You can choose to return a rejection or handle the error differently
                return Promise.reject("DB error");
            }
        }
    ),

    //check if params id is a valid ObjectId
    check("entityId", "entityId field must be a valid ObjectId").isMongoId(),
    //Check if entity exists
    check("entityId").custom(
        async (value, { req, loc, path }) => {
            try {
                const entity = await Entity.exists({ _id: req.params.entityId })
                if (entity == null) {
                    return Promise.reject("entityId is not registered");
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

const validateUserEntitiesStore = [
    //check if params id is a valid ObjectId
    check("userId", "userId field must be a valid ObjectId").isMongoId(),
    //Check if user exists
    check("userId").custom(
        async (value, { req, loc, path }) => {
            try {
                const user = await User.findById(req.params.userId)
                const invalidRoles = [User.Roles.admin, User.Roles.manager, User.Roles.patient, User.Roles.user];
                if (user == null) {
                    return Promise.reject("userId is not registered");
                } else if (user.active == false) {
                    return Promise.reject("userId is not active");
                }
            } catch (error) {
                // Handle the error
                console.error("An error occurred:", error);
                // You can choose to return a rejection or handle the error differently
                return Promise.reject("DB error");
            }
        }
    ),

    //check if params id is a valid ObjectId
    check("entityId", "entityId field must be a valid ObjectId").isMongoId(),
    //Check if entity exists
    check("entityId").custom(
        async (value, { req, loc, path }) => {
            try {
                const entity = await Entity.exists({ _id: req.params.entityId })
                if (entity == null) {
                    return Promise.reject("entityId is not registered");
                }
            } catch (error) {
                // Handle the error
                console.error("An error occurred:", error);
                // You can choose to return a rejection or handle the error differently
                return Promise.reject("DB error");
            }
        }
    ),

    //Validate body parameters

    //Check if cargo is valid
    check("enu_cargo").optional().isIn(Object.values(EntityUser.Cargo)),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateUserEntitiesUpdate = [
    //check if params id is a valid ObjectId
    check("userId", "userId field must be a valid ObjectId").isMongoId(),
    //Check if user exists
    check("userId").custom(
        async (value, { req, loc, path }) => {
            try {
                const user = await User.findById(req.params.userId)
                const invalidRoles = [User.Roles.admin, User.Roles.manager, User.Roles.patient, User.Roles.user];
                if (user == null) {
                    return Promise.reject("userId is not registered");
                } else if (user.active == false) {
                    return Promise.reject("userId is not active");
                }
            } catch (error) {
                // Handle the error
                console.error("An error occurred:", error);
                // You can choose to return a rejection or handle the error differently
                return Promise.reject("DB error");
            }
        }
    ),

    //check if params id is a valid ObjectId
    check("entityId", "entityId field must be a valid ObjectId").isMongoId(),
    //Check if entity exists
    check("entityId").custom(
        async (value, { req, loc, path }) => {
            try {
                const entity = await Entity.exists({ _id: req.params.entityId })
                if (entity == null) {
                    return Promise.reject("entityId is not registered");
                }
            } catch (error) {
                // Handle the error
                console.error("An error occurred:", error);
                // You can choose to return a rejection or handle the error differently
                return Promise.reject("DB error");
            }
        }
    ),

    //Validate body parameters

    //Check if cargo is valid
    check("enu_cargo").optional().isIn(Object.values(EntityUser.Cargo)),
    //Check if active is valid
    check("enu_active").optional().isBoolean(),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateUserEntitiesDelete = [
    //check if params id is a valid ObjectId
    check("userId", "userId field must be a valid ObjectId").isMongoId(),
    //Check if user exists
    check("userId").custom(
        async (value, { req, loc, path }) => {
            try {
                const user = await User.findById(req.params.userId)
                const invalidRoles = [User.Roles.admin, User.Roles.manager, User.Roles.patient, User.Roles.user];
                if (user == null) {
                    return Promise.reject("userId is not registered");
                } else if (user.active == false) {
                    return Promise.reject("userId is not active");
                }
            } catch (error) {
                // Handle the error
                console.error("An error occurred:", error);
                // You can choose to return a rejection or handle the error differently
                return Promise.reject("DB error");
            }
        }
    ),

    //check if params id is a valid ObjectId
    check("entityId", "entityId field must be a valid ObjectId").isMongoId(),
    //Check if entity exists
    check("entityId").custom(
        async (value, { req, loc, path }) => {
            try {
                const entity = await Entity.exists({ _id: req.params.entityId })
                if (entity == null) {
                    return Promise.reject("entityId is not registered");
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

module.exports = {
    validateUserEntitiesIndex,
    validateUserEntitiesShow,
    validateUserEntitiesStore,
    validateUserEntitiesUpdate,
    validateUserEntitiesDelete
}