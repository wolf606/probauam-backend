const { resource } = require("./resource");
const { pictureResource } = require("./picture.resource");

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
    act_galler: [FileSchema]
}, { timestamps: true });

*/

const activityResource = (data) => {
    return resource(data, (data) => {
        const result = {
            id: data._id,
            act_phase: data.act_phase,
            act_day: data.act_day,
            act_activi: data.act_activi,
            act_name: data.act_name,
            act_protoc: data.act_protoc,
            act_descri: data.act_descri,
            act_author: data.act_author,
            act_pubdat: data.act_pubdat,
            act_datash: data.act_datash,
        };

        if (data.act_platfo) {
            result.act_platfo = data.act_platfo;
        }

        if (data.act_galler) {
            result.act_galler = data.act_galler.map((picture) => {
                const url = pictureResource(picture);
                if (url) {
                    return url;
                }
            });
        }

        result.createdAt = data.createdAt;
        result.updatedAt = data.updatedAt;
        return result;
    });
}

module.exports = { activityResource };