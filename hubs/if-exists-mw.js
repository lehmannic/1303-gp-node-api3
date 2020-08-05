const Hubs = require("./hubs-model.js");
const { orWhereNotExists } = require("../data/dbConfig");

module.exports = async (req, res, next) => {
  const id = req.params.id;
  try {
    const hub = await Hubs.findById(id);
    hub
      ? next()
      : res.status(404).json({
          message: `id: ${id} does not exists --> if-exists middleware`,
        });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
