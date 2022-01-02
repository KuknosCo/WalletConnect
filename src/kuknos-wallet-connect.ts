import { actionType, initOptions, meta, walletConnectLink, walletType } from './interfaces/setting.interface'
import socketIo, { Socket } from 'socket.io-client'
import { isBrowser, isMobile, isIOS, isAndroid } from 'react-device-detect';
import { getAccount_browserExtension_client } from './actions/client/getAccount';
import { Response } from './interfaces/response.interface';
import { accountBlancesResponse, accountSettingResponse, changeTrustRequest, changeTrustResponse, createAccountResponse, curveDecryptResponse, curveEncryptRequest, curveEncryptResponse, GetAccountResponse, paymentRequest, paymentResponse, SignDataRequest, SignDataResponse, signXdrResponse } from './interfaces/action.interface';
import { Request, requestFn } from './interfaces/request.interface';
import { getAccount_walletConnect_wallet } from './actions/wallet/getAccount';
import { signData_browserExtension_client, signData_WalletConnect_client } from './actions/client/signData';
import {responseStatus} from './interfaces/response.interface'
import { v4 as uuidv4 } from 'uuid';
import { signXdr_browserExtension_client, signXdr_WalletConnect_client } from './actions/client/signXdr';
import { changeTrust_browserExtension_client, changeTrust_WalletConnect_client } from './actions/client/changeTrust';
import { createAccount_browserExtension_client, createAccount_WalletConnect_client } from './actions/client/createAccount';
import { curveEncrypt } from './actions/client/curveEncrypt';
import { curveDecrypt_browserExtension_client, curveDecrypt_WalletConnect_client } from './actions/client/curveDecrypt';
import { getAccountBalances } from './actions/client/getAccountBalances';
import { getAccountSetting } from './actions/client/getAccountSetting';
import { payment_browserExtension_client, payment_WalletConnect_client } from './actions/client/payment';
import {network} from './interfaces/setting.interface'

export * from './interfaces/action.interface'
export * from './interfaces/setting.interface'


export class Client{

    public type: walletType | undefined; 
    public project_id: string;
    public socket: Socket | undefined;
    public extensionUrl: string = "https://browser-extension.kuknos.ir"
    public relayServerUrl: string = "https://relay.kuknos.ir" 
    public network = "public"
    public meta: meta = {}


    constructor(options: initOptions){
        
        this.project_id = uuidv4();     
        if(options.browser_extension_url){
            this.extensionUrl = options.browser_extension_url
        }
        if(options.network){
            this.network = options.network
        }
        if(options.relay_server_url){
            this.relayServerUrl = options.relay_server_url
        }

        if(options.meta){
            this.meta = options.meta
        }

        this.meta.url = window.location.origin

        if(options.wallet_type){
            this.type = options.wallet_type
        }


        this.socket = socketIo(this.relayServerUrl,  {
            auth: {
                project_id: this.project_id
            }
        });
        this.socket.connect();
        this.socket.emit('init')
        this.setWalletInfo()
        
    }

    public setNetwork(network:network ){
        this.network = network
    }

    public setWalletType(walletType: walletType ){
        this.type = walletType
    }

    private setWalletInfo(){
        this.socket?.on('receive_data' ,(d:any) =>{
            if(d.type === 'wallet_info'){                        
                localStorage.setItem('walletConnect_info', JSON.stringify({
                    meta: d.meta,
                    wallet_id: d.wallet_id
                }))
            }
        })
    }

    public getConnectedWalletInfo(){        
        let wallet:any = localStorage.getItem('walletConnect_info');
        try {
            wallet = JSON.parse(wallet)
            return wallet
        } catch (error) {
            throw new Error('No wallet found. First, connect to a wallet')
        }
    }

    public availableWallets(): Array<walletType>{
        let wallets: Array<walletType> = [walletType.wallet_connect];
        if(isBrowser && !isMobile){
            wallets.push(walletType.browser_extension);
        }
        return wallets
    }

