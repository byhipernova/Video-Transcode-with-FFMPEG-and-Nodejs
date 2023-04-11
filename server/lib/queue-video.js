const amqp = require("amqplib/callback_api");
async function queueVideo() {
    await amqp.connect('amqp://localhost', (error0, connection) => {
        connection.createChannel((error1, channel) => {
            const queueName = 'video';
            channel.assertQueue(queueName, {
                durable: false
            });
            for (let i = 0; i < 10; i++) {
                    channel.sendToQueue(queueName, Buffer.from(`${Date.now()}${i}`));
            }
            console.log(`[*] Waiting for messages in ${queueName}. To exit, press CTRL+C`);
        });
    })
};

module.exports = {
    queueVideo,
}

