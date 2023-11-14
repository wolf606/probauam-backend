const mongoose = require("mongoose");

const UserTokenSchema = mongoose.Schema({
    user_ObjectId: { required: true, type: mongoose.Schema.Types.ObjectId, ref: "User" },
    token: { required: true, type: String },
}, { timestamps: true });

module.exports = mongoose.model("UserToken", UserTokenSchema);