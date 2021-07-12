var amqp = require('amqplib/callback_api');

module.exports = {
    sendLog
}



function sendLog(topic, message) {

    return new Promise((resolve, reject) => {
        amqp.connect('amqp://localhost', function (error0, connection) {
            if (error0) {
                throw error0;
            }
            connection.createChannel(function (error1, channel) {
                if (error1) {
                    throw error1;
                }

                var exchange = 'logs';

                channel.assertExchange(exchange, 'topic', {
                    durable: true
                });

                try {
                    message = JSON.stringify(message);
                    channel.publish(exchange, topic, Buffer.from(message));
                    console.log(" [x] Sent %s: '%s'", topic, message);
                } catch (err) {
                    message = JSON.stringify(message);
                    channel.publish(exchange, 'error', Buffer.from('Errore nell\'invio del log.'));
                    //console.error(" [x] ERROR SENDING %s: '%s', (%s)", topic, message, err);
                }


            });

            setTimeout(function () {
                connection.close();
                //process.exit(0);
            }, 500);
        });
    })
}