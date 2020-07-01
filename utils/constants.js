module.exports = {
  fixedPoint : Math.pow(10, 10),
  defaultCurrency: 'BEL', // default currency symbole for Belrium
  totalSupply: 2100000000000000000,
  URL: "http://localhost:9305",
  admin: {
    secret: "frozen hour curious thunder relief accuse soccer region resource marine juice chicken",
    countryCode: "IN"
  },
  cipher: {
    algorithm: "aes-256-cbc",
    key: "CentralServerSecret"
  },
  regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/,
  fees: {
    send: 0.001,
    inTransfer: 0.001,
    outTransfer: 0.001,
    registerResult: 0.001,
    registerUsers: 0,
    belShare: 0,
    updateUser: 0
  }
}
