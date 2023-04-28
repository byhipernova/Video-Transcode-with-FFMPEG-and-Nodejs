const express = require('express');
const {queueVideo} = require('./lib/queue-video');
const {transcodeVideo} = require('./lib/transcode-video');
const fileUpload = require('express-fileupload');
const app = express()
const port = 3000;

// default options
app.use(fileUpload());

app.post('/', async (req, res) => {
    console.log(req.files);
    //await queueVideo();
    res.send("1")
})

transcodeVideo();


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})