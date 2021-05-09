const Dao = artifacts.require('Dao')
const Token = artifacts.require('Token')

module.exports = function (deployer) {
  deployer.deploy(Token).then(() => {
    return deployer.deploy(Dao, Token.address)
  })
}
