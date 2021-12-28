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
    let data = await wallet?.getAccountSetting('GDKXBS372NZXAOPJIVF3ODCCHKAALOFRMUPXD7FXGY2VXVEXXJF37QYQ')
    console.log('curve de: ', data);
    setLoading(false)
  }

  //JpupX00kWSjuzH3gic9aTEgHWLbtGzeOHkcWhA4u+R9BXacdzLSvXlNZYDLu0u3WmJJKbMpy0g==

  return (
    <div className="App"> 
      {loading && <p>loading</p>}
      <button onClick={()=>{submit()}}>connect</button>
      <button onClick={()=>{sign()}}>sign</button>
    </div>
  );
}

export default App;
