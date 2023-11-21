const { resource } = require("./resource");
const { getFullPath } = require("../utils/files");

const pictureResource = (data) => {
    return resource(data, (data) => {
        if (data.fil_path) {
            const url = getFullPath(data.fil_path);
            return url;
        } else {
            return null;
        }
    });
}

module.exports = { pictureResource };