const express = require("express");
const cors = require("cors");
//trigger deploy
//again
const fileRoutes = require("./src/routes/files.route");

const userRoutes = require("./src/routes/user.route");
const authRoutes = require("./src/routes/auth.routes");
const profileRoutes = require("./src/routes/profile.route");
const entityRoutes = require("./src/routes/entity.route");
const entityUserRoutes = require("./src/routes/entity-user.route");
const admissionRoutes = require("./src/routes/admission.route");
const activityRoutes = require("./src/routes/activity.route");
const showAdmissionRoutes = require("./src/routes/showAdmission.route");
const stateRoutes = require("./src/routes/state.routes");
const cityRoutes = require("./src/routes/city.routes");

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

app.use("/api/v1/uploads", fileRoutes);

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/", authRoutes);
app.use("/api/v1/users", profileRoutes);
app.use("/api/v1/users", entityRoutes);
app.use("/api/v1/entities", entityUserRoutes);
app.use("/api/v1/users", admissionRoutes);
app.use("/api/v1/activities", activityRoutes);
app.use("/api/v1/admissions", showAdmissionRoutes);
app.use(`/api/v1/states`, stateRoutes);
app.use(`/api/v1/cities`, cityRoutes);

app.use(function(req, res) {
    res.status(404).send(
        {
            error: "Unimplemented route",
        }
    );
});

module.exports = app;