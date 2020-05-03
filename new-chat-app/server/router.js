const express = require('express');
const router = express.Router();
const url = require('url');
const appId = "81f7fc67-9d97-4cf8-b298-a5572b5dc3d0";

router.get('/', (req, res) => {
    res.send("server is here :)");
});

// MSID installs the app and we get the token from wix and pass in order to get code
router.get('/wixAuth', (req, res) => {
    token = req.query.token;    
    res.redirect(url.format({
        pathname:"https://www.wix.com/app-oauth-installation/consent/",
        query: {
           "token": token,
           "appId": appId,
           // ngrok redirects URL expires every 7 houes/ We nned it cause Wix need https path to notify webhooks
           "redirectUrl": "https://11344db9.ngrok.io"
         }
      }));
});

module.exports = router;