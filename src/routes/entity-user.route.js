const express = require("express");
const api = express.Router();

const {
    store,
    update,
    destroy
} = require("../controllers/entity-user.controller");

const {
    index
} = require("../controllers/entity.controller");

const {
    validateUserEntitiesStore,
    validateUserEntitiesUpdate,
    validateUserEntitiesDelete
} = require("../validators/entity-user.validator");

const {
    validateEntityIndexUsers
} = require("../validators/entity.validator");

const { ensureAuth } = require("../middleware/user.auth");

api.post("/:entityId/users/:userId", ensureAuth, validateUserEntitiesStore, store);
api.put("/:entityId/users/:userId", ensureAuth, validateUserEntitiesUpdate, update);
api.get("/:entityId/users", ensureAuth, validateEntityIndexUsers, index);
api.delete("/:entityId/users/:userId", ensureAuth, validateUserEntitiesDelete, destroy);

module.exports = api;