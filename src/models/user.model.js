const mongoose = require("mongoose");
const ProfileSchema = require("./profile.model");

const Roles = {
    admin: "admin",
    manager: "manager",
    entAdmin: "entityAdmin",
    entManager: "entityManager",
    profess: "professional",
    patient: "patient",
    user: "user"
};

const UserSchema = mongoose.Schema({
    email: { required: true, type: String, unique: true },
    password: { required: true, type: String },
    active: { type: Boolean, default: false },
    role: { required: true, type: [String], enum: Object.values(Roles) },
    profile: ProfileSchema,
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
module.exports.Roles = Roles;