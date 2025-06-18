const documentRoutes = require("./document.route");
const homeRoutes = require("./home.route");
const authRoute = require("./auth.route");
const routeRole = require("./role.route");
const authrequire = require("../../middleware/auth.middleware");
module.exports = (app) => {
    app.use("/auth", authRoute);
    app.use("/role", routeRole);
    app.use("/document", authrequire.requireAuth, documentRoutes);
    app.use("/", authrequire.requireAuth, homeRoutes );
}
