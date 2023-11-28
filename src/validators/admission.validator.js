const { check, validationResult } = require("express-validator");
const User = require("../models/user.model");
const Entity = require("../models/entity.model");
const Admission = require("../models/admission.model");
const { 
    Genero,
    EstadoCivil,
    NivelEducacion,
    RegimenSeguridadSocial,
    EstratoSocioeconomico,
    Parentesco
} = require("../models/admission.model");
const ProfileSchema = require("../models/profile.model");

const validateUserIndexAdmissions = [
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

    //Check query params
    check("active").optional().isBoolean(),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateUserStoreAdmissions = [
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

    //Check entityId param
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

    //Check professionalId param
    check("professionalId", "professionalId field must be a valid ObjectId").isMongoId(),
    //Check if professional exists
    check("professionalId").custom(
        async (value, { req, loc, path }) => {
            try {
                const professional = await User.exists({ _id: req.params.professionalId })
                if (professional == null) {
                    return Promise.reject("professionalId is not registered");
                }
            } catch (error) {
                // Handle the error
                console.error("An error occurred:", error);
                // You can choose to return a rejection or handle the error differently
                return Promise.reject("DB error");
            }
        }
    ),

    //Check body params
    check("adm_admdat", "adm_admdat field must be a valid date").isISO8601().toDate()
    .withMessage("Invalid day received"),

    //Check body params
    check("adm_compan").isObject(),
    check("adm_compan.com_profil").isObject(),
    check("adm_compan.com_profil.pro_nombre", "pro_nombre field must be a string").isString(),
    check("adm_compan.com_profil.pro_nombre", "pro_nombre field cannot be empty").not().isEmpty(),
    check("adm_compan.com_profil.pro_nombre", "pro_nombre field needs 3 or more characters").isLength({ min: 3 }),

    check("adm_compan.com_profil.pro_apelli", "pro_apelli field must be a string").isString(),
    check("adm_compan.com_profil.pro_apelli", "pro_apelli field cannot be empty").not().isEmpty(),
    check("adm_compan.com_profil.pro_apelli", "pro_apelli field needs 3 or more characters").isLength({ min: 3 }),

    check("adm_compan.com_profil.pro_tipide", "pro_tipide field must be a string").isString(),
    check("adm_compan.com_profil.pro_tipide", "pro_tipide field cannot be empty").not().isEmpty(),
    check("adm_compan.com_profil.pro_tipide", "pro_tipide field has no valid value.").isIn(Object.values(ProfileSchema.TipoIdentificacion)),

    check("adm_compan.com_profil.pro_numide", "pro_numide field must be a string").isString(),
    check("adm_compan.com_profil.pro_numide", "pro_numide field cannot be empty").not().isEmpty(),
    check("adm_compan.com_profil.pro_numide", "pro_numide field needs 3 or more characters").isLength({ min: 3 }),
    check("adm_compan.com_profil.pro_numide", "pro_numide field needs 16 or less characters").isLength({ max: 16 }),

    check("adm_compan.com_profil.pro_celpai", "pro_celpai field must be a string").isString(),
    check("adm_compan.com_profil.pro_celpai", "pro_celpai field cannot be empty").not().isEmpty(),
    check("adm_compan.com_profil.pro_celpai", "pro_celpai field needs 2 or more characters").isLength({ min: 2 }),
    check("adm_compan.com_profil.pro_celpai", "pro_celpai field needs 5 or less characters").isLength({ max: 5 }),

    check("adm_compan.com_profil.pro_celula", "pro_celula field must be a string").isString(),
    check("adm_compan.com_profil.pro_celula", "pro_celula field cannot be empty").not().isEmpty(),
    check("adm_compan.com_profil.pro_celula", "pro_celula field needs 10 characters").isLength({ min: 10, max: 10 }),

    check("adm_compan.com_profil.pro_addres").isObject(),
    check("adm_compan.com_profil.pro_addres.add_addres", "pro_addres.add_addres field must be a string").isString(),
    check("adm_compan.com_profil.pro_addres.add_addres", "pro_addres.add_addres field cannot be empty").not().isEmpty(),
    check("adm_compan.com_profil.pro_addres.add_addres", "pro_addres.add_addres field needs 3 or more characters").isLength({ min: 3 }),
    check("adm_compan.com_profil.pro_addres.add_addres", "pro_addres.add_addres field needs 100 or less characters").isLength({ max: 100 }),

    check("adm_compan.com_profil.pro_addres.add_city", "pro_addres.add_city field must be a string").isString(),
    check("adm_compan.com_profil.pro_addres.add_city", "pro_addres.add_city field cannot be empty").not().isEmpty(),
    check("adm_compan.com_profil.pro_addres.add_city", "pro_addres.add_city field needs 3 or more characters").isLength({ min: 3 }),
    check("adm_compan.com_profil.pro_addres.add_city", "pro_addres.add_city field needs 100 or less characters").isLength({ max: 100 }),

    check("adm_compan.com_profil.pro_addres.add_poscod", "pro_addres.add_poscod field must be a string").isString(),
    check("adm_compan.com_profil.pro_addres.add_poscod", "pro_addres.add_poscod field cannot be empty").not().isEmpty(),
    check("adm_compan.com_profil.pro_addres.add_poscod", "pro_addres.add_poscod field needs 3 or more characters").isLength({ min: 3 }),
    check("adm_compan.com_profil.pro_addres.add_poscod", "pro_addres.add_poscod field needs 10 or less characters").isLength({ max: 10 }),

    check("adm_compan.com_profil.pro_addres.add_countr", "pro_addres.add_countr field must be a string").isString(),
    check("adm_compan.com_profil.pro_addres.add_countr", "pro_addres.add_countr field cannot be empty").not().isEmpty(),
    check("adm_compan.com_profil.pro_addres.add_countr", "pro_addres.add_countr field needs 3 or more characters").isLength({ min: 3 }),
    check("adm_compan.com_profil.pro_addres.add_countr", "pro_addres.add_countr field needs 100 or less characters").isLength({ max: 100 }),

    check("adm_compan.com_profil.pro_addres.add_state", "pro_addres.add_state field must be a string").isString(),
    check("adm_compan.com_profil.pro_addres.add_state", "pro_addres.add_state field cannot be empty").not().isEmpty(),
    check("adm_compan.com_profil.pro_addres.add_state", "pro_addres.add_state field needs 3 or more characters").isLength({ min: 3 }),
    check("adm_compan.com_profil.pro_addres.add_state", "pro_addres.add_state field needs 100 or less characters").isLength({ max: 100 }),

    check("adm_compan.com_profil.pro_addres.add_telcou", "pro_addres.add_telcou field must be a string").isString(),
    check("adm_compan.com_profil.pro_addres.add_telcou", "pro_addres.add_telcou field cannot be empty").not().isEmpty(),
    check("adm_compan.com_profil.pro_addres.add_telcou", "pro_addres.add_telcou field needs 2 or more characters").isLength({ min: 2 }),
    check("adm_compan.com_profil.pro_addres.add_telcou", "pro_addres.add_telcou field needs 5 or less characters").isLength({ max: 5 }),

    check("adm_compan.com_profil.pro_addres.add_teleph", "pro_addres.add_teleph field must be a string").isString(),
    check("adm_compan.com_profil.pro_addres.add_teleph", "pro_addres.add_teleph field cannot be empty").not().isEmpty(),
    check("adm_compan.com_profil.pro_addres.add_teleph", "pro_addres.add_teleph field needs at least 8").isLength({ min: 8 }),
    check("adm_compan.com_profil.pro_addres.add_teleph", "pro_addres.add_teleph field needs 10 or less characters").isLength({ max: 10 }),

    check("adm_compan.com_parent", "com_parent field must be a string").isString(),
    check("adm_compan.com_parent", "com_parent field cannot be empty").not().isEmpty(),
    check("adm_compan.com_parent", "com_parent field has no valid value.").isIn(Object.values(Parentesco)),

    check("adm_sde").isObject(),
    check("adm_sde.sde_sexo", "sde_sexo field must be a string").isString(),
    check("adm_sde.sde_sexo", "sde_sexo field cannot be empty").not().isEmpty(),
    check("adm_sde.sde_sexo", "sde_sexo field has no valid value.").isIn(Object.values(Genero)),
    check("adm_sde.sde_estciv", "sde_estciv field must be a string").isString(),
    check("adm_sde.sde_estciv", "sde_estciv field cannot be empty").not().isEmpty(),
    check("adm_sde.sde_estciv", "sde_estciv field has no valid value.").isIn(Object.values(EstadoCivil)),
    check("adm_sde.sde_nivedu", "sde_nivedu field must be a string").isString(),
    check("adm_sde.sde_nivedu", "sde_nivedu field cannot be empty").not().isEmpty(),
    check("adm_sde.sde_nivedu", "sde_nivedu field has no valid value.").isIn(Object.values(NivelEducacion)),
    check("adm_sde.sde_regseg", "sde_regseg field must be a string").isString(),
    check("adm_sde.sde_regseg", "sde_regseg field cannot be empty").not().isEmpty(),
    check("adm_sde.sde_regseg", "sde_regseg field has no valid value.").isIn(Object.values(RegimenSeguridadSocial)),
    check("adm_sde.sde_eps", "sde_eps field must be a string").isString(),
    check("adm_sde.sde_eps", "sde_eps field cannot be empty").not().isEmpty(),
    check("adm_sde.sde_estrat", "sde_estrat field must be a string").isString(),
    check("adm_sde.sde_estrat", "sde_estrat field cannot be empty").not().isEmpty(),
    check("adm_sde.sde_estrat", "sde_estrat field has no valid value.").isIn(Object.values(EstratoSocioeconomico)),
    check("adm_can").isObject(),
    check("adm_can.can_estatu", "can_estatu field must be a number").isNumeric(),
    check("adm_can.can_estatu", "can_estatu field cannot be empty").not().isEmpty(),
    check("adm_can.can_peso", "can_peso field must be a number").isNumeric(),
    check("adm_can.can_peso", "can_peso field cannot be empty").not().isEmpty(),
    check("adm_can.can_percin", "can_percin field must be a number").isNumeric(),
    check("adm_can.can_percin", "can_percin field cannot be empty").not().isEmpty(),
    check("adm_can.can_peciri", "can_peciri field must be a boolean").isBoolean(),
    check("adm_can.can_peciri", "can_peciri field cannot be empty").not().isEmpty(),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateShowAdmission = [
    check("admissionId", "admissionId field must be a valid ObjectId").isMongoId(),
    //Check if admission exists
    check("admissionId").custom(
        async (value, { req, loc, path }) => {
            try {
                const admission = await Admission.exists({ _id: req.params.admissionId })
                if (admission == null) {
                    return Promise.reject("admissionId is not registered");
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
    validateUserIndexAdmissions,
    validateUserStoreAdmissions,
    validateShowAdmission
}