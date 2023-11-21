const mongoose = require("mongoose");

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

module.exports = mongoose.model("Scoreboard", ScoreboardSchema);
module.exports.ActivityResumeSchemas = ActivityResumeSchemas;