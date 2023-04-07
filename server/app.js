const express = require('express')
const amqp = require('amqplib/callback_api');
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World!')
})

amqp.connect('amqp://localhost', (error0, connection) => {
    if (error0) {
        throw error0;
    }
    connection.createChannel((error1, channel) => {
        if (error1) {
            throw error1;
        }

        const queueName = 'my_queue';

        channel.assertQueue(queueName, {
            durable: false
        });
        channel.prefetch(1);
        for (let i = 0; i < 25; i++) {
            channel.sendToQueue(queueName, Buffer.from(`message ${i}`));
        }
        console.log(`[*] Waiting for messages in ${queueName}. To exit, press CTRL+C`);

        channel.consume(queueName, (msg) => {
            console.log(`[x] Received ${msg.content.toString()}`);

            // Simulate message processing time
            setTimeout(() => {
                console.log("[x] Done");
                channel.ack(msg); // Acknowledge message
            }, 2000);
        }, {
            noAck: false // Set noAck to false
        });
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})