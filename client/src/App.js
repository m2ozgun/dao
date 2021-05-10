import { useEffect, useState } from 'react'
import './App.css'
import { Header, Container, Menu, Input } from 'semantic-ui-react'
import unlockAccount from './api/web3'
import { getDao, createProposal } from './api/dao'
import Proposals from './components/Proposals'
import useAsync from './components/useAsync'

function App() {
  const [proposals, setProposals] = useState(undefined)
  const [web3, setWeb3] = useState(undefined)

  const [account, setAccount] = useState(undefined)
  const [accountBalance, setAccountBalance] = useState(undefined)
  const [proposalHash, setProposalHash] = useState('')
  const [contractAddress, setContractAddress] = useState('')

  const { pending, execute } = useAsync(async (params) => {
    if (!web3) {
      throw new Error('No web3 instance available.')
    }

    await createProposal(web3, account, params)
  })

  const onSubmit = async () => {
    console.log(pending)
    if (pending) {
      return
    }

    await execute({ proposalHash })
  }

  useEffect(() => {
    const init = async () => {
      const { web3, account } = await unlockAccount()

      if (!web3) {
        throw new Error('Web3 is not available.')
      }

      const { proposals, accountBalance, contractAddress } = await getDao(
        web3,
        account,
      )

      setAccount(account)
      setProposals(proposals)
      setAccountBalance(accountBalance)
      setWeb3(web3)
      setContractAddress(contractAddress)
      console.log(accountBalance)
    }
    init()
  }, [])

  return (
    <>
      <Menu fixed="top" inverted>
        <Container>
          <Menu.Item as="a" header>
            Decentralized Autonomous Organization
          </Menu.Item>
          <Menu.Item position="right">Staked: {accountBalance} wei</Menu.Item>
        </Container>
      </Menu>

      <Container
        style={{ marginTop: '5em', paddingLeft: '2em', paddingRight: '2em' }}
      >
        <p>Contract address: {contractAddress}</p>
        <Header as="h2" dividing>
          Create Proposal
        </Header>
        <Input
          action={{
            icon: 'arrow right',
            onClick: onSubmit,
          }}
          placeholder="Proposal document hash"
          fluid
          value={proposalHash}
          onChange={(e) => setProposalHash(e.target.value)}
        />
        <Header as="h2" dividing style={{ marginTop: '2em' }}>
          Proposals
        </Header>
        <Proposals proposals={proposals} account={account} web3={web3} />
      </Container>
    </>
  )
}

export default App
