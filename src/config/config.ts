import { IwindowConfig } from "../interfaces/windowConfig.interface";

export let extensionUrl: string = "https://browser-extension.kuknos.ir";
export let walletConnectUrl: string = "https://relay.kuknos.ir";


export let horizon  = 'https://horizon.kuknos.org'

export let network  = 'public'

export const windowConfig: IwindowConfig = {
  width: 416,
  height: 600,
  top: 150,
  left: window.screen.width - 460,
};


export function setExtensionUrl(url:string){
  extensionUrl = url
}

export function setNetwork(net: 'public'|'test'){
  network = net
  if(network === 'public'){
    horizon = 'https://horizon.kuknos.org'
  }else if(network === 'test'){
    horizon = 'https://hz1-test.kuknos.org'
  }
}
