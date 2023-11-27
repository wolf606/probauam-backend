const Activity = require("../models/activity.model");
const {activityResource} = require("../resources/activity.resource");
const crypto = require('crypto');

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

module.exports = {
    store
}