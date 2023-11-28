const Scoreboard = require("../models/scoreboard.model");
const { scoreboardResource } = require("../resources/scoreboard.resource");

/*

const F2D1A3Schema = mongoose.Schema({
    sco_lifes: { required: true, type: Number },
    sco_flies: { required: true, type: Number },
}, { timestamps: false, _id : false });

const ActivityResumeSchemas = {
    F2D1A3 : F2D1A3Schema,
}

const ScoreboardSchema = mongoose.Schema({
    admiss_id: { required: true, type: mongoose.Schema.Types.ObjectId, ref: "Admission" },
    activi_id : { required: true, type: mongoose.Schema.Types.ObjectId, ref: "Activity" },
    sco_start: { required: true, type: Date },
    sco_end: { required: true, type: Date },
    sco_score: { required: true, type: Number },
    sco_win: { required: true, type: Boolean },
    sco_resume: { required: true, type: Object },
}, { timestamps: true });

*/

async function storeScoreboard(req, res) {
    const {
        userId,
        activityId,
        admissionId
    } = req.scoreboard;

    const {
        sco_start,
        sco_end,
        sco_score,
        sco_win,
        sco_resume
    } = req.body;

    if (req.params.activityId !== activityId) {
        res.status(401).send({
            status: "error",
            message: "Token is not associated to activity."
        });
    } else {
        Scoreboard.create({
            admiss_id: admissionId,
            activi_id: activityId,
            sco_start: sco_start,
            sco_end: sco_end,
            sco_score: sco_score,
            sco_win: sco_win,
            sco_resume: sco_resume
        })
        .then((scoreboard) => {
            res.status(201).send({
                status: "ok",
                data: scoreboardResource(scoreboard)
            });
        })
        .catch((err) => {
            res.status(500).send({
                status: "error",
                message: "Scoreboard store failed."
            });
            console.debug(err);
        });
    }
};

async function indexScoreboard(req, res) {
    const { activityId, admissionId } = req.params;
    //given activityId and admissionId, sort all scoreboards by sco_start
    Scoreboard.find({
        activi_id: activityId,
        admiss_id: admissionId
    })
    .sort({ sco_start: -1 })
    .then((scoreboards) => {
        res.status(200).send({
            status: "ok",
            data: scoreboardResource(scoreboards)
        });
    })
    .catch((err) => {
        res.status(500).send({
            status: "error",
            message: "Scoreboard index failed."
        });
        console.debug(err);
    });
}

async function retriveBestScore(req, res) {
    const { activityId, admissionId } = req.params;
    //given activityId and admissionId, find the best score
    Scoreboard.find({
        activi_id: activityId,
        admiss_id: admissionId
    })
    .sort({ sco_score: -1 })
    .limit(1)
    .then((scoreboard) => {
        if (scoreboard.length > 0) {
            res.status(200).send({
                status: "ok",
                data: scoreboardResource(scoreboard[0])
            });
        } else {
            res.status(200).send({
                status: "ok",
                data: null
            });
        }
    })
    .catch((err) => {
        res.status(500).send({
            status: "error",
            message: "Scoreboard retrive failed."
        });
        console.debug(err);
    });
}

module.exports = {
    storeScoreboard,
    retriveBestScore,
    indexScoreboard
}