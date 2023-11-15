const mongoose = require("mongoose");
const CompanionSchema = require("./companion.model");
const CalibrationSchema = require("./calibration.model");

const AdmissionSchema = mongoose.Schema({
    adm_patien: { required: true, type: mongoose.Schema.Types.ObjectId, ref: "User" },
    adm_profes: { required: true, type: mongoose.Schema.Types.ObjectId, ref: "User" },
    adm_entity: { required: true, type: mongoose.Schema.Types.ObjectId, ref: "Entity" },
    adm_admdat: { required: true, type: Date },
    adm_disdat: { type: Date },
    adm_compan: CompanionSchema,
    adm_calibr: CalibrationSchema
}, { timestamps: true });

module.exports = mongoose.model("Admission", AdmissionSchema);