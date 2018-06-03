#!/usr/bin/env node

var SalesforceWS = require('./salesforceWS.js');
var amqp = require('amqplib/callback_api');
var url = process.env.CLOUDAMQP_URL || "amqp://localhost";
amqp.connect(url, function(err, conn) {
    conn.createChannel(function(err, ch) {
        var q = 'casePhaseNotificationQueue';

        // ch.assertQueue(q, {durable: true});
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
        ch.consume(q, function(msg) {
            var content = msg.content.toString();
            console.log(" [x] Received %s", content);
            var notif = JSON.parse(content);
            console.log(notif.OrganizationId);
            console.log(notif.ActionId);
            console.log(notif.SessionId);
            console.log(notif.EnterpriseUrl);
            console.log(notif.PartnerUrl);
            console.log(notif.Notification);
            console.log(notif.Notification.Id);
            console.log(notif.Notification.sObject.Id);
            console.log(notif.Notification.sObject.Phase__c);
            switch (notif.Notification.sObject.Phase__c) {
                case 'Analyze':
                    var sfdcws = new SalesforceWS();
                    sfdcws.callToAnalyzeCaseWS(notif);
                    break;
                case 'Validations':
                    var sfdcws = new SalesforceWS();
                    sfdcws.callToValidationsCaseWS(notif);
                    break;
                case 'Calculations':
                    break;
                case 'SaveResult':
                    break;
            }
        }, { noAck: true });
    });
});