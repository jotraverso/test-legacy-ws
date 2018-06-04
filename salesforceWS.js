var http = require('http');
var soap = require('soap');
var Sentencer = require('sentencer');
const express = require('express');
var LegacyWebServices = require('./legacy-services.js');
var SalesforceWS = function() {
    var self = this;
    self.callToAnalyzeCaseWS = function(notif) {
        soap.createClient('./remote-wsdl/AnalyzeCaseWS.wsdl', function(err, client) {
            var legacyWS = new LegacyWebServices();
            var result = legacyWS.LegacyClone({
                param1: notif.Notification.sObject.Id,
                param2: JSON.stringify(notif.Notification.sObject),
            });
            client.addSoapHeader({ SessionHeader: { sessionId: notif.SessionId } }, '', 'tns', '');
            var partnerURL = notif.PartnerUrl;
            var serviceUrl = '/services/Soap/class/AnalyzeCaseWS';
            var salesforceHost = partnerURL.substr(0, partnerURL.indexOf('/services/Soap'));
            client.setEndpoint(salesforceHost + serviceUrl);
            client.caseAnalysisResult({
                result: {
                    analyzeResult: result.DummyResult,
                    caseId: notif.Notification.sObject.Id,
                    error: 'false',
                    errorMessage: '',
                    returnCode: '00',
                }
            }, function(error, result, raw) {
                console.log('Request Done: ' + JSON.stringify(result));
                if (error && result.statusCode != 200) {
                    console.log('Error en la peticion: ' + result.statusCode + '\n' +
                        'Request: ' + result.request.body + '\nResponse: ' + raw);
                }
            });
        });
    };
    self.callToValidationsCaseWS = function(notif) {
        soap.createClient('./remote-wsdl/ValidationsCaseWS.wsdl', function(err, client) {
            var legacyWS = new LegacyWebServices();
            var result = legacyWS.LegacyValidations({
                param1: notif.Notification.sObject.Id,
                param2: JSON.stringify(notif.Notification.sObject),
            });
            client.addSoapHeader({ SessionHeader: { sessionId: notif.SessionId } }, '', 'tns', '');
            var partnerURL = notif.PartnerUrl;
            var serviceUrl = '/services/Soap/class/ValidationsCaseWS';
            var salesforceHost = partnerURL.substr(0, partnerURL.indexOf('/services/Soap'));
            client.setEndpoint(salesforceHost + serviceUrl);
            client.caseValidationsResult({
                result: {
                    analyzeResult: result.DummyResult,
                    caseId: notif.Notification.sObject.Id,
                    error: 'false',
                    errorMessage: '',
                    returnCode: '00',
                }
            }, function(error, result, raw) {
                console.log('Request Done: ' + JSON.stringify(result));
                if (error && result.statusCode != 200) {
                    console.log('Error en la peticion: ' + result.statusCode + '\n' +
                        'Request: ' + result.request.body + '\nResponse: ' + raw);
                }
            });
        });
    };
    self.callToCaseCalculationsResultWS = function(notif) {
        soap.createClient('./remote-wsdl/CalculationsCaseWS.wsdl', function(err, client) {
            var legacyWS = new LegacyWebServices();
            var result = legacyWS.LegacyCalculations({
                param1: notif.Notification.sObject.Id,
                param2: JSON.stringify(notif.Notification.sObject),
            });
            client.addSoapHeader({ SessionHeader: { sessionId: notif.SessionId } }, '', 'tns', '');
            var partnerURL = notif.PartnerUrl;
            var serviceUrl = '/services/Soap/class/CalculationsCaseWS';
            var salesforceHost = partnerURL.substr(0, partnerURL.indexOf('/services/Soap'));
            client.setEndpoint(salesforceHost + serviceUrl);
            var isSuccess = Math.random() <= 0.95;
            var rndErrorMessage = isSuccess ? '' : Sentencer.make('The results saving for Case Number ' + caseObj.CaseNumber + ' is {{adjective}} failed');
            client.caseCalculationsResult({
                result: {
                    analyzeResult: result.DummyResult,
                    caseId: notif.Notification.sObject.Id,
                    error: isSuccess ? 'false' : 'true',
                    errorMessage: rndErrorMessage,
                    returnCode: isSuccess ? '00' : ('' + Math.floor(Math.random() * 90 + 10)),
                }
            }, function(error, result, raw) {
                console.log('Request Done: ' + JSON.stringify(result));
                if (error && result.statusCode != 200) {
                    console.log('Error en la peticion: ' + result.statusCode + '\n' +
                        'Request: ' + result.request.body + '\nResponse: ' + raw);
                }
            });
        });
    };
    self.callToCaseSaveResultWS = function(notif) {
        soap.createClient('./remote-wsdl/SaveResultsWS.wsdl', function(err, client) {
            var legacyWS = new LegacyWebServices();
            var isSuccess = true;
            var result;
            try {
                result = legacyWS.LegacySaveResult({
                    param1: notif.Notification.sObject.Id,
                    param2: JSON.stringify(notif.Notification.sObject),
                });
            } catch(ex) {
                isSuccess = false;
            }
            client.addSoapHeader({ SessionHeader: { sessionId: notif.SessionId } }, '', 'tns', '');
            var partnerURL = notif.PartnerUrl;
            var serviceUrl = '/services/Soap/class/SaveResultsWS';
            var salesforceHost = partnerURL.substr(0, partnerURL.indexOf('/services/Soap'));
            client.setEndpoint(salesforceHost + serviceUrl);

            var rndErrorMessage = isSuccess ? '' : Sentencer.make('The results saving for Case Number ' + caseObj.CaseNumber + ' is {{adjective}} failed');
            client.caseSaveResults({
                result: {
                    analyzeResult: isSuccess ? result.DummyResult : '',
                    caseId: notif.Notification.sObject.Id,
                    error: isSuccess ? 'false' : 'true',
                    errorMessage: rndErrorMessage,
                    returnCode: isSuccess ? '00' : ('' + Math.floor(Math.random() * 90 + 10)),
                }
            }, function(error, result, raw) {
                console.log('Request Done: ' + JSON.stringify(result));
                if (error && result.statusCode != 200) {
                    console.log('Error en la peticion: ' + result.statusCode + '\n' +
                        'Request: ' + result.request.body + '\nResponse: ' + raw);
                }
            });
        });
    };
};
module.exports = SalesforceWS;
/*
var str = '{"OrganizationId":"orgID","ActionId":"actionId","SessionId":"00D1r000002d1W6!ARcAQPiGFRVwLxYkTOFEzSu3AtGT8VvgTs_Ju8BCUSDUdQFCCHJsSU1q_wpkc_pnae8gqi_8.jPJ95dAJ27b0Cki4M.BQLzQ","EnterpriseUrl":"https://enterprise","PartnerUrl":"https://legacy-ws-demo-dev-ed.my.salesforce.com/services/Soap/u/42.0/00D1r000002d1W6","Notification":{"Id":"198273981","sObject":{"Id":"5001r000020CMSQAA4","AccountId":"asdasdas","CaseNumber":"00001026","ClosedDate":"2018-05-31T00:00:00.000Z","OwnerId":"12312123","ParentId":"weqweqwe","Phase__c":"phase1","Product__c":"123123123","Status":"open","Subject":"Solicitud de acceso","Type":"Acceso"}}}';
var notif = JSON.parse(str);
callToAnalyzeCaseWS(notif);*/