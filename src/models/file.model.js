const mongoose = require("mongoose");

const FileSchema = mongoose.Schema({
    fil_mimtyp: { required: true, type: String },
    fil_filnam: { required: true, type: String },
    fil_size: { required: true, type: Number },
    fil_path: { required: true, type: String }
}, { timestamps: false, _id : false });

module.exports = FileSchema;