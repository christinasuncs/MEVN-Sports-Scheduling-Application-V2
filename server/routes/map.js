const express = require('express');
const router = express.Router();
const axios = require('axios');

// get all league
router.get("/:address", async (req, res) => {
  var config = {
    method: 'get',
    url: `https://maps.googleapis.com/maps/api/geocode/json?address=${req.params.address}&key=AIzaSyC1J8rbjY3B-Y-dzoWU7jl6hAW4jAh-yRk`,
    headers: { }
  };
  
  axios(config)
  .then(function (response) {
    res.json(response.data);
  })
  .catch(function (error) {
    console.log(error);
        res.status(500).json({error: error.message});
  });
})

module.exports = router;