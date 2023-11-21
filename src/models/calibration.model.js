const mongoose = require("mongoose");

const CalibrationSchema = mongoose.Schema({
    //Height standing
    cal_heista: { required: true, type: Number },
    //Heigh sitting
    cal_heisit: { required: true, type: Number },
    //Height standing on toes
    cal_hestto: { required: true, type: Number },
    cal_armlen: { required: true, type: Number },
    //Step length
    cal_stelen: { required: true, type: Number },
    //Neck rotation angle
    cal_necrot: { required: true, type: Number },
    //head position
    cal_phead: {
        xp: { required: true, type: Number },
        yp: { required: true, type: Number },
        zp: { required: true, type: Number },
    },
    //controller position
    cal_qcontr: {
        xq: { required: true, type: Number },
        yq: { required: true, type: Number },
        zq: { required: true, type: Number },
    },
    //shoulder position
    cal_rshoul: {
        xr: { required: true, type: Number },
        yr: { required: true, type: Number },
        zr: { required: true, type: Number },
    },
}, { timestamps: false, _id : false });

module.exports = CalibrationSchema;