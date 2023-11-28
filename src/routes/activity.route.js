const express = require("express");
const api = express.Router();

const multer = require("multer");
const storageLoc = 'uploads/games/';
const upload = multer({ dest: storageLoc });

const {
    store,
    getActivtyToken,
    show,
    index
} = require("../controllers/activity.controller");

const {
    storeScoreboard,
    retriveBestScore,
    indexScoreboard
} = require("../controllers/scoreboard.controller");

const {
    validateActivityStore,
    validateActivityToken,
    validateActivityShow,
    validateActivityIndex
} = require("../validators/activity.validator");

const {
    validateScoreboardStore,
    validateScoreboardBestScore
} = require("../validators/scoreboard.validator");

const { ensureAuth, ensureAuthActivity } = require("../middleware/user.auth");

api.post("/", upload.array('gallery'), ensureAuth, (req, res, next) => {
    try {
        if (req.body.act_platfo !== undefined) {
            req.body.act_platfo = JSON.parse(req.body.act_platfo);
        }
    } catch (err) {
        res.status(500).send({
            status: "error",
            message: "Activity store failed. Cannot parse platforms."
        });
        console.debug(err);
        return;
    }
    next();
}, validateActivityStore, store);

api.get("/:activityId/admissions/:admissionId/token", ensureAuth, validateActivityToken, getActivtyToken);
api.get("/:activityId", ensureAuth, validateActivityShow, show);
api.get("/", ensureAuth, validateActivityIndex, index);
api.get("/:activityId/admissions/:admissionId/bestscore", ensureAuth, validateScoreboardBestScore, retriveBestScore);
api.get("/:activityId/admissions/:admissionId/scoreboards", ensureAuth, validateScoreboardBestScore, indexScoreboard);

api.post("/:activityId/scoreboards", ensureAuthActivity, validateScoreboardStore, storeScoreboard);

module.exports = api;