const express = require("express");
const api = express.Router();
const {
    store,
    index,
    show,
    update,
    destroy,
    wipe,
    getMe
} = require("../controllers/user.controller");
const {
    validateUserStore,
    validateUserShow,
    validateUserDestroy,
    validateUserUpdate,
    validateUserIndex
} = require("../validators/user.validator");
const { ensureAuth } = require("../middleware/user.auth");

api.post("/", validateUserStore, store);
api.get("/", ensureAuth, validateUserIndex, index);
api.get("/me", ensureAuth, getMe);
api.get("/:id", ensureAuth, validateUserShow, show);
api.put("/:id", ensureAuth, validateUserUpdate, update);
api.delete("/:id", ensureAuth, validateUserDestroy, destroy);
api.delete("/", ensureAuth, wipe);

module.exports = api;