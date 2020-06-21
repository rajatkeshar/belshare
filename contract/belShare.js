var constants = require('../utils/constants.js');
module.exports = {
  belShare: async function(userId, merchantId, desc, countryCode) {
    console.log("calling contract registerResults: ", this);
    app.sdb.lock('belShare.belShare@' + userId);
    app.sdb.create('Belshare', {
      userId: userId,
      merchantId: merchantId,
      desc: desc,
      countryCode: countryCode,
      timestamp: this.trs.timestamp,
      transactionId: this.trs.id,
      senderId: this.trs.senderId + constants.admin.countryCode
    });
  }
}
