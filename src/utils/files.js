const { APP_URL } = require("../../config");
const fs = require('fs');

function getFullPath(filePath) {
    return `${APP_URL}/api/v1/${filePath}`;
};

function getFileData(name, path) {
    if (fs.existsSync(`${path}/${name}`)) {
        try {
            const file = fs.createReadStream(`${path}/${name}`);
            return file;
        } catch (err) {
            console.debug("Error in files utils method getFileData: ", err);
        }
    }
    return null;
}

module.exports = {
    getFullPath,
    getFileData
}