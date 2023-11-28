const { check, validationResult } = require("express-validator");
const Activity = require("../models/activity.model");
const Admission = require("../models/admission.model");

const validateScoreboardStore = [

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

    check("sco_start", "sco_start field must be a valid date").isISO8601().toDate().withMessage("Invalid date format"),
    check("sco_end", "sco_end field must be a valid date").isISO8601().toDate().withMessage("Invalid date format"),
    //Check that sco_end is after sco_start
    check("sco_end").custom(
        (value, { req, loc, path }) => {
            //Remember that sco_start is a string with a date
            // "2023-11-26T00:00:00.000Z"
            // and we need to convert it to a date object
            const sco_start = new Date(req.body.sco_start);
            const sco_end = new Date(req.body.sco_end);

            if (sco_end <= sco_start) {
                throw new Error("sco_end must be after sco_start");
            } else {
                return true;
            }
        }
    ),

    check("sco_score", "sco_score field must be a valid number").isNumeric(),

    check("sco_win", "sco_win field must be a valid boolean").isBoolean(),

    check("sco_resume", "sco_resume field must be a valid object").isObject(),

    check("sco_resume").custom(
        async (value, { req, loc, path }) => {
            try {
                const activity = await Activity.findOne({ _id: req.params.activityId });
                const codeStr = "F" + activity.act_phase + "D" + activity.act_day + "A" + activity.act_activi;

                if (codeStr === "F2D1A3") {
                    //Check if sco_resume has sco_lifes and is numeric
                    if (req.body.sco_resume.sco_lifes === undefined) {
                        return Promise.reject("the field sco_lifes is required");
                    } else if (!Number.isInteger(req.body.sco_resume.sco_lifes)) {
                        return Promise.reject("sco_lifes must be a number");
                    } else if (req.body.sco_resume.sco_lifes < -1) {
                        return Promise.reject("sco_lifes must be a positive number");
                    }

                    //Check if sco_resume has sco_flies and is numeric
                    if (req.body.sco_resume.sco_flies === undefined) {
                        return Promise.reject("the field sco_flies is required");
                    } else if (!Number.isInteger(req.body.sco_resume.sco_flies)) {
                        return Promise.reject("sco_flies must be a number");
                    } else if (req.body.sco_resume.sco_flies < 0) {
                        return Promise.reject("sco_flies must be a positive number");
                    }
                } else {
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

const validateScoreboardBestScore = [

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

module.exports = {
    validateScoreboardStore,
    validateScoreboardBestScore
}