const { check, validationResult } = require("express-validator");
const User = require("../models/user.model");
const ProfileSchema = require("../models/profile.model");

const validateProfileStore = [

    //check if params id is a valid ObjectId
    check("id", "id field must be a valid ObjectId").isMongoId(),
    //Check if user exists
    check("id").custom(
        async (value, { req, loc, path }) => {
            try {
                const user = await User.exists({ _id: req.params.id })
                if (user == null) {
                    return Promise.reject("id is not registered");
                }
            } catch (error) {
                // Handle the error
                console.error("An error occurred:", error);
                // You can choose to return a rejection or handle the error differently
                return Promise.reject("DB error");
            }
        }
    ),
    
    check("pro_nombre", "pro_nombre field must be a string").isString(),
    check("pro_nombre", "pro_nombre field cannot be empty").not().isEmpty(),
    check("pro_nombre", "pro_nombre field needs 3 or more characters").isLength({ min: 3 }),

    check("pro_apelli", "pro_apelli field must be a string").isString(),
    check("pro_apelli", "pro_apelli field cannot be empty").not().isEmpty(),
    check("pro_apelli", "pro_apelli field needs 3 or more characters").isLength({ min: 3 }),

    check("pro_tipide", "pro_tipide field must be a string").isString(),
    check("pro_tipide", "pro_tipide field cannot be empty").not().isEmpty(),
    check("pro_tipide", "pro_tipide field has no valid value.").isIn(Object.values(ProfileSchema.TipoIdentificacion)),

    check("pro_numide", "pro_numide field must be a string").isString(),
    check("pro_numide", "pro_numide field cannot be empty").not().isEmpty(),
    check("pro_numide", "pro_numide field needs 3 or more characters").isLength({ min: 3 }),
    check("pro_numide", "pro_numide field needs 16 or less characters").isLength({ max: 16 }),

    check("pro_fecnac", "pro_fecnac field must be a date").isDate().optional(),

    check("pro_celpai", "pro_celpai field must be a string").isString(),
    check("pro_celpai", "pro_celpai field cannot be empty").not().isEmpty(),
    check("pro_celpai", "pro_celpai field needs 2 or more characters").isLength({ min: 2 }),
    check("pro_celpai", "pro_celpai field needs 5 or less characters").isLength({ max: 5 }),

    check("pro_celula", "pro_celula field must be a string").isString(),
    check("pro_celula", "pro_celula field cannot be empty").not().isEmpty(),
    check("pro_celula", "pro_celula field needs 10 characters").isLength({ min: 10, max: 10 }),

    check("pro_addres", "pro_addres field must be an object").isObject().optional(),

    check("pro_addres.add_addres", "pro_addres.add_addres field must be a string").isString().optional(),
    check("pro_addres.add_addres", "pro_addres.add_addres field cannot be empty").not().isEmpty().optional(),
    check("pro_addres.add_addres", "pro_addres.add_addres field needs 3 or more characters").isLength({ min: 3 }).optional(),
    check("pro_addres.add_addres", "pro_addres.add_addres field needs 100 or less characters").isLength({ max: 100 }).optional(),

    check("pro_addres.add_city", "pro_addres.add_city field must be a string").isString().optional(),
    check("pro_addres.add_city", "pro_addres.add_city field cannot be empty").not().isEmpty().optional(),
    check("pro_addres.add_city", "pro_addres.add_city field needs 3 or more characters").isLength({ min: 3 }).optional(),
    check("pro_addres.add_city", "pro_addres.add_city field needs 100 or less characters").isLength({ max: 100 }).optional(),

    check("pro_addres.add_poscod", "pro_addres.add_poscod field must be a string").isString().optional(),
    check("pro_addres.add_poscod", "pro_addres.add_poscod field cannot be empty").not().isEmpty().optional(),
    check("pro_addres.add_poscod", "pro_addres.add_poscod field needs 3 or more characters").isLength({ min: 3 }).optional(),
    check("pro_addres.add_poscod", "pro_addres.add_poscod field needs 10 or less characters").isLength({ max: 10 }).optional(),

    check("pro_addres.add_countr", "pro_addres.add_countr field must be a string").isString().optional(),
    check("pro_addres.add_countr", "pro_addres.add_countr field cannot be empty").not().isEmpty().optional(),
    check("pro_addres.add_countr", "pro_addres.add_countr field needs 3 or more characters").isLength({ min: 3 }).optional(),
    check("pro_addres.add_countr", "pro_addres.add_countr field needs 100 or less characters").isLength({ max: 100 }).optional(),

    check("pro_addres.add_state", "pro_addres.add_state field must be a string").isString().optional(),
    check("pro_addres.add_state", "pro_addres.add_state field cannot be empty").not().isEmpty().optional(),
    check("pro_addres.add_state", "pro_addres.add_state field needs 3 or more characters").isLength({ min: 3 }).optional(),
    check("pro_addres.add_state", "pro_addres.add_state field needs 100 or less characters").isLength({ max: 100 }).optional(),

    check("pro_addres.add_telcou", "pro_addres.add_telcou field must be a string").isString().optional(),
    check("pro_addres.add_telcou", "pro_addres.add_telcou field cannot be empty").not().isEmpty().optional(),
    check("pro_addres.add_telcou", "pro_addres.add_telcou field needs 2 or more characters").isLength({ min: 2 }).optional(),
    check("pro_addres.add_telcou", "pro_addres.add_telcou field needs 5 or less characters").isLength({ max: 5 }).optional(),

    check("pro_addres.add_teleph", "pro_addres.add_teleph field must be a string").isString().optional(),
    check("pro_addres.add_teleph", "pro_addres.add_teleph field cannot be empty").not().isEmpty().optional(),
    check("pro_addres.add_teleph", "pro_addres.add_teleph field needs at least 8").isLength({ min: 8 }).optional(),
    check("pro_addres.add_teleph", "pro_addres.add_teleph field needs 10 or less characters").isLength({ max: 10 }).optional(),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateProfileUpdate = [

    //check if params id is a valid ObjectId
    check("id", "id field must be a valid ObjectId").isMongoId(),
    //Check if user exists
    check("id").custom(
        async (value, { req, loc, path }) => {
            try {
                const user = await User.exists({ _id: req.params.id })
                if (user == null) {
                    return Promise.reject("id is not registered");
                }
            } catch (error) {
                // Handle the error
                console.error("An error occurred:", error);
                // You can choose to return a rejection or handle the error differently
                return Promise.reject("DB error");
            }
        }
    ),

    check("pro_nombre", "pro_nombre field must be a string").isString().optional(),
    check("pro_nombre", "pro_nombre field cannot be empty").not().isEmpty().optional(),
    check("pro_nombre", "pro_nombre field needs 3 or more characters").isLength({ min: 3 }).optional(),

    check("pro_apelli", "pro_apelli field must be a string").isString().optional(),
    check("pro_apelli", "pro_apelli field cannot be empty").not().isEmpty().optional(),
    check("pro_apelli", "pro_apelli field needs 3 or more characters").isLength({ min: 3 }).optional(),

    check("pro_tipide", "pro_tipide field must be a string").isString().optional(),
    check("pro_tipide", "pro_tipide field cannot be empty").not().isEmpty().optional(),
    check("pro_tipide", "pro_tipide field has no valid value.").isIn(Object.values(ProfileSchema.TipoIdentificacion)).optional(),

    check("pro_numide", "pro_numide field must be a string").isString().optional(),
    check("pro_numide", "pro_numide field cannot be empty").not().isEmpty().optional(),
    check("pro_numide", "pro_numide field needs 3 or more characters").isLength({ min: 3 }).optional(),
    check("pro_numide", "pro_numide field needs 16 or less characters").isLength({ max: 16 }).optional(),

    check("pro_fecnac", "pro_fecnac field must be a date").isDate().optional(),

    check("pro_celpai", "pro_celpai field must be a string").isString().optional(),
    check("pro_celpai", "pro_celpai field cannot be empty").not().isEmpty().optional(),
    check("pro_celpai", "pro_celpai field needs 2 or more characters").isLength({ min: 2 }).optional(),
    check("pro_celpai", "pro_celpai field needs 5 or less characters").isLength({ max: 5 }).optional(),
    
    check("pro_celula", "pro_celula field must be a string").isString().optional(),
    check("pro_celula", "pro_celula field cannot be empty").not().isEmpty().optional(),
    check("pro_celula", "pro_celula field needs 10 characters").isLength({ min: 10, max: 10 }).optional(),

    check("pro_addres", "pro_addres field must be an object").isObject().optional(),

    check("pro_addres.add_addres", "pro_addres.add_addres field must be a string").isString().optional(),
    check("pro_addres.add_addres", "pro_addres.add_addres field cannot be empty").not().isEmpty().optional(),
    check("pro_addres.add_addres", "pro_addres.add_addres field needs 3 or more characters").isLength({ min: 3 }).optional(),
    check("pro_addres.add_addres", "pro_addres.add_addres field needs 100 or less characters").isLength({ max: 100 }).optional(),

    check("pro_addres.add_city", "pro_addres.add_city field must be a string").isString().optional(),
    check("pro_addres.add_city", "pro_addres.add_city field cannot be empty").not().isEmpty().optional(),
    check("pro_addres.add_city", "pro_addres.add_city field needs 3 or more characters").isLength({ min: 3 }).optional(),
    check("pro_addres.add_city", "pro_addres.add_city field needs 100 or less characters").isLength({ max: 100 }).optional(),

    check("pro_addres.add_poscod", "pro_addres.add_poscod field must be a string").isString().optional(),
    check("pro_addres.add_poscod", "pro_addres.add_poscod field cannot be empty").not().isEmpty().optional(),
    check("pro_addres.add_poscod", "pro_addres.add_poscod field needs 3 or more characters").isLength({ min: 3 }).optional(),
    check("pro_addres.add_poscod", "pro_addres.add_poscod field needs 10 or less characters").isLength({ max: 10 }).optional(),

    check("pro_addres.add_countr", "pro_addres.add_countr field must be a string").isString().optional(),
    check("pro_addres.add_countr", "pro_addres.add_countr field cannot be empty").not().isEmpty().optional(),
    check("pro_addres.add_countr", "pro_addres.add_countr field needs 3 or more characters").isLength({ min: 3 }).optional(),
    check("pro_addres.add_countr", "pro_addres.add_countr field needs 100 or less characters").isLength({ max: 100 }).optional(),

    check("pro_addres.add_state", "pro_addres.add_state field must be a string").isString().optional(),
    check("pro_addres.add_state", "pro_addres.add_state field cannot be empty").not().isEmpty().optional(),
    check("pro_addres.add_state", "pro_addres.add_state field needs 3 or more characters").isLength({ min: 3 }).optional(),
    check("pro_addres.add_state", "pro_addres.add_state field needs 100 or less characters").isLength({ max: 100 }).optional(),

    check("pro_addres.add_telcou", "pro_addres.add_telcou field must be a string").isString().optional(),
    check("pro_addres.add_telcou", "pro_addres.add_telcou field cannot be empty").not().isEmpty().optional(),
    check("pro_addres.add_telcou", "pro_addres.add_telcou field needs 2 or more characters").isLength({ min: 2 }).optional(),
    check("pro_addres.add_telcou", "pro_addres.add_telcou field needs 5 or less characters").isLength({ max: 5 }).optional(),

    check("pro_addres.add_teleph", "pro_addres.add_teleph field must be a string").isString().optional(),
    check("pro_addres.add_teleph", "pro_addres.add_teleph field cannot be empty").not().isEmpty().optional(),
    check("pro_addres.add_teleph", "pro_addres.add_teleph field needs at least 8").isLength({ min: 8 }).optional(),
    check("pro_addres.add_teleph", "pro_addres.add_teleph field needs 10 or less characters").isLength({ max: 10 }).optional(),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];


module.exports = {
    validateProfileStore,
    validateProfileUpdate
}