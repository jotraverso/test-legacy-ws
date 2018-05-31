#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
var url = process.env.CLOUDAMQP_URL || "amqp://localhost";
amqp.connect(url, function(err, conn) {
  conn.createChannel(function(err, ch) {
    var q = 'casePhaseNotificationQueue';

    ch.assertQueue(q, {durable: false});
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
    ch.consume(q, function(msg) {
      console.log(" [x] Received %s", msg.content.toString());
    }, {noAck: true});
  });
});