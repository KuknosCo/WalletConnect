import {Client, walletType} from 'kuknos-wallet-connect'
import {useState, useEffect} from 'react'

function App() { 

  const [loading, setLoading] = useState(false)
  const [wallet, setWallet] = useState<Client>();

  useEffect(()=>{
    const w = new Client('matin',{
      relay_server_url: 'http://127.0.0.1:5000',
      wallet_type: walletType.wallet_connect
    })
    setWallet(w)   
  },[])
  

  const submit = async ()=>{
    setLoading(true)
    console.log(wallet?.getWalletConnectLink());
    
    let account = await wallet?.connect()
    console.log('account: ', account);
    setLoading(false)
  }
  
  return (
    <div className="App"> 
      {loading && <p>loading</p>}
      <button onClick={()=>{submit()}}>connect</button>
    </div>
  );
}

export default App;
