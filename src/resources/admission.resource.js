const { resource } = require("./resource");
const { userResource } = require("./user.resource");
const { entityResource } = require("./entity.resource");

const admissionResource = (data) => {
    return resource(data, (data) => {
        const result = {
            id: data._id,
        };

        if (data.patient) {
            result.patient = userResource(data.patient);
        }
        if (data.entity) {
            result.entity = entityResource(data.entity);
        }
        if (data.professional) {
            result.professional = userResource(data.professional);
        }

        if(data.adm_patien) {
            result.adm_patien = data.adm_patien;
        }
        if(data.adm_profes) {
            result.adm_profes = data.adm_profes;
        }
        if(data.adm_entity) {
            result.adm_entity = data.adm_entity;
        }

        result.adm_admdat = data.adm_admdat,
        result.adm_disdat = data.adm_disdat,
        result.adm_compan = data.adm_compan,
        result.adm_calibr = data.adm_calibr,
        result.adm_sde = data.adm_sde,
        result.adm_can = data.adm_can,

        result.createdAt = data.createdAt;
        result.updatedAt = data.updatedAt;
        return result;
    });
}

module.exports = { admissionResource };