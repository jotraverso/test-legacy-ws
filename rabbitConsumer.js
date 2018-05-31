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
            var notif = JSON.parse(msg.content);
            console.log(notif['OrganizationId'])
            console.log(notif['OrganizationId']);
            console.log(notif['ActionId']);
            console.log(notif['SessionId']);
            console.log(notif['EnterpriseUrl']);
            console.log(notif['PartnerUrl']);
            console.log(notif['Notification']);
            console.log(notif['Notification'].Id);
            console.log(notif['Notification'].Object.Id);


        }, { noAck: true });
    });
});