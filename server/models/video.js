// video model

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// video shema

const videoSchema = new Schema({
    title: String,
    videoPath: String,
    resolution: String,
    size: String,
    duration: String,
    status: String,
    userId: String,
    transcodedVideos: [{
        resolution: String,
        size: String,
        duration: String,
        videoPath: String,
    }]

});

module.exports = mongoose.model('Video', videoSchema);
