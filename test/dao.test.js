const { expect } = require('chai')
const chai = require('chai')
chai.use(require('chai-as-promised'))

const Dao = artifacts.require('Dao')
const Token = artifacts.require('Token')

const BN = web3.utils.BN
const chaiBN = require('chai-bn')(BN)
chai.use(chaiBN)

const PROPOSAL_HASH_EXAMPLE = '0x7465737400000000000000000000000000000000000000000000000000000000'

contract('DAO Contract', (accounts) => {
  let wallet
  beforeEach(async () => {
    token = await Token.new()
    dao = await Dao.new(token.address)

    await token.transfer(accounts[0], web3.utils.toWei('1', 'ether'), {
      from: accounts[0],
    })
    await token.approve(dao.address, web3.utils.toWei('1', 'ether'), {
      from: accounts[0],
    })
  })

  describe('deposit()', () => {
    it('should update shares of a contract', async () => {
      await dao.deposit(web3.utils.toWei('1', 'ether'), { from: accounts[0] })

      await expect(await dao.shares(accounts[0])).to.be.a.bignumber.equal(
        web3.utils.toWei('1', 'ether'),
      )
    })

    it('should not update shares if account balance is not sufficient', async () => {
      await expect(
        dao.deposit(web3.utils.toWei('2', 'ether'), { from: accounts[0] }),
      ).to.be.rejectedWith(/exceeds allowance/)
    })
  })

  describe('withdraw()', () => {
    beforeEach(async () => {
      await dao.deposit(web3.utils.toWei('1', 'ether'), { from: accounts[0] })
    })

    it('should withdraw successfully', async () => {
      await dao.withdraw(web3.utils.toWei('1', 'ether'), { from: accounts[0] })

      await expect(await dao.shares(accounts[0])).to.be.a.bignumber.equal(
        new BN(0),
      )
    })

    it('should not withdraw if account balance is not sufficient', async () => {
        await expect(
         dao.withdraw(web3.utils.toWei('2', 'ether'), { from: accounts[0] }),
      ).to.be.rejectedWith(/not enough shares/)
    })
  })

  describe('newProposal()', () => {
    beforeEach(async () => {
      await dao.deposit(web3.utils.toWei('1', 'ether'), { from: accounts[0] })
    })

    it('should create proposal successfully', async () => {

      await expect( dao.newProposal(PROPOSAL_HASH_EXAMPLE)).to.be.fulfilled
    })
    it('should not create proposal if already exists', async () => {
        await dao.newProposal(PROPOSAL_HASH_EXAMPLE)
        await expect( dao.newProposal(PROPOSAL_HASH_EXAMPLE)).to.be.rejectedWith(/proposal already exist/)
      })
  })

  
})
