const express = require("express");
const api = express.Router();

const multer = require("multer");
const storageLoc = 'uploads/avatar/';
const upload = multer({ dest: storageLoc });

const {
    store,
    show,
    update,
    destroy,
} = require("../controllers/entity.controller");

const {
    validateEntityShowDelete,
    validateEntityStore,
    validateEntityUpdate
} = require("../validators/entity.validator");

const {
    index,
    show: showEntityUser,
} = require("../controllers/entity-user.controller");

const {
    validateUserEntitiesIndex,
    validateUserEntitiesShow
} = require("../validators/entity-user.validator");

const { ensureAuth } = require("../middleware/user.auth");

api.post("/:userId/entity", upload.single('avatar'), ensureAuth, (req, res, next) => {
    try {
        if (req.body.ent_direcc !== undefined) {
            req.body.ent_direcc = JSON.parse(req.body.ent_direcc);
        }
    } catch (err) {
        res.status(500).send({
            status: "error",
            message: "Entity store failed. Cannot parse address."
        });
        console.debug(err);
        return;
    }
    next();
}, validateEntityStore, store);
api.get("/:userId/entity", ensureAuth, validateEntityShowDelete, show);
api.put("/:userId/entity", upload.single('avatar'), (req, res, next) => {
    try {
        if (req.body.ent_direcc !== undefined) {
            req.body.ent_direcc = JSON.parse(req.body.ent_direcc);
        }
    } catch (err) {
        res.status(500).send({
            status: "error",
            message: "Entity update failed. Cannot parse address."
        });
        console.debug(err);
        return;
    }
    next();
}, ensureAuth, validateEntityUpdate, update);
api.delete("/:userId/entity", ensureAuth, validateEntityShowDelete, destroy);

api.get("/:userId/entities", ensureAuth, validateUserEntitiesIndex, index);
api.get("/:userId/entities/:entityId", ensureAuth, validateUserEntitiesShow, showEntityUser);

module.exports = api;