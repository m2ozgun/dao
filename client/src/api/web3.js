import Web3 from 'web3'

const unlockAccount = () =>
  new Promise((resolve, reject) => {
    window.addEventListener('load', async () => {
      if(window.ethereum) {
        const { ethereum } = window

        if(!ethereum) {
            throw new Error("Web3 not found!")
        }
    
        const web3 = new Web3(ethereum)
        await ethereum.enable()
    
        const accounts = await web3.eth.getAccounts()

        resolve({ web3, account: accounts[0] || "",  });
      }
      resolve({web3: undefined, account: undefined});
    });
  });

export default unlockAccount;