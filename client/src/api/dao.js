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
  console.log('tokenInstance', tokenInstance)

  const accountBalance = await daoInstance.shares(account)
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
      yea: yea.toString(),
      nay: nay.toString(),
      status: status.toNumber(),
    })
  }
  return {
    daoInstance: daoInstance,
    contractAddress: daoInstance.address,
    proposals,
    accountBalance: accountBalance.toString(),
  }
}

export const createProposal = async (web3, account, params) => {
  const { proposalHash } = params

  dao.setProvider(web3.currentProvider)
  const daoInstance = await dao.deployed()
  console.log('proposalHash', proposalHash)
  console.log('params', params)

  const res = await daoInstance.newProposal(proposalHash, { from: account })
  console.log(res)
}

export const voteProposal = async (web3, account, params) => {
  const { proposalHash, vote } = params

  dao.setProvider(web3.currentProvider)
  const daoInstance = await dao.deployed()
  console.log('params', params)

  await daoInstance.vote(proposalHash, vote, { from: account })
}
