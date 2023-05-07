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
                console.log(" [x] Received %s", videoId);
                // get video info with videoId mongodb query
                const video = await Video.findById(videoId);
                // transcode video
                 const videoPath = video.videoPath;
                const outputPath = `static/video/output${videoId}${Math.floor(Math.random() * 10)}.mp4`;

                const process = new ffmpeg(videoPath);
                process.then((video) => {
                    return new Promise((resolve, reject) => {
                        video.setVideoSize('640x?').save(outputPath, (error, file) => {
                            if (!error) {
                                resolve(file);
                            } else {
                                reject(error);
                            }
                        });
                    });
                }).then((file) => {
                    // get transcoded video info by ffprobe
                    ffprobe(file, { path: ffprobeStatic.path }).then(info => {
                        video.status = "done";
                        video.transcodedVideos.push({
                            resolution: info.streams[0].width + "x" + info.streams[0].height,
                            size: info.streams[0].size,
                            duration: info.streams[0].duration,
                            videoPath: outputPath,
                        })
                        video.save();
                    })
                    channel.ack(msg);
                }).catch((error) => {
                    console.log('Error:', error);
                });

            }, {
                noAck: false
            });
        });
    })
};

module.exports = {
    transcodeVideo,
}
