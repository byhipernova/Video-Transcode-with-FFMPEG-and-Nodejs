// video post route
const express = require('express');
const {saveVideo} = require('../controllers/video');

const router = express.Router();

router.post('/', async (req, res) => {
    if(!req.files.video){
        res.send("0");
        return;
    }
    await saveVideo(req);
    res.send("1")
})

module.exports = router;

