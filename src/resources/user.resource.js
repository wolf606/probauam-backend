const { resource } = require("./resource");

const userResource = (data) => {
    return resource(data, (data) => {
        return {
            id: data._id,
            email: data.email,
            active: data.active,
            role: data.role,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        };
    });
}

module.exports = { userResource };