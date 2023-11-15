const mongoose = require("mongoose");
const ProfileSchema = require("./profile.model");

const Parentesco = {
    conyuge: "Conyuge",
    padre: "Padre",
    madre: "Madre",
    hijo: "Hijo",
    hermano: "Hermano",
    tio: "Tio",
    sobrino: "Sobrino",
    primo: "Primo",
    nieto: "Nieto",
    cuñado: "Cuñado",
    suegro: "Suegro",
    yerno: "Yerno",
    nuera: "Nuera",
    abuelo: "Abuelo",
    nieto: "Nieto",
    otro: "Otro"
};

const CompanionSchema = mongoose.Schema({
    com_profil: ProfileSchema,
    com_parent: { required: true, type: String, enum: Object.values(Parentesco) },
}, { timestamps: false, _id : false });

module.exports = CompanionSchema;
module.exports.Parentesco = Parentesco;