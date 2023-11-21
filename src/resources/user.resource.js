const { resource } = require("./resource");
const { pictureResource } = require("./picture.resource");

const userResource = (data) => {
    return resource(data, (data) => {
        const result = {
            id: data._id,
            email: data.email,
            active: data.active,
            role: data.role,
        };

        if (data.profile) {
            result.profile = JSON.parse(JSON.stringify(data.profile));
            if (data.profile.pro_avatar) {
                result.profile.pro_avatar = pictureResource(data.profile.pro_avatar);
            }
        }

        result.createdAt = data.createdAt;
        result.updatedAt = data.updatedAt;
        return result;
    });
}

module.exports = { userResource };