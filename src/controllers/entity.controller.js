const User = require("../models/user.model");
const Entity = require("../models/entity.model");
const EntityUser = require("../models/entity-user.model");
const { entityResource } = require("../resources/entity.resource");
const { userResource } = require("../resources/user.resource");

async function index(req, res) {
    const { entityId } = req.params;
    const query = req.query;

    search = {
        entity_id: entityId
    };
    if (query.cargo !== undefined) search.enu_cargo = query.cargo;
    if (query.active !== undefined) search.enu_active = query.active;

    EntityUser.find(search)
    .then((entityUsers) => {
        if (entityUsers === null) {
            res.status(404).send({
                status: "error",
                message: "No users related to entity."
            });
        } else {
            User.find({ _id: entityUsers.map((entityUser) => entityUser.user_id) })
            .then((users) => {
                res.status(200).send({
                    status: "ok",
                    data: users.map((user) => {
                        var entityUser = null;
                        for (let i = 0; i < entityUsers.length; i++) {
                            if (entityUsers[i].user_id.toString() === user._id.toString()) {
                                entityUser = entityUsers[i];
                                break;
                            }
                        }
                        if (entityUser === null) {
                            return {
                                ...userResource(user),
                                entity_user: null
                            };
                        }
                        return {
                            ...userResource(user),
                            entity_user: {
                                enu_cargo: entityUser.enu_cargo,
                                enu_active: entityUser.enu_active
                            }
                        };
                    })
                });
            })
        }
    })
    .catch((err) => {
        res.status(500).send({
            status: "error",
            message: "EntityUser index failed. DB error."
        });
        console.debug(err);
    });
}

async function show(req, res) {
    const { userId } = req.params;
    EntityUser.findOne({ user_id: userId, enu_cargo: EntityUser.Cargo.admin })
    .then((entityUser) => {
        if (entityUser === null) {
            res.status(404).send({
                status: "error",
                message: "No entity related to user."
            });
        } else {
            Entity.findOne({ _id: entityUser.entity_id })
            .then((entity) => {
                res.status(200).send({
                    status: "ok",
                    data: entityResource(entity)
                });
            })
            .catch((err) => {
                res.status(500).send({
                    status: "error",
                    message: "Entity show failed. DB error."
                });
                console.debug(err);
            });
        }
    });
}

async function store(req, res) {
    const { userId } = req.params;
    const {
        ent_nombre,
        ent_direcc,
        ent_celpai,
        ent_celula
    } = req.body;

    if (req.file) {
        const filePic = req.file;
        const avatar = {
            fil_mimtyp: filePic.mimetype,
            fil_filnam: filePic.filename,
            fil_size: filePic.size,
            fil_path: filePic.path
        };
        ent_avatar = avatar;

        Entity.create({
            ent_nombre,
            ent_direcc,
            ent_celpai,
            ent_celula,
            ent_avatar
        })
        .then((entity) => {
            EntityUser.create({
                entity_id: entity._id,
                user_id: userId,
                enu_cargo: [EntityUser.Cargo.admin]
            })
            .then((entityUser) => {
                console.debug("entityUser created: ", entityUser);
                res.status(200).send({
                    status: "ok",
                    data: entityResource(entity)
                });
            })
            .catch((err) => {
                res.status(500).send({
                    status: "error",
                    message: "Entity store failed. Cannot create EntityUser."
                });
                console.debug(err);
            });
        })
        .catch((err) => {
            res.status(500).send({
                status: "error",
                message: "Entity store failed. Cannot create Entity."
            });
            console.debug(err);
        });
    } else {
        res.status(422).send({
            status: "error",
            message: "Entity store failed. No avatar file."
        });
    }
};

