import { actionType, initOptions, meta, walletConnectLink, walletType, ConnectionStatusFn } from './interfaces/setting.interface'
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
import queryString from 'query-string'
import {modalHTML, modalScript, modalCss} from './modal/modal'

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
    public connectionStatus: boolean = false


    constructor(options: initOptions){
        const savedType = localStorage.getItem('walletConnect_type')
        const savedNetwork = localStorage.getItem('walletConnect_network')

        this.project_id = uuidv4();


        if(savedNetwork){
            this.network = savedNetwork
        }else if(options.network){
            this.network = options.network
        }
        localStorage.setItem('walletConnect_network', this.network)


        if(savedType){
            if(savedType === walletType.browser_extension){
                this.type = walletType.browser_extension
            }else{
                this.type = walletType.wallet_connect
            }
            localStorage.setItem('walletConnect_type', this.type)
        }
        
        
        if(options.browser_extension_url){
            this.extensionUrl = options.browser_extension_url
        }
        
        if(options.relay_server_url){
            this.relayServerUrl = options.relay_server_url
        }

        if(options.meta){
            this.meta = options.meta
        }


        this.meta.url = window.location.origin

        this.socket = socketIo(this.relayServerUrl+'/walletConnect',  {
            auth:{
                project_id: this.project_id
            },
        });
        this.socket.connect();
        this.setWalletInfo()
    }

    private ping(type:actionType):Promise<boolean>{
        return new Promise((resolve, reject)=>{
            if(this.type == walletType.browser_extension) resolve(true)
            const rejectObj: Response<null>= {
                status: responseStatus.reject,
                type: type,
                message: 'Wallet not available.',
                data: null
            }
            try {
                let wallet:any = localStorage.getItem('walletConnect_wallet');
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

    private setWalletInfo(){
        this.socket?.on('receive_data' ,(d:any) =>{
            if(d.type === 'wallet_info'){                        
                localStorage.setItem('walletConnect_wallet', JSON.stringify({
                    meta: d.meta,
                    wallet_id: d.wallet_id
                }))
            }
        })
    }

    private getWalletConnectLink():string{
        const object: walletConnectLink = {
            project_id: this.project_id,
            meta: this.meta
        }
        const link = Buffer.from(JSON.stringify(object)).toString('base64');
        return 'wc-kuknos://'+link
    }

    private setWalletType(walletType: walletType ){
        this.type = walletType
        localStorage.setItem('walletConnect_type', walletType)
    }

    public setNetwork(network:network ){
        this.network = network
        localStorage.setItem('walletConnect_network', network)
    }

    public async onConnectionStatusChange(fn: ConnectionStatusFn){
        setInterval(async()=>{
            try {
                await this.ping(actionType.getAccount)
                if(!this.connectionStatus){
                    this.connectionStatus = true
                    fn(this.connectionStatus)
                }
            } catch (error) {
                if(this.connectionStatus){
                    this.connectionStatus = false
                    fn(this.connectionStatus)
                }
            }
        },1000 )
    }

    public connect():Promise<Response<GetAccountResponse>>{
        return new Promise(async (resolve, reject)=>{

            const modalElementScript = document.createElement('script');
            const modalElementCss = document.createElement('style');
            const modalElementHTML = document.createElement('div');
            modalElementScript.innerHTML = modalScript
            modalElementCss.innerHTML = modalCss
            modalElementHTML.innerHTML = modalHTML
            modalElementHTML.style.cssText = `
                display: block; 
                position: fixed; 
                z-index: 1; 
                left: 0;
                top: 0;
                width: 100%; 
                height: 100%; 
                overflow: auto; 
                background-color: rgb(0,0,0); 
                background-color: rgba(0,0,0,0.4);
            `
            
            document.head.append(modalElementCss)
            document.body.append(modalElementHTML)
            document.body.append(modalElementScript)


            window.parent.postMessage({
                type: 'set-wallet-connect-qr',
                text: this.getWalletConnectLink()
            }, '*')


            window.addEventListener('message' , async (e)=>{
                if(e.data.type === 'close-connect-modal'){
                    //remote modal elements
                    modalElementCss.remove()
                    modalElementHTML.remove()
                    modalElementScript.remove()
                    const res: Response<GetAccountResponse> = {
                        status: responseStatus.reject,
                        type: actionType.getAccount,
                        message: 'Canceled by user',
                        data: {
                            public: ''
                        }
                    }
                    reject(res)
                }
            })

            window.addEventListener('message' , async (e)=>{
                if(e.data.type === 'click-connect-btn'){
                    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){

                        this.setWalletType(walletType.wallet_connect)
                        const param = queryString.parseUrl(window.location.href)
                        if(param.query.walletUUID){
                            let reqData:Request<null> = {
                                type: actionType.walletConnectRequest,
                                client: {
                                    meta: this.meta,
                                    project_id: this.project_id
                                },
                                data: null
                            }
                            this.socket?.emit('send_data', {
                                data: reqData,
                                project_id: param.query.walletUUID,
                            })

                        }else{
                            const object: walletConnectLink = {
                                project_id: this.project_id,
                                meta: this.meta
                            }
                            window.parent.postMessage({
                                type: 'wallet-connect-request',
                                data: object
                            }, '*')
                        }

                    }else{

                        this.setWalletType(walletType.browser_extension)
                        let data = await getAccount_browserExtension_client(this)
                        localStorage.setItem('walletConnect_connected', 'true')
                        localStorage.setItem('walletConnect_network', this.network)
                        localStorage.setItem('walletConnect_type', this.type) 

                        //remote modal elements
                        modalElementCss.remove()
                        modalElementHTML.remove()
                        modalElementScript.remove()
                        
                        resolve(data)

                    }
                    
                }
            })

            this.socket?.on('receive_data' ,(d:Response<GetAccountResponse>) =>{                                                                                                              
                if(d.type === actionType.getAccount){  
                    localStorage.setItem('walletConnect_connected', 'true')
                    localStorage.setItem('walletConnect_network', this.network)   
                    localStorage.setItem('walletConnect_type', this.type)   
                    
                    //remote modal elements
                    modalElementCss.remove()
                    modalElementHTML.remove()
                    modalElementScript.remove()

                    resolve(d)
                }
            })   

        })
    
    }

    public disconnect():Promise<void>{
        return new Promise((resolve)=>{
            localStorage.removeItem('walletConnect_connected')
            localStorage.removeItem('walletConnect_type')
            localStorage.removeItem('walletConnect_network')
            localStorage.removeItem('walletConnect_wallet')
            resolve()
        })
    }


    // actions

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
    private walletAvailable: boolean = true;

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

    }

    
    public init(publickey: string ){
        if(!publickey){
            throw new Error("project_id is empty!");
        }
        this.project_id = publickey;  
        
        if(this.socket?.connected){
            this.socket.disconnect()
        }
        
        this.socket = socketIo(this.relayServerUrl+'/walletConnect' , {
            auth: {
                project_id: publickey
            },
        });
        this.socket.connect();
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

    public setWalletAvailableStatus(available: boolean){
        this.walletAvailable = available;
    }

    onRequest(fn: requestFn){
        this.socket?.on('receive_data' , (data: Request)=>{   
            if(data.type == actionType.ping){
                if(this.walletAvailable){
                    this.response(data.type, data.client.project_id , '')
                }
            }else{
                if(this.walletAvailable){
                    fn(data.type, data.client, data.data)
                }
                
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
