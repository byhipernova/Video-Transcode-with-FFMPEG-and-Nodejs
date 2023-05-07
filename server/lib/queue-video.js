const amqp = require("amqplib/callback_api");
async function queueVideo(id) {
    await amqp.connect('amqp://localhost', (error0, connection) => {
        connection.createChannel((error1, channel) => {
            const queueName = 'video';
            channel.assertQueue(queueName, {
                durable: false
            });
            console.log(" [x] Sent %s", id);
            channel.sendToQueue(queueName, Buffer.from(id));
        });
    })
};

module.exports = {
    queueVideo,
}

