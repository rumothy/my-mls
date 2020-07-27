const router = require("express").Router();
const propertiesController = require('../controllers/propertiesController');

router.get("/properties", (req, res) => {
  console.log("apiRoutes: get /properties, req.query: ", req.query);
  res.json(propertiesController.handleQuery(req.query));
});

module.exports = router;