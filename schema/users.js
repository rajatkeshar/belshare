'use strict';

var constants = require('../utils/constants.js');

module.exports = {
  registerUsers: {
    type: 'object',
      properties: {
        phoneNo: {
          type: "number",
          minLength: 10,
          maxLength: 10
        },
        email: {
          type: "string"
        },
        password: {
          type: "string"
        },
        role: {
          type: "string",
          enum: ["admin", "merchant", "user"]
        },
        hash: {
          type: "string",
          maxLength: 256
        },
        countryCode: {
          type: 'string',
          minLength: 2,
          maxLength: 2
        }
      },
      required: ['phoneNo', 'password', 'role', 'countryCode']
  }
};
