const amqp = require("amqplib/callback_api");
const ffmpeg = require('ffmpeg');
async function transcodeVideo() {
    await amqp.connect('amqp://localhost', async (error0, connection) => {
        await connection.createChannel(async (error1, channel) => {
            const queueName = 'video';
            await channel.assertQueue(queueName, { durable: false });
            channel.prefetch(1);
            channel.consume(queueName, (msg) => {
                const videoPath = 'static/video/1.mp4';
                const outputPath = `static/video/output${msg.content.toString()}${Math.floor(Math.random() * 10)}.mp4`;

                const process = new ffmpeg(videoPath);
                process.then((video) => {
                    return new Promise((resolve, reject) => {
                        video.setVideoSize('640x?').save(outputPath, (error, file) => {
                            if (!error) {
                                console.log('Video converted successfully!');
                                resolve(file);
                            } else {
                                reject(error);
                            }
                        });
                    });
                }).then((file) => {
                    console.log('File saved:', file);
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
