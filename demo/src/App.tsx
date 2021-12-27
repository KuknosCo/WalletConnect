import {Client, walletType} from 'kuknos-wallet-connect'
import {useState, useEffect} from 'react'

function App() { 

  const [loading, setLoading] = useState(false)
  const [wallet, setWallet] = useState<Client>();

  useEffect(()=>{
    const w = new Client('matin',{
      relay_server_url: 'https://relay.dev.kuknos.ir',
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
  

  const sign = async ()=>{
    setLoading(true)    
    let data = await wallet?.signXdr('AAAAAgAAAADVcMt/03NwOelFS7cMQjqABbixZR9x/Lc2NVvUl7pLvwAAw1AAeBDHAAABhAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAQAAAAAgjs2WdFrGb03nQ1u3qXIQgFseEVfyOWFWi+rNZLiQdwAAAAAAAAAAAJiWgAAAAAAAAAAA')
    console.log('sign xdr: ', data);
    setLoading(false)
  }

  return (
    <div className="App"> 
      {loading && <p>loading</p>}
      <button onClick={()=>{submit()}}>connect</button>
      <button onClick={()=>{sign()}}>sign</button>
    </div>
  );
}

export default App;
