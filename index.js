var http = require('http');
var soap = require('soap');
const express = require('express');
const basicAuth = require('express-basic-auth');
var app = express();


var outboundNotificationService = {
    NotificationService: {
        Notification: {
            notifications: function(args, cb, headers, req) {
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

var outboundNotificationWsdl = require('fs').readFileSync('wsdl/account-receiver.wsdl', 'utf8');
var dummyWsdl = require('fs').readFileSync('wsdl/dummy.wsdl', 'utf8');

var PORT = process.env.PORT ? process.env.PORT : 3000;

app.listen(PORT);
console.log('server running on port ' + PORT);

soap.listen(app, '/accountReceiver', outboundNotificationService, outboundNotificationWsdl);
soap.listen(app, '/dummyService', dummyService, dummyWsdl);
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