const mongoose = require("mongoose");

const Cargo = {
    admin: "admin",
    manager: "manager",
    employee: "employee",
}

const EntityUserSchema = mongoose.Schema({
    entity_id: { required: true, type: mongoose.Schema.Types.ObjectId, ref: "Entity" },
    user_id: { required: true, type: mongoose.Schema.Types.ObjectId, ref: "User" },
    enu_active: { type: Boolean, default: true },
    enu_cargo: { required: true, type: [String], enum: Object.values(Cargo) },
}, { timestamps: true });

module.exports = mongoose.model("EntityUser", EntityUserSchema);
module.exports.Cargo = Cargo;