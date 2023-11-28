const express = require("express");
const api = express.Router();

const {
    show
} = require("../controllers/admission.controller");

const {
    validateShowAdmission
} = require("../validators/admission.validator");

const { ensureAuth } = require("../middleware/user.auth");

api.get("/:admissionId", ensureAuth, validateShowAdmission, show);

module.exports = api;