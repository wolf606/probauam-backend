const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../../config");
const UserToken = require("../models/user-token.model");
const { getFullPath } = require("../utils/files");

const createAccessToken = (user) => {
    var avatarUrl = "";
    var names = "";
    if (user.profile) {
        if (user.profile.pro_avatar) {
            avatarObj = user.profile.pro_avatar
            avatarUrl = getFullPath(avatarObj.fil_path, avatarObj.fil_filnam);
        }
        names = user.profile.pro_nombre;
    }
    var payload = {
        id: user._id,
        email: user.email,
        role: user.role,
        avatar: avatarUrl,
        names,
    };
    return new Promise((resolve, reject) => {
        jwt.sign(payload, SECRET_KEY, { algorithm: "HS512", expiresIn: "24h" }, (err, token) => {
            if (err) {
                reject(err);
            } else {
                UserToken.deleteMany({ user_ObjectId: user._id })
                .then(() => {
                    new UserToken({
                        user_ObjectId: user._id,
                        token
                    })
                    .save()
                    .then(() => {
                        resolve(token);
                    })
                    .catch((err) => {
                        console.debug("Cannot save user x token", err);
                        reject(err);
                    });
                })
                .catch((err) => {
                    console.debug("Cannot delete user x token", err);
                    reject(err);
                });
            }
        });
    });
};

const createActivityToken = (key, userId, activityId, admissionId) => {
    
    var payload = {
        userId,
        activityId,
        admissionId,
    };
    return new Promise((resolve, reject) => {
        jwt.sign(payload, key, { algorithm: "HS512", expiresIn: "6h" }, (err, token) => {
            if (err) {
                reject(err);
            } else {
                resolve(token);
            }
        });
    });
};

const decodeActivityToken = (token, key) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, key, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });
}

const decodeToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                UserToken.deleteMany({ token })
                .then(() => {
                    reject(err);
                })
                .catch((err) => {
                    console.debug("Cannot delete user x token", err);
                    reject(err);
                });
            } else {
                resolve(decoded);
            }
        });
    });
};

module.exports = {
    createAccessToken,
    decodeToken,
    createActivityToken,
    decodeActivityToken
};