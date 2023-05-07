const ffprobe = require("ffprobe");
const Video = require("../models/video");
const ffprobeStatic = require("ffprobe-static");
const { queueVideo } = require("../lib/queue-video");


exports.saveVideo = async (req) =>{
    const video = req.files.video;
    const videoPath = `static/video/${video.name}`;
    await video.mv(videoPath);
    // get video info
    let info = await
    ffprobe(videoPath, { path: ffprobeStatic.path }).then(async info => {
        console.log(typeof Video)
        const newVideo = new Video({
            title: video.name,
            videoPath: videoPath,
            resolution: info.streams[0].width + "x" + info.streams[0].height,
            size: info.streams[0].size,
            duration: info.streams[0].duration,
            status: "queued",
            userId: "1",
            transcodedVideos: []
        });

        await newVideo.save();

        // get saved video id
        const videoId = newVideo._id;

        await queueVideo(videoId);
    }).catch(err => {
        console.error(err);
    })

}
