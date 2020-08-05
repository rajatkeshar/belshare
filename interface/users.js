var _ = require('lodash')
var belriumJS = require('belrium-js');
var util = require("../utils/util");
var auth = require("../utils/auth");
var aesUtil = require("../utils/aesUtil");
var Address = require('../utils/address.js');
var httpCall = require('../utils/httpCall.js');
var apiCall = require('../utils/apiCall.js');
var constants = require('../utils/constants.js');
var addressHelper = require('../utils/address.js');
var z_schema = require('../utils/zschema-express.js');
var TransactionTypes = require('../utils/transaction-types.js');

app.route.put('/user',  async function (req) {
    req.query.dappName = app.config.dappName;
    let response = await apiCall.call(constants.CENTRAL_PROFILE_URL, "PUT", `/api/dapps/${constants.centralProfileDappId}/user`, req.query);
    return response;
})

app.route.put('/user/:token',  async function (req) {
    let response = await apiCall.call(constants.CENTRAL_PROFILE_URL, "PUT", `/api/dapps/${constants.centralProfileDappId}/user/${req.params.token}`, req.query);
    return response;
});

app.route.post('/users/login',  async function (req) {
  req.query.dappName = app.config.dappName;
  let response = await apiCall.call(constants.CENTRAL_PROFILE_URL, "POST", `/api/dapps/${constants.centralProfileDappId}/users/login`, req.query);
  return response;
});

app.route.post('/users/role/:roleType',  async function (req) {
  req.query.dappName = app.config.dappName;
  let response = await apiCall.call(constants.CENTRAL_PROFILE_URL, "POST", `/api/dapps/${constants.centralProfileDappId}/users/role/${req.params.roleType}`, req.query);
  return response;
});

app.route.post('/users/auth/forgetPassword',  async function (req) {
  req.query.dappName = app.config.dappName;
  let response = await apiCall.call(constants.CENTRAL_PROFILE_URL, "POST", `/api/dapps/${constants.centralProfileDappId}/users/auth/forgetPassword`, req.query);
  return response;
});

app.route.put('/users/auth/confirmPassword/:token',  async function (req) {
  let response = await apiCall.call(constants.CENTRAL_PROFILE_URL, "PUT", `/api/dapps/${constants.centralProfileDappId}/users/auth/confirmPassword/${req.params.token}`, req.query);
  return response;
});