    public getWalletConnectLink():string{
        const object: walletConnectLink = {
            project_id: this.project_id,
            meta: this.meta
        }
        const link = Buffer.from(JSON.stringify(object)).toString('base64');
        return 'wc-kuknos://'+link
    }

    public connectPhone():Promise<Response<GetAccountResponse>>{
        return new Promise(async (resolve, reject)=>{
            try {
                const object: walletConnectLink = {
                    project_id: this.project_id,
                    meta: this.meta
                }

                // window.parent.postMessage({
                //     type: 'wallet-connect-request',
                //     data: object
                // }, '*')

            } catch (error) {
                reject(error)
            }
        })
    }

    public connect():Promise<Response<GetAccountResponse>>{
        return new Promise(async (resolve, reject)=>{
            try {
                switch (this.type) {
                    case walletType.wallet_connect:
                        this.socket?.on('receive_data' ,(d:Response<GetAccountResponse>) =>{                                                                                  
                            if(d.type === actionType.getAccount){                                
                                resolve(d)
                            }
                        })               
                        break;
                    case walletType.browser_extension:
                        let data = await getAccount_browserExtension_client()
                        resolve(data)
                        break
                }
            } catch (error) {
                reject(error)
            }
        })
    
    }

    public signData(data:string): Promise<Response<SignDataResponse>>{
        return new Promise(async (resolve, reject)=>{
            try {
                switch (this.type) {
                    case walletType.wallet_connect:
                        let resW = await signData_WalletConnect_client(this, data)
                        resolve(resW)        
                        break;
                    case walletType.browser_extension:
                        let resE = await signData_browserExtension_client(this, data)
                        resolve(resE)
                        break
                    
                }
            } catch (error) {
                reject(error)
            }
        })
    }

    public changeTrust(data:changeTrustRequest): Promise<Response<changeTrustResponse>>{
        return new Promise(async (resolve, reject)=>{
            try {
                switch (this.type) {
                    case walletType.wallet_connect:
                        let resW = await changeTrust_WalletConnect_client(this, data)
                        resolve(resW)        
                        break;
                    case walletType.browser_extension:
                        let resE = await changeTrust_browserExtension_client(this, data)
                        resolve(resE)
                        break
                    
                }
            } catch (error) {
                reject(error)
            }
        })
    }

    public signXdr(xdr:string): Promise<Response<signXdrResponse>>{
        return new Promise(async (resolve, reject)=>{
            try {
                switch (this.type) {
                    case walletType.wallet_connect:
                        let resW = await signXdr_WalletConnect_client(this, xdr)
                        resolve(resW)        
                        break;
                    case walletType.browser_extension:
                        let resE = await signXdr_browserExtension_client(this, xdr)
                        resolve(resE)
                        break
                    
                }
            } catch (error) {
                reject(error)
            }
        })
    }

    public createAccount(xdr:string): Promise<Response<createAccountResponse>>{
        return new Promise(async (resolve, reject)=>{
            try {
                switch (this.type) {
                    case walletType.wallet_connect:
                        let resW = await createAccount_WalletConnect_client(this, xdr)
                        resolve(resW)        
                        break;
                    case walletType.browser_extension:
                        let resE = await createAccount_browserExtension_client(this, xdr)
                        resolve(resE)
                        break
                    
                }
            } catch (error) {
                reject(error)
            }
        })
    }

    public curveEncrypt(data:curveEncryptRequest): Promise<Response<curveEncryptResponse>>{
        return new Promise(async (resolve, reject)=>{
            try {                
                let res = await curveEncrypt(data)
                resolve(res)
            } catch (error) {
                reject(error)
            }
        })
    }

