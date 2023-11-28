const User = require("../models/user.model");
const Entity = require("../models/entity.model");
const Admission = require("../models/admission.model");
const {admissionResource} = require("../resources/admission.resource");

/*

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
    adm_disdat: { type: Date },
    adm_compan: CompanionSchema,
    adm_calibr: CalibrationSchema,
    adm_sde: SocioDemographicSchema,
    adm_can: CaracteristicasAntropometricasSchema,
}, { timestamps: true });

const admissionResource = (data) => {
    return resource(data, (data) => {
        const result = {
            id: data._id,
            patient: data.patient,
            professional: data.professional,
            entity: data.entity,
            adm_admdat: data.adm_admdat,
            adm_disdat: data.adm_disdat,
            adm_compan: data.adm_compan,
            adm_calibr: data.adm_calibr,
            adm_sde: data.adm_sde,
            adm_can: data.adm_can,
        };
    });
}

*/

async function indexUserAdmissions(req, res) {
    const { userId } = req.params;
    const query = req.query;
    var search = {};
    
    if (query.active !== undefined) {
        if (query.active === "true") {
            search.adm_disdat = { $ne: null };
        } else if (query.active === "false") {
            search.adm_disdat = null;
        }
    }

    //Search always by the user id
    search.adm_patien = userId;
    Admission.find(search)
    .then((admissions) => {
        //For each admission find the entity, professional and patient data
        const promises = admissions.map(async (admission) => {
            const entity = await Entity.findById(admission.adm_entity);
            const professional = await User.findById(admission.adm_profes);
            const patient = await User.findById(admission.adm_patien);
            console.debug("patient", patient)
            return admissionResource({
                ...admission._doc,
                entity,
                professional,
                patient
            });
        });
        Promise.all(promises)
        .then((admissions) => {
            res.send({
                status: "ok",
                message: "Admission index success.",
                data: admissions
            });
        })
        .catch((err) => {
            res.status(500).send({
                status: "error",
                message: "Admission index failed. DB error."
            });
            console.debug(err);
        });
    })
    .catch((err) => {
        res.status(500).send({
            status: "error",
            message: "Admission index failed. DB error."
        });
        console.debug(err);
    });
};

async function indexProfessionalAdmissions(req, res) {
    const { entityId, profId } = req.params;
    const { active } = req.query;

    //active admissions means that the discharge date adm_disdat is null or undefined
    var search = {};
    search.adm_entity = entityId;
    search.adm_profes = profId;

    if (active !== undefined) {
        if (active === "true") {
            search.adm_disdat = null;
        } else if (active === "false") {
            search.adm_disdat = { $ne: null };
        }
    }

    Admission.find(search)
    .then((admissions) => {
        //For each admission find the entity, professional and patient data
        const promises = admissions.map(async (admission) => {
            const entity = await Entity.findById(admission.adm_entity);
            const professional = await User.findById(admission.adm_profes);
            const patient = await User.findById(admission.adm_patien);
            return admissionResource({
                ...admission._doc,
                entity,
                professional,
                patient
            });
        });
        Promise.all(promises)
        .then((admissions) => {
            res.send({
                status: "ok",
                message: "Admission index success.",
                data: admissions
            });
        })
        .catch((err) => {
            res.status(500).send({
                status: "error",
                message: "Admission index failed. DB error."
            });
            console.debug(err);
        });
    })
    .catch((err) => {
        res.status(500).send({
            status: "error",
            message: "Admission index failed. DB error."
        });
        console.debug(err);
    });
};


async function show(req, res) {
    const { admissionId } = req.params;

    Admission.findById(admissionId)
    .then(async (admission) => {
        const entity = await Entity.findById(admission.adm_entity);
        const professional = await User.findById(admission.adm_profes);
        const patient = await User.findById(admission.adm_patien);
        res.send({
            status: "ok",
            message: "Admission show success.",
            data: admissionResource({
                ...admission._doc,
                entity,
                professional,
                patient
            })
        });
    })
    .catch((err) => {
        res.status(500).send({
            status: "error",
            message: "Admission show failed. DB error."
        });
        console.debug(err);
    });
}

async function storeUserAdmission(req, res) {
    //Given a userId, an entityId and a professionalId, create an admission
    const { userId, entityId, professionalId } = req.params;
    const { 
        adm_admdat,
        adm_compan,
        adm_sde,
        adm_can
    } = req.body;
    
    Admission.create({
        adm_patien: userId,
        adm_profes: professionalId,
        adm_entity: entityId,
        adm_admdat,
        adm_compan,
        adm_sde,
        adm_can
    })
    .then((admission) => {
        res.send({
            status: "ok",
            message: "Admission store success.",
            data: admissionResource(admission)
        });
    })
    .catch((err) => {
        res.status(500).send({
            status: "error",
            message: "Admission store failed. DB error."
        });
        console.debug(err);
    });
};

async function update(req, res) {
    const params = req.params;
    
}

async function destroy(req, res) {
    const params = req.params;
}

module.exports = {
    storeUserAdmission,
    indexUserAdmissions,
    indexProfessionalAdmissions,
    show,
    update,
    destroy
}