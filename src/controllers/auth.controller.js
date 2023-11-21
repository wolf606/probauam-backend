const { createAccessToken, decodeToken } = require("../utils/jwt");
const { comparePassword, hashPassword } = require("../utils/pwd");
const { passwordResetEmail } = require("../templates/mail/mail.templates");
const User = require("../models/user.model");
const UserToken = require("../models/user-token.model");

async function signIn(req, res) {
    const email = req.body.email.toLowerCase();
    const password = req.body.password;
    
    User.findOne({ email: email }, 'email password active role profile')
    .then(async (user) => {
        if (user !== null) {
            if (user.active) {
                comparePassword(password, user.password)
                .then(async (match) => {
                    if (match) {
                        createAccessToken(user)
                        .then((token) => {
                            res.status(200).send({
                                status: "ok",
                                accessToken: token
                            });
                        })
                        .catch((err) => {
                            res.status(500).send({
                                status: "error",
                                message: "Cannot create access token."
                            });
                            console.debug(err);
                        });
                    } else {
                        res.status(401).send({
                            status: "error",
                            errors: {
                                password: ["Password does not match."]
                            }
                        });
                    }
                })
                .catch((err) => {
                    res.status(500).send({
                        status: "error",
                        message: "Cannot compare password."
                    });
                    console.debug(err);
                });
            } else {
                res.status(401).send({
                    status: "error",
                    message: "User is not active.",
                    data: {
                        active: user.active,
                        email: email
                    }
                });
            }
        } else {
            res.status(500).send({
                status: "error",
                message: "User not found."
            });
            console.debug("findOne User should never return null. Validation failed.");
        }
    })
    .catch((err) => {
        res.status(500).send({
            status: "error",
            message: "DB error."
        });
        console.debug(err);
    });
};

async function activateAccount(req, res) {
    const { uid, token } = req.params;
    
    const id = Buffer.from(uid, 'base64').toString('ascii');
    decodeToken(token)
    .then((payload) => {
        if (payload.id === id) {
            UserToken.findOne({ user_ObjectId: id, token })
            .then((userToken) => {
                if (userToken !== null) {
                    User.findOne({ _id: id }, 'active')
                    .then((user) => {
                        if (user !== null) {
                            if (user.active) {
                                UserToken.deleteOne({ user_ObjectId: id, token })
                                .then((userToken) => {
                                    res.status(400).send({
                                        status: "error",
                                        message: "User is already active."
                                    });
                                })
                                .catch((err) => {
                                    res.status(500).send({
                                        status: "error",
                                        message: "DB error."
                                    });
                                    console.debug(err);
                                });
                            } else {
                                User.findByIdAndUpdate({ _id: id }, { active: true }, { new: true })
                                .then((user) => {
                                    if (user === null) {
                                        UserToken.deleteOne({ user_ObjectId: id, token })
                                        .then((userToken) => {
                                            res.status(404).send({
                                                status: "error",
                                                message: "User not found."
                                            });
                                        })
                                        .catch((err) => {
                                            res.status(500).send({
                                                status: "error",
                                                message: "DB error."
                                            });
                                            console.debug(err);
                                        });
                                    } else {
                                        UserToken.deleteOne({ user_ObjectId: id, token })
                                        .then((userToken) => {
                                            res.status(200).send({
                                                status: "ok",
                                                message: "User activated.",
                                                data: {
                                                    active: user.active,
                                                    email: user.email
                                                }
                                            });
                                        })
                                        .catch((err) => {
                                            res.status(500).send({
                                                status: "error",
                                                message: "DB error."
                                            });
                                            console.debug(err);
                                        });
                                    }
                                })
                                .catch((err) => {
                                    res.status(500).send({
                                        status: "error",
                                        message: "DB error."
                                    });
                                    console.debug(err);
                                });
                            }
                        } else {
                            res.status(404).send({
                                status: "error",
                                message: "User not found."
                            });
                        }
                    })
                    .catch((err) => {
                        res.status(500).send({
                            status: "error",
                            message: "DB error."
                        });
                        console.debug(err);
                    });
                } else {
                    res.status(401).send({
                        status: "error",
                        message: "Token has expired."
                    });
                }
            })
            .catch((err) => {
                res.status(401).send({
                    status: "error",
                    message: "DB error"
                });
                console.debug(err);
            })
        } else {
            res.status(401).send({
                status: "error",
                message: "Token does not belong to user."
            });
        }
    })
    .catch((err) => {
        res.status(401).send({
            status: "error",
            message: "Cannot decode token."
        });
    });
}

