var crypto = require('crypto');
var belriumJS = require('belrium-js');
var ed = require('../utils/ed.js');
var httpCall = require('../utils/httpCall.js');
var constants = require('../utils/constants.js');
var schema = require('../schema/transactions.js');
var addressHelper = require('../utils/address.js');
var z_schema = require('../utils/zschema-express.js');
var TransactionTypes = require('../utils/transaction-types.js');

// Get Unconfirmed Transactions
app.route.get('/transaction/unconfirmed',  async function (req) {
    var dappId = req.query.dappId;
    var offset = (req.query.offset)? req.query.offset: 0;
    var limit = (req.query.limit)? req.query.limit: 20;

    var res = await httpCall.call('GET', `/api/dapps/${dappId}/transactions/unconfirmed?offset=${offset}&limit=${limit}`);
    var addresses = new Set();

    res.transactions.forEach(function(trs, index) {
        trs.args = JSON.parse(trs.args);
        trs.recipientId = addressHelper.isBase58CheckAddress(trs.args[trs.args.length-1])? trs.args[trs.args.length-1]: null;
        trs.currency = trs.args[0];
        trs.amount = parseInt(trs.args[1]);

        addresses.add(trs.senderId);
        addresses.add(trs.recipientId);
        delete trs.args;
    });

    var response = await httpCall.call('GET', `/api/accounts/info?address=${addresses}`);

    if(!response) {
        return response;
    }

    response.info.forEach(function(row, index1) {
        res.transactions.forEach(function(trs, index2) {
            if(row.address == trs.senderId) {
                trs.senderCountryCode = row.countryCode;
                trs.senderId = trs.senderId + ((row && row.countryCode)? row.countryCode: '');
            }
            if(row.address == trs.recipientId) {
                trs.recepientCountryCode = row.countryCode;
                trs.recipientId = trs.recipientId + ((row && row.countryCode)? row.countryCode: '');
                //trs.args[trs.args.length-1] = addressHelper.isBase58CheckAddress(trs.args[trs.args.length-1])? trs.args[trs.args.length-1].concat((row && row.countryCode)? row.countryCode: ''): null;
            }
        });
    });

    return res;
});

// Get Transactions by transactionId
app.route.get('/transaction/confirmed',  async function (req) {
    var dappId = req.query.dappId;
    var offset = (req.query.offset)? req.query.offset: 0;
    var limit = (req.query.limit)? req.query.limit: 20;

    var res = await httpCall.call('GET', `/api/dapps/${dappId}/transactions?offset=${offset}&limit=${limit}`);
    var addresses = new Set();

    res.transactions.forEach(function(trs, index) {
        trs.args = JSON.parse(trs.args);
        trs.recipientId = addressHelper.isBase58CheckAddress(trs.args[trs.args.length-1])? trs.args[trs.args.length-1]: null;
        trs.currency = trs.args[0];
        trs.amount = parseInt(trs.args[1]);

        addresses.add(trs.senderId);
        addresses.add(trs.recipientId);
        delete trs.args;
    });

    var response = await httpCall.call('GET', `/api/accounts/info?address=${Array.from(addresses)}`);

    if(!response) {
        return response;
    }

    response.info.forEach(function(row, index1) {
        res.transactions.forEach(function(trs, index2) {
            if(row.address == trs.senderId) {
                trs.senderCountryCode = row.countryCode;
                trs.senderId = trs.senderId + ((row && row.countryCode)? row.countryCode: '');
            }
            if(row.address == trs.recipientId) {
                trs.recepientCountryCode = row.countryCode;
                trs.recipientId = trs.recipientId + ((row && row.countryCode)? row.countryCode: '');
                //trs.args[trs.args.length-1] = addressHelper.isBase58CheckAddress(trs.args[trs.args.length-1])? trs.args[trs.args.length-1].concat((row && row.countryCode)? row.countryCode: ''): null;
            }
        });
    });

    return res;
});

// Get Internal Transactions
app.route.get('/transaction/transfers',  async function (req) {
    var dappId = req.query.dappId;
    var offset = (req.query.offset)? req.query.offset: 0;
    var limit = (req.query.limit)? req.query.limit: 20;

    var res = await httpCall.call('GET', `/api/dapps/${dappId}/transfers?offset=${offset}&limit=${limit}`);
    var addresses = new Set();

    res.transfers.forEach(function(trs, index) {
        addresses.add(trs.senderId);
        addresses.add(trs.recipientId);
    });

    var response = await httpCall.call('GET', `/api/accounts/info?address=${Array.from(addresses)}`);

    if(!response) {
        return response;
    }

    response.info.forEach(function(row, index1) {
        res.transfers.forEach(function(trs, index2) {
            if(row.address == trs.senderId) {
                trs.senderCountryCode = row.countryCode;
                trs.senderId = trs.senderId + ((row && row.countryCode)? row.countryCode: '');
            }
            if(row.address == trs.recipientId) {
                trs.recepientCountryCode = row.countryCode;
                trs.recipientId = trs.recipientId + ((row && row.countryCode)? row.countryCode: '');
            }
        });
    });

    return res;
});
