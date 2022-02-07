import { actionType, initOptions, meta, walletConnectLink, walletType } from './interfaces/setting.interface'
import socketIo, { Socket } from 'socket.io-client'
import { isBrowser, isMobile, isIOS, isAndroid } from 'react-device-detect';
import { getAccount_browserExtension_client } from './actions/client/getAccount';
import { Response } from './interfaces/response.interface';
import { accountBlancesResponse, accountSettingResponse, changeTrustRequest, changeTrustResponse, createAccountResponse, curveDecryptResponse, curveEncryptRequest, curveEncryptResponse, GetAccountResponse, paymentRequest, paymentResponse, SignDataRequest, SignDataResponse, signXdrResponse, BuyTokenRequest, BuyTokenResponse } from './interfaces/action.interface';
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
import { buyToken_WalletConnect_client } from './actions/client/buyToken';
import {Buffer} from 'buffer'

export * from './interfaces/action.interface'
export * from './interfaces/setting.interface'


export class Client{

    public type: walletType = walletType.wallet_connect
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

    private ping(type:actionType):Promise<boolean>{
        return new Promise((resolve, reject)=>{
            if(this.type != walletType.wallet_connect) resolve(true)
            const rejectObj: Response<null>= {
                status: responseStatus.reject,
                type: type,
                message: 'Wallet not found. Connect to the wallet first',
                data: null
            }
            try {
                let wallet:any = localStorage.getItem('walletConnect_info');
                wallet = JSON.parse(wallet).wallet_id;

                let reqData:Request<null> = {
                    type: actionType.ping,
                    client: {
                        project_id: this.project_id,
                        meta: this.meta
                    },
                    data : null
                }
                this.socket?.emit('send_data', {
                    data: reqData,
                    project_id: wallet
                })

                this.socket?.on('receive_data' ,(d:Response) =>{                                                                                  
                    if(d.type === actionType.ping){
                        resolve(true)
                    }
                })
                setTimeout(()=>{
                    reject(rejectObj)
                },1500)
            } catch (error) {
                reject(rejectObj)
            }
        })
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
            throw new Error('Wallet not found. Connect to the wallet first')
        }
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

                window.parent.postMessage({
                    type: 'wallet-connect-request',
                    data: object
                }, '*')

                this.socket?.on('receive_data' ,(d:Response<GetAccountResponse>) =>{                                                                       
                    if(d.type === actionType.getAccount){                                
                        resolve(d)
                    }
                })               

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
                await this.ping(actionType.signData)
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
                await this.ping(actionType.changeTrust)
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
                await this.ping(actionType.signXdr)
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

    public createAccount(identifier:string): Promise<Response<createAccountResponse>>{
        return new Promise(async (resolve, reject)=>{
            try {
                await this.ping(actionType.createAccount)
                switch (this.type) {
                    case walletType.wallet_connect:
                        let resW = await createAccount_WalletConnect_client(this, identifier)
                        resolve(resW)        
                        break;
                    case walletType.browser_extension:
                        let resE = await createAccount_browserExtension_client(this, identifier)
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
                await this.ping(actionType.curveDecrypt)
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
                await this.ping(actionType.payment)
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

    public buyToken(data:BuyTokenRequest): Promise<Response<BuyTokenResponse>>{
        return new Promise(async (resolve, reject)=>{
            try {
                await this.ping(actionType.buyToken)
                switch (this.type) {
                    case walletType.wallet_connect:
                        let resW = await buyToken_WalletConnect_client(this, data)
                        resolve(resW)        
                        break;
                }
            } catch (error) {
                reject(error)
            }
        })
    }

}

export class Wallet{
    private type: walletType = walletType.wallet_connect
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

    
    public init(publickey: string ){
        if(!publickey){
            throw new Error("project_id is empty!");
        }
        this.project_id = publickey;  
        
        if(this.socket?.connected){
            this.socket.disconnect()
        }

        this.socket = socketIo(this.relayServerUrl , {
            auth: {
                project_id: publickey
            }
        });
        this.socket.connect();
        this.socket.emit('init')
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
            if(data.type == actionType.ping){
                this.response(data.type, data.client.project_id , '')
            }else{
                fn(data.type, data.client, data.data)
            }        
            
        })
        window.addEventListener('message' , (e)=>{
            if(e.data.type === 'wallet-connect-request'){
                fn(actionType.getAccount, e.data.data, {})
            }
        })
    }

    response(type: actionType, project_id: string, data: SignDataResponse | ''){
        let res: Response = {
            status: responseStatus.submit,
            message: '',
            type: type,
            data: data
        }        
        

        if(type === actionType.getAccount){
            this.socket?.emit('send_data' , {
                data:{
                    type: 'wallet_info',
                    meta: this.meta,
                    wallet_id: this.project_id
                },
                project_id: project_id
            })
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
