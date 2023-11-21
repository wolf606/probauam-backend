const Entity = require("../models/entity.model");
const EntityUser = require("../models/entity-user.model");
const { entityResource } = require("../resources/entity.resource");
const { entityUserResource } = require("../resources/entity-user.resource");

async function index(req, res) {
    const { userId } = req.params;
    const query = req.query;

    search = {
        user_id: userId
    };
    if (query.cargo !== undefined) search.enu_cargo = query.cargo;
    if (query.active !== undefined) search.enu_active = query.active;

    EntityUser.find(search)
    .then((entityUsers) => {
        if (entityUsers === null) {
            res.status(404).send({
                status: "error",
                message: "No entities related to user."
            });
        } else {
            Entity.find({ _id: entityUsers.map((entityUser) => entityUser.entity_id) })
            .then((entities) => {
                res.status(200).send({
                    status: "ok",
                    data: entities.map((entity) => {
                        var entityUser = null;
                        for (let i = 0; i < entityUsers.length; i++) {
                            if (entityUsers[i].entity_id.toString() === entity._id.toString()) {
                                entityUser = entityUsers[i];
                                break;
                            }
                        }
                        if (entityUser === null) {
                            return {
                                ...entityResource(entity),
                                entity_user: null
                            };
                        }
                        return {
                            ...entityResource(entity),
                            entity_user: {
                                enu_cargo: entityUser.enu_cargo,
                                enu_active: entityUser.enu_active
                            }
                        };
                    })
                });
            })
            .catch((err) => {
                res.status(500).send({
                    status: "error",
                    message: "Entity index failed. DB error."
                });
                console.debug(err);
            });
        }
    });
};

async function show(req, res) {
    const { userId, entityId } = req.params;
    EntityUser.findOne({ user_id: userId, entity_id: entityId })
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
                    data: {
                        ...entityResource(entity),
                        entity_user: {
                            enu_cargo: entityUser.enu_cargo,
                            enu_active: entityUser.enu_active
                        }
                    }
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
    const { userId, entityId } = req.params;
    const { enu_cargo } = req.body;

    EntityUser.create({
        entity_id: entityId,
        user_id: userId,
        enu_cargo: enu_cargo
    })
    .then((entityUser) => {
        res.status(201).send({
            status: "ok",
            data: entityUserResource(entityUser)
        });
    })
    .catch((err) => {
        res.status(500).send({
            status: "error",
            message: "EntityUser store failed. DB error."
        });
        console.debug(err);
    });
};

async function update(req, res) {
    const { userId, entityId } = req.params;
    const { enu_cargo, enu_active } = req.body;

    dict = {};

    if (enu_cargo !== undefined) dict.enu_cargo = enu_cargo;
    if (enu_active !== undefined) dict.enu_active = enu_active;

    EntityUser.findOneAndUpdate({ user_id: userId, entity_id: entityId }, dict, { new: true })
    .then((entityUser) => {
        if (entityUser === null) {
            res.status(404).send({
                status: "error",
                message: "No entity related to user."
            });
        } else {
            res.status(200).send({
                status: "ok",
                data: entityUserResource(entityUser)
            });
        }
    })
    .catch((err) => {
        res.status(500).send({
            status: "error",
            message: "EntityUser update failed. DB error."
        });
        console.debug(err);
    });
        
}

async function destroy(req, res) {
    const { userId, entityId } = req.params;

    EntityUser.findOneAndDelete({ user_id: userId, entity_id: entityId })
    .then((entityUser) => {
        if (entityUser === null) {
            res.status(404).send({
                status: "error",
                message: "No entity related to user."
            });
        } else {
            res.status(200).send({
                status: "ok",
                data: entityUserResource(entityUser)
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
    store,
    index,
    show,
    update,
    destroy
}