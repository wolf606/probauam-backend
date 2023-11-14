const express = require("express");
const cors = require("cors");

const userRoutes = require("./src/routes/user.route");
const authRoutes = require("./src/routes/auth.routes");

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/", authRoutes);

app.use(function(req, res) {
    res.status(404).send(
        {
            error: "Unimplemented route",
        }
    );
});

module.exports = app;