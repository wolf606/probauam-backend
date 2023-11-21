const { check, validationResult } = require("express-validator");
const User = require("../models/user.model");
const Entity = require("../models/entity.model");
const EntityUser = require("../models/entity-user.model");

const validateEntityShowDelete = [
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

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }

];

const validateEntityStore = [

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
    
    check("ent_nombre", "ent_nombre field must be a string").isString().optional(),
    check("ent_nombre", "ent_nombre field cannot be empty").not().isEmpty().optional(),
    check("ent_nombre", "ent_nombre field needs 3 or more characters").isLength({ min: 3 }).optional(),

    check("ent_celpai", "ent_celpai field must be a string").isString().optional(),
    check("ent_celpai", "ent_celpai field cannot be empty").not().isEmpty().optional(),
    check("ent_celpai", "ent_celpai field needs 2 or more characters").isLength({ min: 2 }).optional(),
    check("ent_celpai", "ent_celpai field needs 5 or less characters").isLength({ max: 5 }).optional(),

    check("ent_celula", "ent_celula field must be a string").isString().optional(),
    check("ent_celula", "ent_celula field cannot be empty").not().isEmpty().optional(),
    check("ent_celula", "ent_celula field needs 10 characters").isLength({ min: 10, max: 10 }).optional(),

    check("ent_direcc", "ent_direcc field must be an object").isObject().optional(),

    check("ent_direcc.add_addres", "ent_direcc.add_addres field must be a string").isString().optional(),
    check("ent_direcc.add_addres", "ent_direcc.add_addres field cannot be empty").not().isEmpty().optional(),
    check("ent_direcc.add_addres", "ent_direcc.add_addres field needs 3 or more characters").isLength({ min: 3 }).optional(),
    check("ent_direcc.add_addres", "ent_direcc.add_addres field needs 100 or less characters").isLength({ max: 100 }).optional(),

    check("ent_direcc.add_city", "ent_direcc.add_city field must be a string").isString().optional(),
    check("ent_direcc.add_city", "ent_direcc.add_city field cannot be empty").not().isEmpty().optional(),
    check("ent_direcc.add_city", "ent_direcc.add_city field needs 3 or more characters").isLength({ min: 3 }).optional(),
    check("ent_direcc.add_city", "ent_direcc.add_city field needs 100 or less characters").isLength({ max: 100 }).optional(),

    check("ent_direcc.add_poscod", "ent_direcc.add_poscod field must be a string").isString().optional(),
    check("ent_direcc.add_poscod", "ent_direcc.add_poscod field cannot be empty").not().isEmpty().optional(),
    check("ent_direcc.add_poscod", "ent_direcc.add_poscod field needs 3 or more characters").isLength({ min: 3 }).optional(),
    check("ent_direcc.add_poscod", "ent_direcc.add_poscod field needs 10 or less characters").isLength({ max: 10 }).optional(),

    check("ent_direcc.add_countr", "ent_direcc.add_countr field must be a string").isString().optional(),
    check("ent_direcc.add_countr", "ent_direcc.add_countr field cannot be empty").not().isEmpty().optional(),
    check("ent_direcc.add_countr", "ent_direcc.add_countr field needs 3 or more characters").isLength({ min: 3 }).optional(),
    check("ent_direcc.add_countr", "ent_direcc.add_countr field needs 100 or less characters").isLength({ max: 100 }).optional(),

    check("ent_direcc.add_state", "ent_direcc.add_state field must be a string").isString().optional(),
    check("ent_direcc.add_state", "ent_direcc.add_state field cannot be empty").not().isEmpty().optional(),
    check("ent_direcc.add_state", "ent_direcc.add_state field needs 3 or more characters").isLength({ min: 3 }).optional(),
    check("ent_direcc.add_state", "ent_direcc.add_state field needs 100 or less characters").isLength({ max: 100 }).optional(),

    check("ent_direcc.add_telcou", "ent_direcc.add_telcou field must be a string").isString().optional(),
    check("ent_direcc.add_telcou", "ent_direcc.add_telcou field cannot be empty").not().isEmpty().optional(),
    check("ent_direcc.add_telcou", "ent_direcc.add_telcou field needs 2 or more characters").isLength({ min: 2 }).optional(),
    check("ent_direcc.add_telcou", "ent_direcc.add_telcou field needs 5 or less characters").isLength({ max: 5 }).optional(),

    check("ent_direcc.add_teleph", "ent_direcc.add_teleph field must be a string").isString().optional(),
    check("ent_direcc.add_teleph", "ent_direcc.add_teleph field cannot be empty").not().isEmpty().optional(),
    check("ent_direcc.add_teleph", "ent_direcc.add_teleph field needs at least 8").isLength({ min: 8 }).optional(),
    check("ent_direcc.add_teleph", "ent_direcc.add_teleph field needs 10 or less characters").isLength({ max: 10 }).optional(),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateEntityUpdate = [

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

    check("ent_nombre", "ent_nombre field must be a string").isString().optional(),
    check("ent_nombre", "ent_nombre field cannot be empty").not().isEmpty().optional(),
    check("ent_nombre", "ent_nombre field needs 3 or more characters").isLength({ min: 3 }).optional(),

    check("ent_celpai", "ent_celpai field must be a string").isString().optional(),
    check("ent_celpai", "ent_celpai field cannot be empty").not().isEmpty().optional(),
    check("ent_celpai", "ent_celpai field needs 2 or more characters").isLength({ min: 2 }).optional(),
    check("ent_celpai", "ent_celpai field needs 5 or less characters").isLength({ max: 5 }).optional(),

    check("ent_celula", "ent_celula field must be a string").isString().optional(),
    check("ent_celula", "ent_celula field cannot be empty").not().isEmpty().optional(),
    check("ent_celula", "ent_celula field needs 10 characters").isLength({ min: 10, max: 10 }).optional(),

    check("ent_direcc", "ent_direcc field must be an object").isObject().optional(),

    check("ent_direcc.add_addres", "ent_direcc.add_addres field must be a string").isString().optional(),
    check("ent_direcc.add_addres", "ent_direcc.add_addres field cannot be empty").not().isEmpty().optional(),
    check("ent_direcc.add_addres", "ent_direcc.add_addres field needs 3 or more characters").isLength({ min: 3 }).optional(),
    check("ent_direcc.add_addres", "ent_direcc.add_addres field needs 100 or less characters").isLength({ max: 100 }).optional(),

    check("ent_direcc.add_city", "ent_direcc.add_city field must be a string").isString().optional(),
    check("ent_direcc.add_city", "ent_direcc.add_city field cannot be empty").not().isEmpty().optional(),
    check("ent_direcc.add_city", "ent_direcc.add_city field needs 3 or more characters").isLength({ min: 3 }).optional(),
    check("ent_direcc.add_city", "ent_direcc.add_city field needs 100 or less characters").isLength({ max: 100 }).optional(),

    check("ent_direcc.add_poscod", "ent_direcc.add_poscod field must be a string").isString().optional(),
    check("ent_direcc.add_poscod", "ent_direcc.add_poscod field cannot be empty").not().isEmpty().optional(),
    check("ent_direcc.add_poscod", "ent_direcc.add_poscod field needs 3 or more characters").isLength({ min: 3 }).optional(),
    check("ent_direcc.add_poscod", "ent_direcc.add_poscod field needs 10 or less characters").isLength({ max: 10 }).optional(),

    check("ent_direcc.add_countr", "ent_direcc.add_countr field must be a string").isString().optional(),
    check("ent_direcc.add_countr", "ent_direcc.add_countr field cannot be empty").not().isEmpty().optional(),
    check("ent_direcc.add_countr", "ent_direcc.add_countr field needs 3 or more characters").isLength({ min: 3 }).optional(),
    check("ent_direcc.add_countr", "ent_direcc.add_countr field needs 100 or less characters").isLength({ max: 100 }).optional(),

    check("ent_direcc.add_state", "ent_direcc.add_state field must be a string").isString().optional(),
    check("ent_direcc.add_state", "ent_direcc.add_state field cannot be empty").not().isEmpty().optional(),
    check("ent_direcc.add_state", "ent_direcc.add_state field needs 3 or more characters").isLength({ min: 3 }).optional(),
    check("ent_direcc.add_state", "ent_direcc.add_state field needs 100 or less characters").isLength({ max: 100 }).optional(),

    check("ent_direcc.add_telcou", "ent_direcc.add_telcou field must be a string").isString().optional(),
    check("ent_direcc.add_telcou", "ent_direcc.add_telcou field cannot be empty").not().isEmpty().optional(),
    check("ent_direcc.add_telcou", "ent_direcc.add_telcou field needs 2 or more characters").isLength({ min: 2 }).optional(),
    check("ent_direcc.add_telcou", "ent_direcc.add_telcou field needs 5 or less characters").isLength({ max: 5 }).optional(),

    check("ent_direcc.add_teleph", "ent_direcc.add_teleph field must be a string").isString().optional(),
    check("ent_direcc.add_teleph", "ent_direcc.add_teleph field cannot be empty").not().isEmpty().optional(),
    check("ent_direcc.add_teleph", "ent_direcc.add_teleph field needs at least 8").isLength({ min: 8 }).optional(),
    check("ent_direcc.add_teleph", "ent_direcc.add_teleph field needs 10 or less characters").isLength({ max: 10 }).optional(),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateEntityIndexUsers = [
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

module.exports = {
    validateEntityShowDelete,
    validateEntityStore,
    validateEntityUpdate,
    validateEntityIndexUsers
}