const amqp = require('amqplib/callback_api');
const nodemailer = require('nodemailer');

amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }
        const queue = 'emailQueue';

        channel.assertQueue(queue, {
            durable: true
        });

        channel.consume(queue, function(msg) {
            const email = JSON.parse(msg.content.toString());

            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'your-email@gmail.com',
                    pass: 'your-email-password'
                }
            });

            let mailOptions = {
                from: 'your-email@gmail.com',
                to: email.to,
                subject: email.subject,
                text: email.text
            };

            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                    channel.ack(msg);
                }
            });
        }, {
            noAck: false
        });
    });
});
