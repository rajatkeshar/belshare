var constants = require('../utils/constants.js');

module.exports = {
  registerUsers: async function(address, secret, phoneNo, email, password, role, hash, countryCode) {
    console.log("calling contract registerUsers: ", this);
    app.sdb.lock('users.registerUsers@' + phoneNo);
    let exists = await app.model.Users.exists({phoneNo: phoneNo});
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
  },
  confirmPassword: async function(phoneNo, password) {
    console.log("calling contract confirmPassword: ", this);
    app.sdb.lock('users.confirmPassword@' + phoneNo);
    let exists = await app.model.Users.exists({phoneNo: phoneNo});
    console.log("exists: ", exists);
    if (!exists) return 'invalid user';
    app.sdb.update('User', { password: password }, {phoneNo: phoneNo});
  }
}
