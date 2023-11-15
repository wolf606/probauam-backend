const mongoose = require("mongoose");
const FileSchema = require("./file.model");

const PlatformSchema = mongoose.Schema({
    pla_name: { required: true, type: String, enum: ["Windows", "iPhone", "Android", "Mac"] },
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
    act_galler: [FileSchema],
}, { timestamps: true });

module.exports = mongoose.model("Activity", ActivitySchema);
module.exports.PlatformSchema = PlatformSchema;