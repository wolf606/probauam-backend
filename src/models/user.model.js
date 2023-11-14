const mongoose = require("mongoose");

const Roles = {
    admin: "admin",
    instit: "institution",
    profes: "professional",
    patien: "patient",
    user: "user"
};

const UserSchema = mongoose.Schema({
    email: { required: true, type: String, unique: true },
    password: { required: true, type: String },
    active: { type: Boolean, default: false },
    role: { required: true, type: String, enum: Object.values(Roles) },
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
module.exports.Roles = Roles;