    public curveDecrypt(cipherText:string): Promise<Response<curveDecryptResponse>>{
        return new Promise(async (resolve, reject)=>{
            try {
                switch (this.type) {
                    case walletType.wallet_connect:
                        let resW = await curveDecrypt_WalletConnect_client(this, cipherText)
                        resolve(resW)        
                        break;
                    case walletType.browser_extension:
                        let resE = await curveDecrypt_browserExtension_client(this, cipherText)
                        resolve(resE)
                        break
                    
                }
            } catch (error) {
                reject(error)
            }
        })
    }

    public getAccountBalance(publicKey: string): Promise<Response<accountBlancesResponse>> {
        return new Promise(async (resolve, reject)=>{
            try {                
                let res = await getAccountBalances(this, publicKey)
                resolve(res)
            } catch (error) {
                reject(error)
            }
        })
    }

    public getAccountSetting(publicKey: string): Promise<Response<accountSettingResponse>> {
        return new Promise(async (resolve, reject)=>{
            try {                
                let res = await getAccountSetting(this, publicKey)
                resolve(res)
            } catch (error) {
                reject(error)
            }
        })
    }

    public payment(data:paymentRequest): Promise<Response<paymentResponse>>{
        return new Promise(async (resolve, reject)=>{
            try {
                switch (this.type) {
                    case walletType.wallet_connect:
                        let resW = await payment_WalletConnect_client(this, data)
                        resolve(resW)        
                        break;
                    case walletType.browser_extension:
                        let resE = await payment_browserExtension_client(this, data)
                        resolve(resE)
                        break
                    
                }
            } catch (error) {
                reject(error)
            }
        })
    }

}

export class Wallet{
    private type: walletType | undefined; 
    private project_id: string | undefined;
    private socket: Socket | undefined;
    private extensionUrl: string = "https://browser-extension.kuknos.ir"
    private relayServerUrl: string = "https://relay.kuknos.ir" 
    private network = "public"
    private meta: meta = {}

    constructor(options: initOptions){
       
             
        if(options.browser_extension_url){
            this.extensionUrl = options.browser_extension_url
        }
        if(options.network){
            this.network = options.network
        }
        if(options.relay_server_url){
            this.relayServerUrl = options.relay_server_url
        }

        if(options.meta){
            this.meta = options.meta
        }

        if(options.wallet_type){
            this.type = options.wallet_type
        }

        
        
    }

    private pwaConnectListen(){

        /* window.addEventListener('message' , (e)=>{
            console.log(e);
        }) */
    }
    
    public init(project_id: string ){
        if(!project_id){
            throw new Error("project_id is empty!");
        }
        this.project_id = project_id;  
        
        if(this.socket?.connected){
            this.socket.disconnect()
        }

        this.socket = socketIo(this.relayServerUrl , {
            auth: {
                project_id: project_id
            }
        });
        this.socket.connect();
        this.socket.emit('init')

        this.pwaConnectListen()
    }

    public connect(walletConnectLink: string, status:responseStatus, data:GetAccountResponse){   
        let link:any = walletConnectLink.split('://')[1];
        link = Buffer.from(link, 'base64').toString()
        link = JSON.parse(link) 
        let clientId = link.project_id
        getAccount_walletConnect_wallet(this.socket, walletConnectLink, status, data)
        this.socket?.emit('send_data' , {
            data:{
                type: 'wallet_info',
                meta: this.meta,
                wallet_id: this.project_id
            },
            project_id: clientId
        })
    }


    onRequest(fn: requestFn){                
        this.socket?.on('receive_data' , (data: Request)=>{            
            fn(data.type, data.client, data.data)
        })
    }

    response(type: actionType, project_id: string, data: SignDataResponse){
        let res: Response = {
            status: responseStatus.submit,
            message: '',
            type: type,
            data: data
        }        
        this.socket?.emit('send_data' , {
            project_id: project_id,
            data: res
        })
    }   
    
    reject(type: actionType, project_id: string, message:string){
        let res: Response = {
            status: responseStatus.reject,
            message: message,
            type: type,
            data: {}
        }

        this.socket?.emit('send_data' , {
            project_id: project_id,
            data: res
        })
    }
}
