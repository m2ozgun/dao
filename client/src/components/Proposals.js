import React, { Component } from 'react'
import { Divider, Button, Segment } from 'semantic-ui-react'

const Proposal = ({ proposal }) => {
  const oneWeek = 7 * 24 * 60 * 60 * 1000
  const creationDate = new Date(proposal.creationTimestamp * 1000)
  const lastVoteDate = new Date(creationDate + oneWeek)

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
  return (
    <Segment secondary>
      <p>Creator: {proposal.creator}</p>
      <p>Document Hash: {proposal.docHash}</p>
      <p>Created at: {creationDate.toLocaleString()}</p>
      <p>Open to vote until: {lastVoteDate.toLocaleString()}</p>
      <p>
        Yea: {proposal.yea} Nay: {proposal.nay}
      </p>
      <p>Status: {getStatus(proposal.status)}</p>
      <div>
        Vote: <Button color="green">Yea</Button>
        <Button color="red">Nay</Button>
      </div>
    </Segment>
  )
}

const Proposals = ({ proposals }) => {
  return (
    <Segment.Group>
      {proposals &&
        proposals.map((proposal) => (
          <div key={proposal.docHash}>
            <Proposal proposal={proposal} />
          </div>
        ))}
    </Segment.Group>
  )
}

export default Proposals
