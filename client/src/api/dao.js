import TruffleContract from '@truffle/contract'
import DaoContract from '../contracts/Dao.json'
import TokenContract from '../contracts/Token.json'

const dao = TruffleContract(DaoContract)
const token = TruffleContract(TokenContract)

export const getDao = async (web3, account) => {
  dao.setProvider(web3.currentProvider)
  token.setProvider(web3.currentProvider)
  const daoInstance = await dao.deployed()
  const tokenInstance = await token.deployed()
  console.log('daoinmstance', daoInstance)
  const proposals = []
  const proposalHashes = Object.values(await daoInstance.getProposalHashes())
  const accountBalance = await tokenInstance.balanceOf(account)

  for (let i = 0; i < proposalHashes.length; i++) {
    const {
      creator,
      docHash,
      creationTimestamp,
      yea,
      nay,
      status,
    } = await daoInstance.getProposal(proposalHashes[i])

    proposals.push({
      creator,
      docHash,
      creationTimestamp: creationTimestamp.toString(),
      yea: yea.toNumber(),
      nay: nay.toNumber(),
      status: status.toNumber(),
    })
  }
  return {
    daoInstance: daoInstance,
    proposals,
    accountBalance: accountBalance.toString(),
  }
}

export const createProposal = async (daoInstance, account, params) => {
  const { proposalHash } = params
  console.log('dao', daoInstance)
  const res = await daoInstance.newProposal(proposalHash, { from: account })
  console.log(res)
}