async function resetPasswordSendEmail(req, res) {
    const email = req.body.email.toLowerCase();
    User.findOne({ email: email }, 'email active')
    .then(async (user) => {
        if (user !== null) {
            if (user.active) {
                try {
                    await passwordResetEmail(user);
                    res.status(200).send({
                        status: "ok",
                        message: "Password reset email sent.",
                        data: {
                            email: email
                        }
                    });
                } catch (err) {
                    res.status(500).send({
                        status: "error",
                        message: "Cannot send email."
                    });
                    console.debug(err);
                    return;
                }
            } else {
                res.status(403).send({
                    status: "error",
                    message: "User is not active.",
                    data: {
                        active: user.active,
                        email: email
                    }
                });
            }
        } else {
            res.status(404).send({
                status: "error",
                message: "User not found."
            });
        }
    })
    .catch((err) => {
        res.status(500).send({
            status: "error",
            message: "DB error."
        });
        console.debug(err);
    });
}

async function resetPassword(req, res) {
    const { uid, token } = req.params;
    const { password } = req.body;
    
    const id = Buffer.from(uid, 'base64').toString('ascii');
    decodeToken(token)
    .then((payload) => {
        if (payload.id === id) {
            UserToken.findOne({ user_ObjectId: id, token })
            .then((userToken) => {
                if (userToken !== null) {
                    User.findOne({ _id: id }, 'active password')
                    .then(async (user) => {
                        if (user !== null) {
                            if (user.active) {
                                comparePassword(password, user.password)
                                .then(async (match) => {
                                    if (match) {
                                        res.status(400).send({
                                            status: "error",
                                            errors: {
                                                password: ["Password cannot be the same as before."]
                                            }
                                        });
                                    } else {
                                        await hashPassword(password)
                                        .then(async (hash) => {
                                            User.findByIdAndUpdate({ _id: id }, { password: hash }, { new: true })
                                            .then((user) => {
                                                if (user === null) {
                                                    res.status(404).send({
                                                        status: "error",
                                                        message: "User not found."
                                                    });
                                                } else {
                                                    UserToken.deleteOne({ user_ObjectId: id, token })
                                                    .then((userToken) => {
                                                        res.status(200).send({
                                                            status: "ok",
                                                            message: "Password reset.",
                                                        });
                                                    })
                                                    .catch((err) => {
                                                        res.status(500).send({
                                                            status: "error",
                                                            message: "DB error."
                                                        });
                                                        console.debug(err);
                                                    });
                                                }
                                            })
                                            .catch((err) => {
                                                res.status(500).send({
                                                    status: "error",
                                                    message: "DB error."
                                                });
                                                console.debug(err);
                                            });
                                        })
                                        .catch((err) => {
                                            res.status(500).send({
                                                status: "error",
                                                message: "Cannot hash password."
                                            });
                                            console.debug(err);
                                        });
                                    }
                                })
                            } else {
                                UserToken.deleteOne({ user_ObjectId: id, token })
                                .then((userToken) => {
                                    res.status(403).send({
                                        status: "error",
                                        message: "User is not active.",
                                        data: {
                                            active: user.active,
                                            email: email
                                        }
                                    });
                                })
                                .catch((err) => {
                                    res.status(500).send({
                                        status: "error",
                                        message: "DB error."
                                    });
                                    console.debug(err);
                                });
                            }
                        } else {
                            UserToken.deleteOne({ user_ObjectId: id, token })
                            .then((userToken) => {
                                res.status(404).send({
                                    status: "error",
                                    message: "User not found."
                                });
                            })
                            .catch((err) => {
                                res.status(500).send({
                                    status: "error",
                                    message: "DB error."
                                });
                                console.debug(err);
                            });
                        }
                    })
                    .catch((err) => {
                        res.status(500).send({
                            status: "error",
                            message: "DB error."
                        });
                        console.debug(err);
                    });
                } else {
                    res.status(401).send({
                        status: "error",
                        message: "Token has expired."
                    });
                }
            })
            .catch((err) => {
                res.status(401).send({
                    status: "error",
                    message: "DB error"
                });
                console.debug(err);
            })
        } else {
            res.status(401).send({
                status: "error",
                message: "Token does not belong to user."
            });
        }
    })
    .catch((err) => {
        res.status(401).send({
            status: "error",
            message: "Invalid token."
        });
    });
}

module.exports = {
    signIn,
    activateAccount,
    resetPasswordSendEmail,
    resetPassword
};