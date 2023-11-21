const mongoose = require("mongoose");

const AddressSchema = mongoose.Schema({
    add_addres: { required: true, type: String },
    add_city: { required: true, type: String },
    add_poscod: { type: String },
    add_countr: { required: true, type: String },
    add_state: { required: true, type: String },
    add_telcou: { type: String },
    add_teleph: { type: String }
}, { timestamps: false, _id : false });

module.exports = AddressSchema;