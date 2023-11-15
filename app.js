const express = require("express");
const cors = require("cors");

const fileRoutes = require("./src/routes/files.route");

const userRoutes = require("./src/routes/user.route");
const authRoutes = require("./src/routes/auth.routes");
const profileRoutes = require("./src/routes/profile.route");

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

app.use("/api/v1/uploads", fileRoutes);

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/", authRoutes);
app.use("/api/v1/users", profileRoutes);

app.use(function(req, res) {
    res.status(404).send(
        {
            error: "Unimplemented route",
        }
    );
});

module.exports = app;