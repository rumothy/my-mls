const axios = require("axios");
const router = require("express").Router();
const propertiesController = require('../controllers/propertiesController');

router.get("/recipes", (req, res) => {
  axios
    .get("http://www.recipepuppy.com/api/", { params: req.query })
    .then(({ data: { results } }) => res.json(results))
    .catch(err => res.status(422).json(err));
});


router.get("/properties", (req, res) => {
  // results = properties.json + map data
  // TODO: Return a valid promise. 

  let params= req.query;
  console.log(params);
  let results = propertiesController.findAll();
  res.json(results);
  //  .catch(err => res.status(422).json(err));
})

module.exports = router;

/*
PropertiesController

*/