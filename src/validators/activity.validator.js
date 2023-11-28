const { check, validationResult } = require("express-validator");
const Activity = require("../models/activity.model");
const Admission = require("../models/admission.model");

/*

const PlatformSchema = mongoose.Schema({
    pla_name: { required: true, type: String, enum: Object.values(Platforms) },
    pla_versio: { required: true, type: String },
    pla_archit: { required: true, type: String },
    pla_downlo: { required: true, type: String },
}, { timestamps: false, _id : false  });

const ActivitySchema = mongoose.Schema({
    act_phase: { required: true, type: Number },
    act_day: { required: true, type: Number },
    act_activi: { required: true, type: Number },
    act_name: { required: true, type: String },
    act_protoc: { required: true, type: String },
    act_descri: { required: true, type: String },
    act_author: { required: true, type: String },
    act_pubdat: { required: true, type: Date },
    act_datash: { required: true, type: String },
    act_platfo: [PlatformSchema],
}, { timestamps: true });

*/

const validateActivityStore = [

    check("act_phase").exists(),
    check("act_phase").isNumeric(),
    check("act_phase").isInt({ min: 1, max: 3 }),

    check("act_day").exists(),
    check("act_day").isNumeric(),
    check("act_day").isInt({ min: 1, max: 6 }),

    check("act_activi").exists(),
    check("act_activi").isNumeric(),
    check("act_activi").isInt({ min: 1, max: 12 }),

    check("act_name").exists(),
    check("act_name").isString(),
    check("act_name").isLength({ min: 3, max: 125 }),

    check("act_protoc").exists(),
    check("act_protoc").isString(),
    check("act_protoc").isLength({ min: 3, max: 4096 }),

    check("act_descri").exists(),
    check("act_descri").isString(),
    check("act_descri").isLength({ min: 3, max: 4096 }),

    check("act_author").exists(),
    check("act_author").isString(),
    check("act_author").isLength({ min: 3, max: 125 }),

    check("act_pubdat").exists().isISO8601().toDate().withMessage("Invalid date format"),

    check("act_datash").exists(),
    check("act_datash").isString(),

    check("act_platfo").exists(),
    check("act_platfo").isArray(),

    check("act_platfo.*.pla_name").exists(),
    check("act_platfo.*.pla_name").isString(),
    check("act_platfo.*.pla_name").isLength({ min: 3, max: 125 }),
    check("act_platfo.*.pla_name").isIn(Object.values(Activity.Platforms)),

    check("act_platfo.*.pla_versio").exists(),
    check("act_platfo.*.pla_versio").isString(),
    check("act_platfo.*.pla_versio").isLength({ min: 3, max: 256 }),
    
    check("act_platfo.*.pla_archit").exists(),
    check("act_platfo.*.pla_archit").isString(),
    check("act_platfo.*.pla_archit").isLength({ min: 3, max: 32 }),

    check("act_platfo.*.pla_downlo").exists(),
    check("act_platfo.*.pla_downlo").isString(),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateActivityToken = [

    check("activityId", "activityId field must be a valid ObjectId").isMongoId(),
    //Check if activity exists
    check("activityId").custom(
        async (value, { req, loc, path }) => {
            try {
                const activity = await Activity.exists({ _id: req.params.activityId })
                if (activity == null) {
                    return Promise.reject("activityId is not registered");
                }
            } catch (error) {
                // Handle the error
                console.error("An error occurred:", error);
                // You can choose to return a rejection or handle the error differently
                return Promise.reject("DB error");
            }
        }
    ),

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

const validateActivityShow = [

    check("activityId", "activityId field must be a valid ObjectId").isMongoId(),
    //Check if activity exists
    check("activityId").custom(
        async (value, { req, loc, path }) => {
            try {
                const activity = await Activity.exists({ _id: req.params.activityId })
                if (activity == null) {
                    return Promise.reject("activityId is not registered");
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

const validateActivityIndex = [

    //Check query phase is valid
    check("phase").exists().optional(),
    check("phase").isNumeric().optional(),
    check("phase").isInt({ min: 1, max: 3 }).optional(),

    //Check query day is valid
    check("day").exists().optional(),
    check("day").isNumeric().optional(),
    check("day").isInt({ min: 1, max: 6 }).optional(),


    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateActivityStore,
    validateActivityToken,
    validateActivityShow,
    validateActivityIndex
}