module.exports = {
    name: 'bel_shares',
    fields: [
      {
        name: 'userId',
        type: 'Number',
        length: 10,
        not_null: true,
        index: true,
      },
      {
        name: 'merchantId',
        type: 'Number',
        length: 10,
        not_null: true,
        index: true
      },
      {
        name: 'desc',
        type: 'String',
        length: 256
      },
      {
        name: 'countryCode',
        type: 'String',
        length: 2
      },
      {
        name: 'timestamp',
        type: 'Number'
      },
      {
        name: 'transactionId',
        type: 'String',
        length: 256
      },
      {
        name: 'senderId',
        type: 'String',
        length: 50,
        not_null: true,
      }
    ]
  }
