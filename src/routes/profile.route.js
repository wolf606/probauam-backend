const express = require("express");
const api = express.Router();

const {
    store,
    update,
} = require("../controllers/profile.controller");

const {
    validateProfileStore,
    validateProfileUpdate,
} = require("../validators/profile.validator");

const { ensureAuth } = require("../middleware/user.auth");

const multer = require("multer");
const storageLoc = 'uploads/avatar/';
const upload = multer({ dest: storageLoc });

api.post("/:id/profile", upload.single('avatar'), (req, res, next) => {
    try {
        if (req.body.pro_addres !== undefined) {
            req.body.pro_addres = JSON.parse(req.body.pro_addres);
        }
    } catch (err) {
        res.status(500).send({
            status: "error",
            message: "User profile store failed. Cannot parse address."
        });
        console.debug(err);
        return;
    }
    next();
}, validateProfileStore, store);

api.put("/:id/profile", upload.single('avatar'), ensureAuth, (req, res, next) => {
    try {
        if (req.body.pro_addres !== undefined) {
            req.body.pro_addres = JSON.parse(req.body.pro_addres);
        }
    } catch (err) {
        res.status(500).send({
            status: "error",
            message: "User profile update failed. Cannot parse address."
        });
        console.debug(err);
        return;
    }
    next();
}, validateProfileUpdate, update);

module.exports = api;