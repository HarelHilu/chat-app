const express = require('express');
const router = express.Router();
const appId = "81f7fc67-9d97-4cf8-b298-a5572b5dc3d0";
const url = require('url');

router.get('/', (req, res) => {
    
    

    console.log(req.query);
    console.log(req.params);
    res.send("server is here :)");
});

router.get('/wixAuth', (req, res) => {
    token = req.query.token;    
    res.redirect(url.format({
        pathname:"https://www.wix.com/app-oauth-installation/consent/",
        query: {
           "token": token,
           "appId": appId,
           "redirectUrl": "https://206522c4.ngrok.io/auth"
         }
      }));
});

module.exports = router;