const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../../config");
const UserToken = require("../models/user-token.model");

const createAccessToken = (user) => {
    const payload = {
        id: user._id,
        role: user.role,
    };
    return new Promise((resolve, reject) => {
        jwt.sign(payload, SECRET_KEY, { algorithm: "HS256", expiresIn: "10s" }, (err, token) => {
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
};