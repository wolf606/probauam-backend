const mongoose = require("mongoose");
const FileSchema = require("./file.model");

const Platforms = {
    windows: "Windows",
    iphone: "iPhone",
    android: "Android",
    mac: "Mac"
};

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
    act_galler: [FileSchema],
    act_key: { required: true, type: String },
}, { timestamps: true });

module.exports = mongoose.model("Activity", ActivitySchema);
module.exports.PlatformSchema = PlatformSchema;
module.exports.Platforms = Platforms;