async function update(req, res) {
    const { userId } = req.params;
    dict = {};

    const {
        ent_nombre,
        ent_direcc,
        ent_celpai,
        ent_celula
    } = req.body;

    if (ent_nombre !== undefined) dict.ent_nombre = ent_nombre;
    if (ent_direcc !== undefined) dict.ent_direcc = ent_direcc;
    if (ent_celpai !== undefined) dict.ent_celpai = ent_celpai;
    if (ent_celula !== undefined) dict.ent_celula = ent_celula;

    if (req.file) {
        const filePic = req.file;
        const avatar = {
            fil_mimtyp: filePic.mimetype,
            fil_filnam: filePic.filename,
            fil_size: filePic.size,
            fil_path: filePic.path
        };
        dict.ent_avatar = avatar;
    }

    EntityUser.findOne({ user_id: userId, enu_cargo: EntityUser.Cargo.admin })
    .then((entityUser) => {
        if (entityUser !== null) {
            Entity.findOne({ _id: entityUser.entity_id })
            .then((entity) => {
                if (entity === null) {
                    res.status(404).send({
                        status: "error",
                        message: "Entity not found."
                    });
                } else {
                    if (entity.ent_direcc !== undefined) {
                        const entityAddress = entity.ent_direcc;
                        if (dict.ent_direcc !== undefined) {
                            const dictAddress = dict.ent_direcc;
                            if (dictAddress.add_addres === undefined) dictAddress.add_addres = entityAddress.add_addres;
                            if (dictAddress.add_city === undefined) dictAddress.add_city = entityAddress.add_city;
                            if (dictAddress.add_poscod === undefined) dictAddress.add_poscod = entityAddress.add_poscod;
                            if (dictAddress.add_countr === undefined) dictAddress.add_countr = entityAddress.add_countr;
                            if (dictAddress.add_state === undefined) dictAddress.add_state = entityAddress.add_state;
                            if (dictAddress.add_telcou === undefined) dictAddress.add_telcou = entityAddress.add_telcou;
                            if (dictAddress.add_teleph === undefined) dictAddress.add_teleph = entityAddress.add_teleph;
                        } else {
                            dict.ent_direcc = entityAddress;
                        }
                    }

                    Entity.findByIdAndUpdate({ _id: entity._id }, dict, { new: true })
                    .then((entity) => {
                        res.status(200).send({
                            status: "ok",
                            data: entityResource(entity)
                        });
                    })
                    .catch((err) => {
                        res.status(500).send({
                            status: "error",
                            message: "Entity update failed. DB error."
                        });
                        console.debug(err);
                    });
                }
            })
            .catch((err) => {
                res.status(500).send({
                    status: "error",
                    message: "Entity not found. DB error."
                });
                console.debug(err);
            });
        } else {
            res.status(404).send({
                status: "error",
                message: "EntityUser not found."
            });
        }
    })
    .catch((err) => {
        res.status(500).send({
            status: "error",
            message: "Entity update failed. DB error."
        });
        console.debug(err);
    });
        
}

async function destroy(req, res) {
    const { userId } = req.params;
    EntityUser.findOneAndDelete({ user_id: userId, enu_cargo: EntityUser.Cargo.admin })
    .then((entityUser) => {
        if (entityUser === null) {
            res.status(404).send({
                status: "error",
                message: "EntityUser not found."
            });
        } else {
            Entity.findOneAndDelete({ _id: entityUser.entity_id })
            .then((entity) => {
                if (entity === null) {
                    res.status(404).send({
                        status: "error",
                        message: "Entity not found."
                    });
                } else {
                    res.status(200).send({
                        status: "ok",
                        data: entityResource(entity)
                    });
                }
            })
            .catch((err) => {
                res.status(500).send({
                    status: "error",
                    message: "Entity destroy failed. DB error."
                });
                console.debug(err);
            });
        }
    })
    .catch((err) => {
        res.status(500).send({
            status: "error",
            message: "EntityUser destroy failed. DB error."
        });
        console.debug(err);
    });
}

module.exports = {
    index,
    store,
    show,
    update,
    destroy
}