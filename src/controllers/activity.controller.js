const Activity = require("../models/activity.model");
const Admission = require("../models/admission.model");
const {activityResource} = require("../resources/activity.resource");
const crypto = require('crypto');
const { createActivityToken, decodeToken } = require("../utils/jwt");

/*

const PlatformSchema = mongoose.Schema({
    pla_name: { required: true, type: String, enum: Object.values(Platforms) },
    pla_versio: { required: true, type: String },
    pla_archit: { required: true, type: String },
    pla_downlo: { required: true, type: String },
}, { timestamps: false, _id : false  });

const ActivitySchema = mongoose.Schema({
    act_phase: { required: true, type: Number },
    act_day: { required: true, type: Number },
    act_activi: { required: true, type: Number },
    act_name: { required: true, type: String },
    act_protoc: { required: true, type: String },
    act_descri: { required: true, type: String },
    act_author: { required: true, type: String },
    act_pubdat: { required: true, type: Date },
    act_datash: { required: true, type: String },
    act_platfo: [PlatformSchema],
    act_galler: [FileSchema],
    act_key: { required: true, type: String },
}, { timestamps: true });

*/

async function index(req, res) {
    const { phase, day } = req.query;
    var search = {};
    if (phase !== undefined) {
        search.act_phase = phase;
    }
    if (day !== undefined) {
        search.act_day = day;
    }
    Activity.find(search, "_id")
    .then((activities) => {
        res.status(200).send({
            status: "ok",
            data: activities.map((activity) => {
                return activityResource(activity);
            })
        });
    })
    .catch((err) => {
        res.status(500).send({
            status: "error",
            message: "Activity index failed."
        });
        console.debug(err);
    });
}

async function show(req, res) {
    const { activityId } = req.params;
    Activity.findOne({ _id: activityId })
    .then((activity) => {
        if (activity !== null) {
            res.status(200).send({
                status: "ok",
                data: activityResource(activity)
            });
        } else {
            res.status(404).send({
                status: "error",
                message: "Activity not found."
            });
        }
    })
    .catch((err) => {
        res.status(500).send({
            status: "error",
            message: "Activity show failed."
        });
        console.debug(err);
    });
}

async function store(req, res) {
    const {
        act_phase,
        act_day,
        act_activi,
        act_name,
        act_protoc,
        act_descri,
        act_author,
        act_pubdat,
        act_datash,
        act_platfo,
    } = req.body;

    //multer pictures
    if (req.files) {
        const act_galler = req.files.map((file) => {
            return {
                fil_filnam: file.filename,
                fil_path: file.path,
                fil_size: file.size,
                fil_mimtyp: file.mimetype
            };
        });

        const act_key = crypto.randomBytes(32).toString('base64');

        Activity.create({
            act_phase,
            act_day,
            act_activi,
            act_name,
            act_protoc,
            act_descri,
            act_author,
            act_pubdat,
            act_datash,
            act_platfo,
            act_galler,
            act_key
        })
        .then((activity) => {
            res.status(201).send({
                status: "ok",
                data: activityResource(activity)
            });
        })
        .catch((err) => {
            res.status(500).send({
                status: "error",
                message: "Activity store failed."
            });
            console.debug(err);
        });
    } else {
        res.status(400).send({
            status: "error",
            message: "Activity store failed. No gallery."
        });
    }
};


/*

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

*/
async function getActivtyToken(req, res) {
    const { activityId, admissionId } = req.params;
    const token = req.headers.authorization.replace(/['"]+/g, "");
    decodeToken(token)
    .then((payload) => {
        //Check role array has professional
        if (payload.role.includes("professional")) {
            console.log("activityId", activityId);
            Activity.findOne({ _id: activityId })
            .then((activity) => {
                if (activity !== null) {
                    //check if admission is active because adm_disdat is null
                    Admission.findOne({ _id: admissionId, adm_disdat: null })
                    .then((admission) => {
                        if (admission !== null) {
                            //check if admission is from professional
                            if (admission.adm_profes.toString() === payload.id) {
                                createActivityToken(activity.act_key, payload.id, activityId, admissionId)
                                .then((token) => {
                                    res.status(200).send({
                                        status: "ok",
                                        activityToken: token
                                    });
                                })
                                .catch((err) => {
                                    res.status(500).send({
                                        status: "error",
                                        message: "Activity admission token failed."
                                    });
                                    console.debug(err);
                                });
                            } else {
                                res.status(403).send({
                                    status: "error",
                                    message: "Not authorized"
                                });
                            }
                        } else {
                            res.status(404).send({
                                status: "error",
                                message: "Admission not found."
                            });
                        }
                    })
                    .catch((err) => {
                        res.status(500).send({
                            status: "error",
                            message: "Activity admission token failed."
                        });
                        console.debug(err);
                    });
                } else {
                    res.status(404).send({
                        status: "error",
                        message: "Activity not found."
                    });
                }
            })
            .catch((err) => {
                res.status(500).send({
                    status: "error",
                    message: "Activity admission token failed."
                });
                console.debug(err);
            });
        } else {
            res.status(403).send({
                status: "error",
                message: "Not authorized"
            });
        }
    })
    .catch((err) => {
        res.status(401).send({
            status: "error",
            message: "Unauthenticated"
        });
        console.debug(err);
    });
}

module.exports = {
    store,
    getActivtyToken,
    show,
    index
}