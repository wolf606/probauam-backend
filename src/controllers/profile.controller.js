const User = require("../models/user.model");
const { userResource } = require("../resources/user.resource");

async function store(req, res) {
    const {  
        pro_nombre,
        pro_apelli,
        pro_tipide,
        pro_numide,
        pro_fecnac,
        pro_celpai,
        pro_celula,
        pro_addres,
    } = req.body;
    
    dict = {
        pro_nombre,
        pro_apelli,
        pro_tipide,
        pro_numide,
        pro_celpai,
        pro_celula
    };

    if (pro_fecnac !== undefined) dict.pro_fecnac = pro_fecnac;
    if (pro_addres !== undefined) dict.pro_addres = pro_addres;
    console.log("fucking req file",req.file);
    if (req.file) {
        const filePic = req.file;
        const avatar = {
            fil_mimtyp: filePic.mimetype,
            fil_filnam: filePic.filename,
            fil_size: filePic.size,
            fil_path: filePic.path
        };
        dict.pro_avatar = avatar;
    }

    const params = req.params;
    User.findByIdAndUpdate({ _id: params.id }, { profile: dict }, { new: true })
    .then((user) => {
        if (user === null) {
            res.status(404).send({
                status: "error",
                message: "User not found. Cannot create profile."
            });
        } else {
            res.status(200).send({
                status: "ok",
                data: userResource(user)
            });
        }
    })
};

async function update(req, res) {
    dict = {};
    const body = req.body;
    if (body.pro_nombre !== undefined) dict.pro_nombre = body.pro_nombre;
    if (body.pro_apelli !== undefined) dict.pro_apelli = body.pro_apelli;
    if (body.pro_tipide !== undefined) dict.pro_tipide = body.pro_tipide;
    if (body.pro_numide !== undefined) dict.pro_numide = body.pro_numide;
    if (body.pro_fecnac !== undefined) dict.pro_fecnac = body.pro_fecnac;
    if (body.pro_celpai !== undefined) dict.pro_celpai = body.pro_celpai;
    if (body.pro_celula !== undefined) dict.pro_celula = body.pro_celula;
    if (body.pro_addres !== undefined) dict.pro_addres = body.pro_addres;
    if (req.file) {
        const filePic = req.file;
        const avatar = {
            fil_mimtyp: filePic.mimetype,
            fil_filnam: filePic.filename,
            fil_size: filePic.size,
            fil_path: filePic.path
        };
        dict.pro_avatar = avatar;
    }

    User.findOne({ _id: req.params.id }, { profile: 1 })
    .then((user) => {
        if (user === null) {
            res.status(404).send({
                status: "error",
                message: "User not found. Cannot edit profile."
            });
        } else {
            if (user.profile !== undefined) {
                if (dict.pro_nombre === undefined) dict.pro_nombre = user.profile.pro_nombre;
                if (dict.pro_apelli === undefined) dict.pro_apelli = user.profile.pro_apelli;
                if (dict.pro_tipide === undefined) dict.pro_tipide = user.profile.pro_tipide;
                if (dict.pro_numide === undefined) dict.pro_numide = user.profile.pro_numide;
                if (dict.pro_fecnac === undefined) dict.pro_fecnac = user.profile.pro_fecnac;
                if (dict.pro_celpai === undefined) dict.pro_celpai = user.profile.pro_celpai;
                if (dict.pro_celula === undefined) dict.pro_celula = user.profile.pro_celula;

                if (user.profile.pro_addres !== undefined) {
                    const userAddres = user.profile.pro_addres;
                    if (dict.pro_addres !== undefined) {
                        if (dict.pro_addres.add_addres === undefined) dict.pro_addres.add_addres = userAddres.add_addres;
                        if (dict.pro_addres.add_city === undefined) dict.pro_addres.add_city = userAddres.add_city;
                        if (dict.pro_addres.add_poscod === undefined) dict.pro_addres.add_poscod = userAddres.add_poscod;
                        if (dict.pro_addres.add_countr === undefined) dict.pro_addres.add_countr = userAddres.add_countr;
                        if (dict.pro_addres.add_state === undefined) dict.pro_addres.add_state = userAddres.add_state;
                        if (dict.pro_addres.add_telcou === undefined) dict.pro_addres.add_telcou = userAddres.add_telcou;
                        if (dict.pro_addres.add_teleph === undefined) dict.pro_addres.add_teleph = userAddres.add_teleph;
                    } else {
                        dict.pro_addres = userAddres;
                    }
                    
                }

                const params = req.params;
                User.findByIdAndUpdate({ _id: params.id }, { profile: dict }, { new: true })
                .then((user) => {
                    if (user === null) {
                        res.status(404).send({
                            status: "error",
                            message: "User not found. Cannot edit profile."
                        });
                    } else {
                        res.status(200).send({
                            status: "ok",
                            data: userResource(user)
                        });
                    }
                })
            } else {
                res.status(404).send({
                    status: "error",
                    message: "User has no profile. Cannot edit profile."
                });
            }
        }
    })
}

module.exports = {
    store,
    update
}