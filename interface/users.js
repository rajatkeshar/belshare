var _ = require('lodash')
var crypto = require('crypto');
var belriumJS = require('belrium-js');
var ed = require('../utils/ed.js');
var util = require("../utils/util");
var aesUtil = require("../utils/aesUtil");
var schema = require('../schema/users.js');
var httpCall = require('../utils/httpCall.js');
var constants = require('../utils/constants.js');
var addressHelper = require('../utils/address.js');
var z_schema = require('../utils/zschema-express.js');
var TransactionTypes = require('../utils/transaction-types.js');

app.route.put('/user',  async function (req) {
    let validateSchema = await z_schema.validate(req.query, schema.registerUsers);
    let countryCode = req.query.countryCode.toUpperCase();
    let wallet = await httpCall.call('GET', `/api/accounts/new?countryCode=` + countryCode);

    if(wallet && !wallet.success) return wallet;
    if(!req.query.password.match(constants.regex)) return  'Password must contain 6 to 20 at least one numeric digit, one uppercase and one lowercase letter';
    if(String(req.query.phoneNo).length != 10) return 'invalid phoneNo';

    let encryptedSecret = aesUtil.encrypt(wallet.secret, constants.cipher.key);
    let encryptedPassword = aesUtil.encrypt(req.query.password, constants.cipher.key);


    let options = {
      type: TransactionTypes.REGISTER_USER,
      fee: String(constants.fees.registerUsers * constants.fixedPoint),
      args: JSON.stringify([wallet.address, encryptedSecret, req.query.phoneNo, req.query.email, encryptedPassword, req.query.role, req.query.hash, req.query.countryCode])
    };

    let transaction = belriumJS.dapp.createInnerTransaction(options, constants.admin.secret);
    let dappId = util.getDappID();
    let params = {
        transaction: transaction
    };

    console.log("registerUser data: ", params);
    try {
      let res = await httpCall.call('PUT', `/api/dapps/${dappId}/transactions/signed`, params);
      if(!res.success) {
        return res;
      }
      return {transactionId: res.transactionId, wallet};
    } catch (e) {
      return {"message": "something went wrong!"}
    }
});

app.route.post('/users/role/:roleType',  async function (req) {
    let offset =  req.query.offset || 0;
    let limit = req.query.limit || 20;

    let users = await app.model.Users.findAll({
        offset: offset,
        limit: limit,
        condition: {role: req.params.roleType}
    });
    users = users.map(user => { return _.omit(user, ["secret", "password", "otp"])});
    return users;
});
