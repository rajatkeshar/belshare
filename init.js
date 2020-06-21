var config = require('../../dappsConfig.json');
module.exports = async function () {
  console.log('init belshare dapp')

  var contractObjects = {
      registerUsers: {
          type: 5001,
          name: "register users",
          location: 'users.registerUsers'
      },
      belShare: {
          type: 5002,
          name: "belShare",
          location: 'bel_share.belShare'
      }
  }
  console.log("app: ", app.contract);
  for(i in contractObjects){
      app.registerContract(contractObjects[i].type, contractObjects[i].location);
  }
  app.setDefaultFee(config.defaultFee, 'BEL');

  app.events.on('newBlock', (block) => {
    console.log('new block received', block.height)
  })
}
