var constants = require('../utils/constants.js');
module.exports = {
  belShare: async function(userId, merchantId, desc, countryCode) {
    console.log("calling contract belShare: ", this);
    app.sdb.lock('belShare.belShare@' + this.trs.id);
    app.sdb.create('Belshare', {
      userId: userId,
      merchantId: merchantId,
      desc: desc,
      countryCode: countryCode,
      timestamp: this.trs.timestamp,
      transactionId: this.trs.id,
      senderId: this.trs.senderId + constants.admin.countryCode
    });
  },
  verifyBelShare: async function(transactionId) {
    console.log("calling contract verify belShare: ", this);
    app.sdb.lock('belShare.verifyBelShare@' + transactionId);
    app.sdb.update('Belshare', { status: "verified" }, { transactionId: transactionId });
  }
}
