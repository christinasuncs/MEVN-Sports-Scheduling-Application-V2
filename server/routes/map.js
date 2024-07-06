require('dotenv').config()
const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get("/:address", async (req, res) => {
  var config = {
    method: 'get',
    url: `https://maps.googleapis.com/maps/api/geocode/json?address=${req.params.address}&key=${process.env.GOOGLEMAPS_KEY}`,
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