const { resource } = require("./resource");
const { pictureResource } = require("./picture.resource");

const entityResource = (data) => {
    return resource(data, (data) => {
        const result = {
            id: data._id,
            ent_nombre: data.ent_nombre,
            ent_direcc: data.ent_direcc,
            ent_celpai: data.ent_celpai,
            ent_celula: data.ent_celula
        };

        if (data.ent_avatar) {
            result.ent_avatar = pictureResource(data.ent_avatar);
        }

        result.createdAt = data.createdAt;
        result.updatedAt = data.updatedAt;
        return result;
    });
}

module.exports = { entityResource };