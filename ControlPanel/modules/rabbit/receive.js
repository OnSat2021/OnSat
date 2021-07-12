var amqp = require('amqplib/callback_api');

module.exports = {
    getLogs
}

function getLogs(ws) {

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

            channel.assertQueue('', {
                exclusive: true
            }, function (error2, q) {
                if (error2) {
                    throw error2;
                }
                console.log(' [*] Attendo di leggere i log sul canale.');

                const topics = ['info', 'warning', 'error'];
                topics.forEach(function (key) {
                    console.log("Exchange: %s, key: %s", exchange, key);
                    channel.bindQueue(q.queue, exchange, key);
                });

                channel.consume(q.queue, function (msg) {
                    console.log(" [x] %s:'%s'", msg.fields.routingKey, msg.content.toString());
                    const result = {
                        body: msg.content.toString(),
                        type: msg.fields.routingKey
                    };

                    ws.send(JSON.stringify(result));
                    return;
                }, {
                    noAck: true
                });
            });
        });
    });

    /*  res.send({
          error_code: 1,
          error_desc: "Non ho letto niente."
      });*/

}