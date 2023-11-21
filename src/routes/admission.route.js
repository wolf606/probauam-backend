const express = require("express");
const api = express.Router();

const {
    indexUserAdmissions,
    storeUserAdmission
} = require("../controllers/admission.controller");

const {
    validateUserIndexAdmissions,
    validateUserStoreAdmissions
} = require("../validators/admission.validator");

const { ensureAuth } = require("../middleware/user.auth");

api.get("/:userId/admissions", ensureAuth, validateUserIndexAdmissions, indexUserAdmissions);
api.post("/:userId/entity/:entityId/professional/:professionalId/admissions", ensureAuth, validateUserStoreAdmissions, storeUserAdmission);

module.exports = api;