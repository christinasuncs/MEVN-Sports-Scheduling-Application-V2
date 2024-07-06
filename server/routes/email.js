require('dotenv').config()
const express = require('express');
const router = express.Router();
const axios = require('axios');

// send reminder email
router.post("/reminder", async (req, res) => {
    let data = JSON.stringify({
        "service_id": process.env.EMAILJS_SERVICEID,
        "template_id": "template_i44uwf9",
        "user_id": process.env.EMAILJS_USERID,
        "accessToken": process.env.EMAILJS_ACCESSTOKEN,
        "template_params": {
            "to_name": "User",
            "to_email": req.body.email,
            "event_type": req.body.event_type,
            "reply_to": "",
            "message": req.body.message
        }
    });
    
    let config = {
        method: 'post',
        url: 'https://api.emailjs.com/api/v1.0/email/send',
        headers: { 
            'Content-Type': 'application/json'
        },
        data : data
    };
    
    axios(config)
    .then(function (response) {
        console.log(JSON.stringify(response.data));
        res.json(response.data);
    })
    .catch(function (err) {
        console.log(err);
        res.status(500).json({err: err.message});
    });
});

router.post("/update", async (req, res) => {
    let data = JSON.stringify({
        "service_id": process.env.EMAILJS_SERVICEID,
        "template_id": "template_zwyhdl8",
        "user_id": process.env.EMAILJS_USERID,
        "accessToken": process.env.EMAILJS_ACCESSTOKEN,
        "template_params": {
            "to_name": "User",
            "to_email": req.body.email,
            "event_type": req.body.event_type,
            "reply_to": "",
            "message": req.body.message
        }
    });
    
    let config = {
        method: 'post',
        url: 'https://api.emailjs.com/api/v1.0/email/send',
        headers: { 
            'Content-Type': 'application/json'
        },
        data : data
    };
    
    axios(config)
    .then(function (response) {
        console.log(JSON.stringify(response.data));
        res.json(response.data);
    })
    .catch(function (err) {
        console.log(err);
        res.status(500).json({err: err.message});
    });
});



module.exports = router;