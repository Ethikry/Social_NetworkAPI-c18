const router = require("express").Router();
const usersRoutes = require("./users-route");
const thoughtsRoutes = require("./thoughts-route");

router.use("/users", usersRoutes);
router.use("/thoughts", thoughtsRoutes);

module.exports = router;
