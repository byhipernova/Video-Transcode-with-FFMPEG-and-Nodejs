const express = require('express');
const {transcodeVideo} = require('./lib/transcode-video');
const fileUpload = require('express-fileupload');
const videoRoutes = require('./routes/video');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/vidly', {useNewUrlParser: true, useUnifiedTopology: true})

const app = express()
const port = 3000;

// default options
app.use(fileUpload());

app.use(express.static('static'));

app.use('/video', videoRoutes);

transcodeVideo();


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})