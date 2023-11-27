const { decodeToken, decodeActivityToken } = require("../utils/jwt");
const User = require("../models/user.model");
const UserToken = require("../models/user-token.model");
const Activity = require("../models/activity.model");

async function ensureAuth(req, res, next) {
  if (!req.headers.authorization) { 
    res.status(401).send({
      status: "error",
      message: "Unauthenticated"
    });
  } else {
    const token = req.headers.authorization.replace(/['"]+/g, "");
    decodeToken(token)
    .then((payload) => {
      UserToken.findOne({ user_ObjectId: payload.id, token })
      .then((userToken) => {
        if (userToken !== null) {
          User.findOne({ _id: payload.id }, 'email active')
          .then((user) => {
            if (user !== null) {
              if (user.active === false) {
                res.status(403).send({ 
                  status: "error",
                  message: "User is not active.",
                  data: {
                    active: user.active,
                    email: user.email
                  }
                });
              } else {
                req.user = payload;
                next();
              }
            } else {
              res.status(404).send({
                status: "error",
                message: "Token has no valid user."
              });
            }
          })
          .catch((err) => {
            res.status(500).send({
              status: "error",
              message: "DB error."
            });
          });
        } else {
          res.status(401).send({
            status: "error",
            message: "Token has expired."
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          status: "error",
          message: "DB error."
        });
      });
    })
    .catch((err) => {
      res.status(401).send({
        status: "error",
        message: "Token is not associated."
      });
    })
  }
};

async function ensureAuthActivity(req, res, next) {
  if (!req.headers.authorization) { 
    res.status(401).send({
      status: "error",
      message: "Unauthenticated"
    });
  } else {
    const token = req.headers.authorization.replace(/['"]+/g, "");
    Activity.findOne({ _id: req.params.activityId })
    .then((activity) => {
      if (activity !== null) {
        decodeActivityToken(token, activity.act_key)
        .then((payload) => {
          req.scoreboard = payload;
          next();
        })
        .catch((err) => {
          res.status(401).send({
            status: "error",
            message: "Token is not associated to activity."
          });
        });
      } else {
        res.status(404).send({
          status: "error",
          message: "Activity not found."
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        status: "error",
        message: "DB error."
      });
    });
  }
};

module.exports = {
  ensureAuth,
  ensureAuthActivity
};