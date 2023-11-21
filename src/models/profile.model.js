const mongoose = require("mongoose");
const AddressSchema = require("./address.model");
const FileSchema = require("./file.model");

const TipoIdentificacion = {
    dni: "Documento Nacional de Identidad",
    pasaporte: "Pasaporte",
    residencia: "Tarjeta de Residencia",
    licencia: "Licencia de Conducir",
    segsocial: "Seguridad Social"
};

const ProfileSchema = mongoose.Schema({
    pro_nombre: { required: true, type: String },
    pro_apelli: { required: true, type: String },
    pro_tipide: { required: true, type: String, enum: Object.values(TipoIdentificacion) },
    pro_numide: { required: true, type: String },
    pro_fecnac: { type: Date },
    pro_celpai: { required: true, type: String },
    pro_celula: { required: true, type: String },
    pro_avatar: FileSchema,
    pro_addres: AddressSchema
}, { timestamps: false, _id : false });

module.exports = ProfileSchema
module.exports.TipoIdentificacion = TipoIdentificacion;