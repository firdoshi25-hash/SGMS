const express = require("express");
const createResourceController = require("../controllers/resourceController");

function createResourceRouter(Model) {
  const router = express.Router();
  const controller = createResourceController(Model);

  router.get("/", controller.list);
  router.post("/", controller.create);
  router.patch("/:id", controller.update);
  router.delete("/:id", controller.remove);

  return router;
}

module.exports = createResourceRouter;