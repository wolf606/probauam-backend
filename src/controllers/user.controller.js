const User = require("../models/user.model");
const { hashPassword } = require("../utils/pwd");
const { userResource } = require("../resources/user.resource");
const { decodeToken } = require("../utils/jwt");
const { activationEmail } = require("../templates/mail/mail.templates");

async function index(req, res) {
    User.find()
    .then((users) => {
        res.status(200).send({
            status: "ok",
            data: userResource(users)
        });
    })
    .catch((err) => {
        res.status(500).send({
            status: "error",
            message: "User index failed. Cannot find users."
        });
        console.debug(err);
    });
};

async function show(req, res) {
    const params = req.params;
    User.findById({ _id: params.id })
    .then((user) => {
        if (user === null) {
            res.status(404).send({
                status: "error",
                message: "User not found."
            });
        } else {
            res.status(200).send({
                status: "ok",
                data: userResource(user)
            
            });
        }
    })
    .catch((err) => {
        res.status(500).send({
            status: "error",
            message: "User show failed. Cannot find user."
        });
        console.debug(err);
    });
}

async function store(req, res) {
    const { email, password } = req.body;
    hashPassword(password)
    .then((hash) => {
        new User({
            email,
            password: hash,
            role: User.Roles.user
        })
        .save()
        .then(async (user) => {
            try {
                await activationEmail(user);
                res.status(201).send({
                    status: "ok",
                    data: userResource(user)
                });
            } catch (err) {
                User.deleteOne({ _id: user._id })
                .then((user) => {
                    res.status(500).send({
                        status: "error",
                        message: "User store failed. Cannot send activation email."
                    });
                    console.debug("Cant send email because: ",err);
                })
            }
        })
        .catch((err) => {
            res.status(500).send({
                status: "error",
                message: "User store failed. Cannot save user."
            });
            console.debug(err);
        });
    })
    .catch((err) => {
        res.status(500).send({
            status: "error",
            message: "User store failed. Cannot hash password."
        });
        console.debug(err);
    });
};

async function update(req, res) {
    const params = req.params;
    const {
        email,
        password,
        active,
        role
    } = req.body;
    var dict = {};
    if (email !== undefined) dict.email = email;
    if (password !== undefined) {
        await hashPassword(password)
        .then((hash) => {
            dict.password = hash;
        })
        .catch((err) => {
            res.status(500).send({
                status: "error",
                message: "User update failed. Cannot hash password."
            });
            console.debug(err);
            return;
        });
    }
    if (active !== undefined) dict.active = active;
    if (role !== undefined) dict.role = role;

    User.findByIdAndUpdate({ _id: params.id }, dict, { new: true })
    .then((user) => {
        if (user === null) {
            res.status(404).send({
                status: "error",
                message: "User not found."
            });
        } else {
            res.status(200).send({
                status: "ok",
                data: userResource(user)
            });
        }
    })
    .catch((err) => {
        res.status(422).send({
            status: "error",
            message: "User update failed. Cannot update user."
        });
        console.debug(err);
    });
}

async function destroy(req, res) {
    const params = req.params;
    User.findByIdAndDelete({ _id: params.id })
    .then((user) => {
        if (user === null) {
            res.status(404).send({
                status: "error",
                message: "User not found."
            });
        } else {
            res.status(200).send({
                status: "ok",
                data: userResource(user)
            });
        }
    })
    .catch((err) => {
        res.status(422).send({
            status: "error",
            message: "User destroy failed. Cannot delete user."
        });
        console.debug(err);
    });
}

async function wipe(req, res) {
    const {
        id,
        name,
        lastname,
        email
    } = req.body;
    var dict = {};
    if (id !== undefined) dict._id = id;
    if (name !== undefined) dict.name = name;
    if (lastname !== undefined) dict.lastname = lastname;
    if (email !== undefined) dict.email = email;
    
    if (Object.keys(dict).length > 0){
        User.deleteMany(dict)
        .then((users) => {
            if (users === null) {
                res.status(404).send({
                    status: "error",
                    message: "Users not found."
                });
            } else {
                res.status(200).send({
                    status: "ok",
                    data: userResource(users)
                });
            }
        })
        .catch((err) => {
            res.status(422).send({
                status: "error",
                message: "User wipe failed. Cannot delete users."
            });
            console.debug(err);
        });
    } else {
        res.status(422).send({
            status: "error",
            message: "User wipe failed. No parameters to delete users."
        });
    }
}

async function getMe(req, res) {
    if (!req.headers.authorization) { 
        res.status(401).send({
            status: "error",
            message: "Unauthenticated"
        });
    } else {
        const token = req.headers.authorization.replace(/['"]+/g, "");
        decodeToken(token)
        .then((payload) => {
            User.findOne({ _id: payload.id })
            .then((user) => {
            if (user !== null) {
                res.status(200).send({
                    status: "ok",
                    data: userResource(user)
                });
            } else {
                res.status(404).send({
                    status: "error",
                    message: "Token has no valid user."
                });
            }
            })
            .catch((err) => {
            res.status(401).send({
                status: "error",
                message: "Error finding existing user"
            });
            });
        })
        .catch((err) => {
            res.status(401).send({
                status: "error",
                message: "Invalid token or expired."
            });
        })
    }
}

module.exports = {
    store,
    index,
    show,
    update,
    destroy,
    wipe,
    getMe
}