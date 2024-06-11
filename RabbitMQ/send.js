const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }
        const queue = 'emailQueue';
        const msg = JSON.stringify({ to: 'example@example.com', subject: 'Hello', text: 'Hello world!' });

        channel.assertQueue(queue, {
            durable: true
        });

        channel.sendToQueue(queue, Buffer.from(msg), {
            persistent: true
        });

        console.log(" [x] Sent %s", msg);
    });
});
