# Kuknos Wallet Connect

Implementation of WalletConnect for kuknos network

WalletConnect is an open protocol to communicate securely between Wallets and Dapps (Web3 Apps). The protocol establishes a remote connection between two apps and/or devices using a Bridge server to relay payloads. These payloads are symmetrically encrypted through a shared key between the two peers. The connection is initiated by one peer displaying a QR Code or deep link with a standard WalletConnect URI and is established when the counter-party approves this connection request. It also includes an optional Push server to allow Native applications to notify the user of incoming payloads for established connections.

# Installation
Using npm:

```npm install --save @kuknos/wallet-connect```

Using yarn:

```yarn add @kuknos/wallet-connect```

# Use
First import it like below:

```javascript
    import {Client as walletConnect} from '@kuknos/wallet-connect' 
```

Initiate Connection
```javascript
const wallet = new walletConnect({  // Inital options
        relay_server_url: 'https://relay.kuknos.ir',
        network: walletConnect.network.public
    });
    const connectResponse = await wallet.connect();
    if(connectResponse.status === 'reject'){
        throw new Error('Connect Request Reject by Wallet')
    }
    console.log(connectResponse.data.public)  // PublicKey of connected wallet
    wallet.onConnectionStatusChange((status)=>{
         if(status){
            // Dapp is connected to the wallet
        }else{
            // Dapp is not connected to the wallet
        }
    });
```

Example method for ``payment``:

```javascript
// Create payment transaction and submit on Kuknos network
const paymentResponse= await wallet.payment({
    amount : 1.25,
    destination: 'GDWNW72K5RSW77JTCPADH5EYL2VT4FLUNN43CLIXKEGORT7YO5JDLHLK',
    asset_code : 'PMN',
    memo : 'test'
})
if(paymentResponse.status === 'reject'){
    throw new Error(paymentResponse.message)
}
console.log(paymentResponse.data.hash)  // Transaction hash of this payment
```

# Document
You can find all methods in [Docs](https://kuknosco.github.io/WalletConnect-docs/)
