const mongoose = require("mongoose");
const CalibrationSchema = require("./calibration.model");
const ProfileSchema = require("./profile.model");

const Genero = {
    male: "Masculino",
    female: "Femenino"
};

const EstadoCivil = {
    single: "Soltero",
    married: "Casado",
    widowed: "Viudo",
    divorced: "Divorciado",
    civilUnion: "Unión civil"
};

const NivelEducacion = {
    primComp: "Primaria completa",
    primInc: "Primaria incompleta",
    secComp: "Secundaria completa",
    secInc: "Secundaria incompleta",
    tecnologo: "Tecnólogo",
    tecnico: "Técnico",
    pregrado: "Pregrado",
    posgrado: "Posgrado",
    ninguno: "Ninguno"
};

const RegimenSeguridadSocial = {
    contributivo: "Contributivo",
    subsidiado: "Subsidiado",
    especial: "Especial",
    vinculado: "Vinculado",
    otro: "Otro",
    ninguno: "Ninguno"
};

const EstratoSocioeconomico = {
    uno: "1",
    dos: "2",
    tres: "3",
    cuatro: "4",
    cinco: "5",
    seis: "6"
};

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

const SocioDemographicSchema = mongoose.Schema({
    sde_sexo: { required: true, type: String, enum: Object.values(Genero)},
    sde_estciv: { required: true, type: String, enum: Object.values(EstadoCivil)},
    sde_nivedu: { required: true, type: String, enum: Object.values(NivelEducacion)},
    sde_regseg: { required: true, type: String, enum: Object.values(RegimenSeguridadSocial)},
    sde_eps: { required: true, type: String },
    sde_estrat: { required: true, type: String, enum: Object.values(EstratoSocioeconomico)},
}, { timestamps: false, _id : false  });

const CaracteristicasAntropometricasSchema = mongoose.Schema({
    can_estatu: { required: true, type: Number },
    can_peso: { required: true, type: Number },
    can_percin: { required: true, type: Number },
    can_peciri: { required: true, type: Boolean },
}, { timestamps: false, _id : false  });

const AdmissionSchema = mongoose.Schema({
    adm_patien: { required: true, type: mongoose.Schema.Types.ObjectId, ref: "User" },
    adm_profes: { required: true, type: mongoose.Schema.Types.ObjectId, ref: "User" },
    adm_entity: { required: true, type: mongoose.Schema.Types.ObjectId, ref: "Entity" },
    adm_admdat: { required: true, type: Date },
    adm_disdat: { type: Date, default: null },
    adm_compan: CompanionSchema,
    adm_calibr: CalibrationSchema,
    adm_sde: SocioDemographicSchema,
    adm_can: CaracteristicasAntropometricasSchema,
}, { timestamps: true });


module.exports = mongoose.model("Admission", AdmissionSchema);
module.exports.SocioDemographicSchema = SocioDemographicSchema;
module.exports.CaracteristicasAntropometricasSchema = CaracteristicasAntropometricasSchema;
module.exports.Genero = Genero;
module.exports.EstadoCivil = EstadoCivil;
module.exports.NivelEducacion = NivelEducacion;
module.exports.RegimenSeguridadSocial = RegimenSeguridadSocial;
module.exports.EstratoSocioeconomico = EstratoSocioeconomico;
module.exports.Parentesco = Parentesco;
module.exports.CompanionSchema = CompanionSchema;