const axios = require("axios");
const router = require("express").Router();

router.get("/recipes", (req, res) => {
  axios
    .get("http://www.recipepuppy.com/api/", { params: req.query })
    .then(({ data: { results } }) => res.json(results))
    .catch(err => res.status(422).json(err));
});


router.get("/properties", (req, res) => {
  // results = properties.json + map data
  // TODO: Return a valid promise. 
  axios
    .get("sourceOfPropertyData.json + map", { params: req.query })
    .then(({ data: { results } }) => res.json(results))
    .catch(err => res.status(422).json(err));
})

module.exports = router;
