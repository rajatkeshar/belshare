module.exports = {
    name: 'users',
    fields: [
      {
        name: 'address',
        type: 'String',
        length: 256,
        not_null: true,
        index: true
      },
      {
        name: 'secret',
        type: 'String',
        length: 256,
        not_null: true,
        index: true
      },
      {
        name: 'email',
        type: 'String',
        length: 256,
        index: true
      },
      {
        name: 'phoneNo',
        type: 'Number',
        length: 10,
        not_null: true,
        index: true,
        unique: true
      },
      {
        name: 'role',
        type: 'String',
        length: 256,
        default: "user",
        enum: ["admin", "merchant", "user"]
      },
      {
        name: 'password',
        type: 'String',
        length: 256
      },
      {
        name: 'status',
        type: 'Boolean',
        default: true
      },
      {
        name: 'token',
        type: 'String',
        length: 256
      },
      {
        name: 'hash',
        type: 'String',
        length: 256
      },
      {
        name: 'countryCode',
        type: 'String',
        length: 2
      },
      {
        name: 'transactionId',
        type: 'String',
        length: 256
      }
    ]
  }
