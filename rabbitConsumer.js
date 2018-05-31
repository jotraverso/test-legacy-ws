#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
var url = process.env.CLOUDAMQP_URL || "amqp://localhost";
amqp.connect(url, function(err, conn) {
  conn.createChannel(function(err, ch) {
    var q = 'casePhaseNotificationQueue';

    // ch.assertQueue(q, {durable: true});
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
    ch.consume(q, function(msg) {
      console.log(" [x] Received %s", msg.content.toString());
      console.log(msg.content['OrganizationId'])
		console.log(msg.content['OrganizationId']);
		console.log(msg.content['ActionId']);
		console.log(msg.content['SessionId']);
		console.log(msg.content['EnterpriseUrl']);
		console.log(msg.content['PartnerUrl']);
		console.log(msg.content['Notification']);

    }, {noAck: true});
  });
});