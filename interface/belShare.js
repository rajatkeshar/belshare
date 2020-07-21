var _ = require('lodash');
var crypto = require('crypto');
var belriumJS = require('belrium-js');
var assert = require('assert');
var ed = require('../utils/ed.js');
var util = require("../utils/util");
var aesUtil = require("../utils/aesUtil");
var Address = require('../utils/address.js');
var httpCall = require('../utils/httpCall.js');
var constants = require('../utils/constants.js');
var schema = require('../schema/belShare.js');
var addressHelper = require('../utils/address.js');
var z_schema = require('../utils/zschema-express.js');
var TransactionTypes = require('../utils/transaction-types.js');

app.route.put('/belshare',  async function (req) {
    let validateSchema = await z_schema.validate(req.query, schema.belShare);
    let countryCode = req.query.countryCode.toUpperCase();

    let exists = await app.model.Users.exists({phoneNo: req.query.merchantId, role: "merchant"});
    if (!exists) return 'merchant does not exists';

    let user = await app.model.Users.findOne({ condition: {phoneNo: req.query.userId} });
    if (!user) return 'userId does not exists';

    let decryptedPassword = aesUtil.decrypt(user.password, constants.cipher.key);
    if(!_.isEqual(decryptedPassword, req.query.password)) return "incorrect password";

    let options = {
        fee: String(constants.fees.belShare * constants.fixedPoint),
        type: TransactionTypes.BEL_SHARE,
        args: JSON.stringify([req.query.userId, req.query.merchantId, req.query.desc, req.query.countryCode])
    };

    let decryptedSecret = aesUtil.decrypt(user.secret, constants.cipher.key);
    let transaction = belriumJS.dapp.createInnerTransaction(options, decryptedSecret);
    let address =  Address.generateAddressWithCountryCode(Address.generateBase58CheckAddress(transaction.senderPublicKey), countryCode);

    let dappId = util.getDappID();
    let params = {
        transaction: transaction
    };

    console.log("belShare data: ", params);
    try {
      let res = await httpCall.call('PUT', `/api/dapps/${dappId}/transactions/signed`, params);
      return res;
    } catch (e) {
      return {"message": "something went wrong!"}
    }
});

app.route.put('/belshare/verify',  async function (req) {
    let validateSchema = await z_schema.validate(req.query, schema.verifyBelShare);

    let user = await app.model.Users.findOne({ condition: {phoneNo: req.query.phoneNo, role: "merchant"} });
    if (!user) return 'merchant does not exists';

    let checkStatus = await app.model.BelShare.findOne({ condition: { transactionId: req.query.transactionId, status: "verified"} });
    if (checkStatus) return 'transaction already verified';

    let decryptedPassword = aesUtil.decrypt(user.password, constants.cipher.key);
    if(!_.isEqual(decryptedPassword, req.query.password)) return "incorrect password";

    let options = {
        fee: String(constants.fees.belShare * constants.fixedPoint),
        type: TransactionTypes.VERIFY_BEL_SHARE,
        args: JSON.stringify([req.query.transactionId])
    };

    let decryptedSecret = aesUtil.decrypt(user.secret, constants.cipher.key);
    let transaction = belriumJS.dapp.createInnerTransaction(options, decryptedSecret);
    let dappId = util.getDappID();
    let params = {
        transaction: transaction
    };

    console.log("verify belShare data: ", params);
    try {
      let res = await httpCall.call('PUT', `/api/dapps/${dappId}/transactions/signed`, params);
      return res;
    } catch (e) {
      return {"message": "something went wrong!"}
    }
});

app.route.post('/belshare/user/:userId',  async function (req) {
    let offset =  req.query.offset || 0;
    let limit = req.query.limit || 20;
    let count = await app.model.BelShare.count({ userId: req.params.userId });
    let belShare = await app.model.BelShare.findAll({
        condition: { userId: req.params.userId },
        offset: offset,
        limit: limit
    });

    return {data: belShare, total: count, success: true};
});

app.route.post('/belshare/merchant/:merchantId',  async function (req) {
    let offset =  req.query.offset || 0;
    let limit = req.query.limit || 20;
    let count = await app.model.BelShare.count({ merchantId: req.params.merchantId, status: "pending" });
    let belShare = await app.model.BelShare.findAll({
        condition: { merchantId: req.params.merchantId, status: "pending"},
        offset: offset,
        limit: limit
    });

    return {data: belShare, total: count, success: true};
});
