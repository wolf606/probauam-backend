const { resource } = require("./resource");

const entityUserResource = (data) => {
    return resource(data, (data) => {
        return {
            id: data._id,
            entity_id: data.entity_id,
            user_id: data.user_id,
            enu_active: data.enu_active,
            enu_cargo: data.enu_cargo,
        }
    });
}

module.exports = { entityUserResource };