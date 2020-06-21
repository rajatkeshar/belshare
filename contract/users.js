var constants = require('../utils/constants.js');

module.exports = {
  registerUsers: async function(address, secret, phoneNo, email, password, role, hash, countryCode) {
    console.log("calling contract registerUsers: ", this);
    app.sdb.lock('users.registerUsers@' + phoneNo);
    let exists = await app.model.Users.exists({phoneNo: phoneNo, email: email});
    console.log("exists: ", exists);
    if (exists) return 'user already registered';
    app.sdb.create('User', {
      address: address,
      secret: secret,
      phoneNo: phoneNo,
      email: email,
      password: password,
      role: role,
      hash: hash,
      countryCode: countryCode,
      transactionId: this.trs.id
    });
  }
}
