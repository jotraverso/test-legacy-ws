var http = require('http');
var soap = require('soap');

const express = require('express');
const basicAuth = require('express-basic-auth');
var Sentencer = require('sentencer');
var LegacyWebServices = require('./legacy-services.js');
var app = express();
//publisher.js
var jackrabbit = require('jackrabbit');
// Get the URL from ENV or default to localhost
var url = process.env.CLOUDAMQP_URL || "amqp://localhost";

var outboundNotificationService = {
    NotificationService: {
        Notification: {
            notifications: function(args, callback, headers, req) {
                console.log('SOAP `reallyDetailedFunction` request from ' + req.connection.remoteAddress);
                console.log('Hola sync:' + args);
                return {
                    Ack: true
                };
            }
        }
    }
};

var dummyService = {
    DummyService: {
        DummyPortType: {
            Dummy: function(args, callback, headers, req) {

            },
            DummySave: function(args, callback, headers, req) {

            }
        }
    }

}

var casePhaseChangeService = {
    NotificationService: {
        Notification: {
            notifications: function(args, callback, headers, req) {
                console.log('Hola sync:' + JSON.stringify(args));
                // Connect to CloudAMQP
                var rabbit = jackrabbit(url);
                for(i in args['Notification']) {
                    singleMessage = {
                        OrganizationId: args['OrganizationId'],
                        ActionId: args['ActionId'],
                        SessionId: args['SessionId'],
                        EnterpriseUrl: args['EnterpriseUrl'],
                        PartnerUrl: args['PartnerUrl'],
                        Notification: args['Notification'][i],
                    };
                    console.log(JSON.stringify(singleMessage));
                    rabbit
                        .default()
                        .publish(singleMessage, { key: 'casePhaseNotificationQueue' })
                }
                rabbit.close();
                //Return  ACK to salesforce
                return {
                    Ack: true
                };
            }
        }
    }
};


var outboundNotificationWsdl = require('fs').readFileSync('wsdl/account-receiver.wsdl', 'utf8');
var casePhaseChangeWsdl = require('fs').readFileSync('wsdl/casePhaseChange.wsdl', 'utf-8');
var legacyCloneServicesWsdl = require('fs').readFileSync('wsdl/legacy-services-clone.wsdl', 'utf-8');
var legacyValidationsServicesWsdl = require('fs').readFileSync('wsdl/legacy-services-validations.wsdl', 'utf-8');
var legacyCalculationsServicesWsdl = require('fs').readFileSync('wsdl/legacy-services-calculations.wsdl', 'utf-8');
var legacySaveResultServicesWsdl = require('fs').readFileSync('wsdl/legacy-services-results.wsdl', 'utf-8');
var dummyWsdl = require('fs').readFileSync('wsdl/dummy.wsdl', 'utf8');

var PORT = process.env.PORT ? process.env.PORT : 3000;
var legacyWS = new LegacyWebServices();
app.listen(PORT, function() {
    console.log('server running on port ' + PORT);
    soap.listen(app, '/accountReceiver', outboundNotificationService, outboundNotificationWsdl);
    soap.listen(app, '/casePhaseChange', casePhaseChangeService, casePhaseChangeWsdl);
    soap.listen(app, '/dummyService', dummyService, dummyWsdl);
    soap.listen(app, '/legacyCloneService', legacyWS.LegacyCloneService, legacyCloneServicesWsdl);
    soap.listen(app, '/legacyValidationsService', legacyWS.LegacyValidationsService, legacyValidationsServicesWsdl);
    soap.listen(app, '/legacyCalculationsService', legacyWS.LegacyCalculationsService, legacyCalculationsServicesWsdl);
    soap.listen(app, '/legacySaveResultService', legacyWS.LegacySaveResultService, legacySaveResultServicesWsdl);
});
/*
app.use(basicAuth({
    users: {
        'admin': 'supersecret'
    },
    challenge: true,
    realm: 'heroku-test',
}));

app.get('/Node_Help_Sheet.pdf', function(req, res){
  res.download('Node_Help_Sheet.pdf');
});

app.post('/Node_Help_Sheet.pdf', function(req, res){
  res.download('Node_Help_Sheet.pdf');
});*/