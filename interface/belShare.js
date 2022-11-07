var _ = require('lodash');
var belriumJS = require('belrium-js');
var util = require("../utils/util");
var aesUtil = require("../utils/aesUtil");
var httpCall = require('../utils/httpCall.js');
var apiCall = require('../utils/apiCall.js');
var constants = require('../utils/constants.js');
var schema = require('../schema/belShare.js');
var addressHelper = require('../utils/address.js');
var z_schema = require('../utils/zschema-express.js');
var TransactionTypes = require('../utils/transaction-types.js');

app.route.put('/belshare',  async function (req) {
    let validateSchema = await z_schema.validate(req.query, schema.belShare);
    let countryCode = req.query.countryCode.toUpperCase();
    req.query.dappName = app.config.dappName;

    let merchantQuery = { phoneNo: req.query.merchantId, dappName: req.query.dappName, role: "merchant" };
    if(req.query.merchantEmailId) { merchantQuery.email = req.query.merchantEmailId}

    let merchantInfo = await apiCall.call(constants.CENTRAL_PROFILE_URL, "POST", `/api/dapps/${constants.centralProfileDappId}/users/info`, merchantQuery);
    if (merchantInfo.customCode == 4000) return { customCode: 4006, message: 'merchant does not exists' };

    let userQuery = { phoneNo: req.query.userId, dappName: req.query.dappName, role: "user" };
    if(req.query.userEmailId) { userQuery.email = req.query.userEmailId }

    let userInfo = await apiCall.call(constants.CENTRAL_PROFILE_URL, "POST", `/api/dapps/${constants.centralProfileDappId}/users/info`, userQuery);
    if (userInfo.customCode == 4000) return { customCode: 4005, message: 'userId does not exists' };

    let decryptedPassword = aesUtil.decrypt(userInfo.password, constants.cipher.key);
    if(!_.isEqual(decryptedPassword, req.query.password)) return { customCode: 4007, message: "incorrect password" };

    let options = {
        fee: String(constants.fees.belShare * constants.fixedPoint),
        type: TransactionTypes.BEL_SHARE,
        args: JSON.stringify([req.query.userId, req.query.merchantId, req.query.desc, countryCode])
    };

    let decryptedSecret = aesUtil.decrypt(userInfo.secret, constants.cipher.key);
    let transaction = belriumJS.dapp.createInnerTransaction(options, decryptedSecret);
    //let address =  addressHelper.generateAddressWithCountryCode(addressHelper.generateBase58CheckAddress(transaction.senderPublicKey), countryCode);

    let dappId = util.getDappID();
    let params = {
        transaction: transaction
    };

    console.log("belShare data: ", params);
    try {
      let res = await httpCall.call('PUT', `/api/dapps/${dappId}/transactions/signed`, params);
      return res;
    } catch (e) {
      return {customCode: 3001, message: "something went wrong!"}
    }
});

app.route.put('/belshare/verify',  async function (req) {
    let validateSchema = await z_schema.validate(req.query, schema.verifyBelShare);

    req.query.dappName = app.config.dappName;
    let userQuery = { phoneNo: req.query.phoneNo, dappName: req.query.dappName, role: "merchant" };
    if(req.query.email) {userQuery.email = req.query.email }
    
    let merchantInfo = await apiCall.call(constants.CENTRAL_PROFILE_URL, "POST", `/api/dapps/${constants.centralProfileDappId}/users/info`, userQuery);
    if (merchantInfo.customCode == 4000) return { customCode: 4006, message: 'merchant does not exists' };

    let checkStatus = await app.model.BelShare.findOne({ condition: { transactionId: req.query.transactionId, status: "verified"} });
    if (checkStatus) return {customCode: 2002, message: 'transaction already verified' };

    let decryptedPassword = aesUtil.decrypt(merchantInfo.password, constants.cipher.key);
    if(!_.isEqual(decryptedPassword, req.query.password)) return { customCode: 4007, message: "incorrect password" };

    let options = {
        fee: String(constants.fees.belShare * constants.fixedPoint),
        type: TransactionTypes.VERIFY_BEL_SHARE,
        args: JSON.stringify([req.query.transactionId])
    };

    let decryptedSecret = aesUtil.decrypt(merchantInfo.secret, constants.cipher.key);
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
      return {customCode: 3001, message: "something went wrong!"}
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
