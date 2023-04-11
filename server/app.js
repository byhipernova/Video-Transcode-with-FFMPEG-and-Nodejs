const express = require('express');
const {queueVideo} = require('./lib/queue-video');
const {transcodeVideo} = require('./lib/transcode-video');
const app = express()
const port = 3000;

app.get('/', async (req, res) => {
    await queueVideo();
    res.send("1")
})

transcodeVideo();


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})