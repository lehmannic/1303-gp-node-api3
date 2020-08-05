const router = require("express").Router();
const hubsRouter = require("../hubs/hubs-router");

router.use("/hubs", hubsRouter);

router.get("/", (req, res) => {
  res.status(200).json({ router: "api" });
});

module.exports = router;
