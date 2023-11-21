const mongoose = require("mongoose");
const AddressSchema = require("./address.model");
const FileSchema = require("./file.model");

const EntitySchema = mongoose.Schema({
    ent_nombre: { required: true, type: String },
    ent_direcc: AddressSchema,
    ent_celpai: { required: true, type: String },
    ent_celula: { required: true, type: String },
    ent_avatar: FileSchema,
}, { timestamps: true });

module.exports = mongoose.model("Entity", EntitySchema);