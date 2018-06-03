var Sentencer = require('sentencer');
var LegacyWebServices = function() {
    var self = this;

    self.LegacyClone = function(args, callback, headers, req) {
        // console.log('SOAP `LegacyClone` request from ' + req.connection.remoteAddress);
        // console.log('Hola sync LegacyClone:' + JSON.stringify(args));
        // console.log(req);
        var caseObj = JSON.parse(args.param2);
        var sentence = Sentencer.make('The Case Number ' + caseObj.CaseNumber + ' is {{adjective}} cloned at legacy system');
        console.log(sentence);
        return {
            DummyResult: sentence
        };
    }
    self.LegacyValidations = function(args, callback, headers, req) {
        // console.log('SOAP `LegacyValidations` request from ' + req.connection.remoteAddress);
        // console.log('Hola sync LegacyValidations:' + args);
        var caseObj = JSON.parse(args.param2);
        var sentence = Sentencer.make('The Case Number ' + caseObj.CasNumber + ' validations has been {{adjective}} executed');
        console.log(sentence);
        return {
            DummyResult: sentence
        };
    }
    self.LegacyCalculations = function(args, callback, headers, req) {
        // console.log('SOAP `LegacyCalculations` request from ' + req.connection.remoteAddress);
        // console.log('Hola sync LegacyCalculations:' + args);
        var caseObj = JSON.parse(args.param2);
        var sentence = Sentencer.make('The Case Number ' + caseObj.CasNumber + ' calculations has been {{adjective}} executed, take this {{adjective}} result');
        console.log(sentence);
        return {
            DummyResult: sentence
        };
    }
    self.LegacySaveResult = function(args, callback, headers, req) {
        // console.log('SOAP `LegacySaveResult` request from ' + req);
        // console.log('Hola sync LegacySaveResult:' + args);
        var caseObj = JSON.parse(args.param2);
        var sentence = Sentencer.make('The Case Number ' + caseObj.CasNumber + ' salesforce result has been {{adjective}} saved at the legacy system');
        console.log(sentence);
        return {
            DummyResult: sentence
        };
    }

    self.LegacyCloneService = {
        LegacyCloneService: {
            LegacyPortType: {
                LegacyClone: self.LegacyClone,
            }
        }
    };
    self.LegacyValidationsService = {
        LegacyValidationsService: {
            LegacyPortType: {
                LegacyValidations: self.LegacyValidations,
            }
        }
    };
    self.LegacyCalculationsService = {
        LegacyCalculationsService: {
            LegacyPortType: {
                LegacyCalculations: self.LegacyCalculations,
            }
        }
    };
    self.LegacySaveResultService = {
        LegacySaveResultService: {
            LegacyPortType: {
                LegacySaveResult: self.LegacySaveResult,
            }
        }
    };
};
module.exports = LegacyWebServices;