import React from 'react'
import { Button, Segment } from 'semantic-ui-react'
import useAsync from './useAsync'
import { voteProposal } from '../api/dao'

const Proposal = ({ proposal, web3, account }) => {
  const oneWeek = 7 * 24 * 60 * 60 * 1000
  const creationDate = new Date(proposal.creationTimestamp * 1000)
  const lastVoteDate = new Date(creationDate.getTime() + oneWeek)

  const { pending, execute } = useAsync(async (params) => {
    if (!web3) {
      throw new Error('No web3 instance available.')
    }

    await voteProposal(web3, account, params)
  })

  const getStatus = (statusIndex) => {
    switch (statusIndex) {
      case 0:
        return 'Pending'
      case 1:
        return 'Approved'
      case 2:
        return 'Rejected'
      default:
        return
    }
  }

  const onYeaClick = async () => {
    console.log(pending)
    if (pending) {
      return
    }

    await execute({ proposalHash: proposal.docHash, vote: 0 })
  }

  const onNayClick = async () => {
    console.log(pending)
    if (pending) {
      return
    }

    await execute({ proposalHash: proposal.docHash, vote: 1 })
  }

  return (
    <Segment secondary style={{ marginBottom: '1em' }}>
      <p>Creator: {proposal.creator}</p>
      <p>Document Hash: {proposal.docHash}</p>
      <p>Created at: {creationDate.toLocaleString()}</p>
      <p>Open to vote until: {lastVoteDate.toLocaleString()}</p>
      <p>
        Yea: {proposal.yea} Nay: {proposal.nay}
      </p>
      <p>Status: {getStatus(proposal.status)}</p>
      <div>
        Vote:{' '}
        <Button color="green" onClick={onYeaClick}>
          Yea
        </Button>
        <Button color="red" onClick={onNayClick}>
          Nay
        </Button>
      </div>
    </Segment>
  )
}

const Proposals = ({ proposals, web3, account }) => {
  return (
    <Segment.Group>
      {proposals &&
        proposals.map((proposal) => (
          <div key={proposal.docHash}>
            <Proposal proposal={proposal} web3={web3} account={account} />
          </div>
        ))}
    </Segment.Group>
  )
}

export default Proposals
