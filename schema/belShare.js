'use strict';

var constants = require('../utils/constants.js');

module.exports = {
  belShare: {
    type: 'object',
      properties: {
        password: {
          type: "string",
          minLength: 1,
          maxLength: 100
        },
        userId: {
          type: "number",
          minLength: 10,
          maxLength: 10
        },
        merchantId: {
          minLength: 10,
          maxLength: 10
        },
        desc: {
          type: "string",
          maxLength: 256
        },
        countryCode: {
          type: 'string',
          minLength: 2,
          maxLength: 2
        }
      },
      required: ['userId', 'merchantId', 'password', 'countryCode']
  },
  verifyBelShare: {
    type: 'object',
      properties: {
        password: {
          type: "string",
          minLength: 1,
          maxLength: 100
        },
        phoneNo: {
          type: "number",
          minLength: 10,
          maxLength: 10
        }
      },
      required: ['phoneNo', 'password']
  }
};
