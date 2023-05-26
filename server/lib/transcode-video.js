const amqp = require("amqplib/callback_api");
const Video = require("../models/video");
const ffprobe = require("ffprobe");
const ffprobeStatic = require("ffprobe-static");
const ffmpeg = require('ffmpeg');
async function transcodeVideo() {
    await amqp.connect('amqp://localhost', async (error0, connection) => {
        await connection.createChannel(async (error1, channel) => {
            const queueName = 'video';
            await channel.assertQueue(queueName, { durable: false });
            channel.prefetch(1);
            channel.consume(queueName, async (msg) => {
                const videoId = msg.content.toString();
                const  resolutions = ["?x1080", "?x720", "?x480", "?x360", "?x240", "?x144"];
                for(const resolution of resolutions) {
                    await convertVideo(videoId, resolution);
                    console.log(resolution)
                }
                channel.ack(msg);

            }, {
                noAck: false
            });
        });
    })
};

async function convertVideo(videoId,resolution) {
    const video = await Video.findById(videoId);
    const videoPath = video.videoPath;
    const outputPath = `static/video/output${videoId}${Math.floor(Math.random() * 10)}_${resolution.replace("?x", "")}.mp4`;
    const process = new ffmpeg(videoPath);
    await process.then((video) => {
        return new Promise((resolve, reject) => {
            video.setVideoSize(resolution).save(outputPath, (error, file) => {
                if (!error) {
                    resolve(file);
                } else {
                    reject(error);
                }
            });
        });
    }).then((file) => {
        // get transcoded video info by ffprobe
        ffprobe(file, {path: ffprobeStatic.path}).then(info => {
            video.status = "done";
            video.transcodedVideos.push({
                resolution: info.streams[0].width + "x" + info.streams[0].height,
                size: info.streams[0].size,
                duration: info.streams[0].duration,
                videoPath: outputPath,
            })
            video.save();

        })
    }).catch((error) => {
        console.log('Error:', error);
    });
}

module.exports = {
    transcodeVideo,
}
