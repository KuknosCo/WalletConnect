import { windowConfig } from "../../config/config";
import { createAccountRequest, createAccountResponse } from "../../interfaces/action.interface";
import { Response, responseStatus } from "../../interfaces/response.interface";
import { actionType } from "../../interfaces/setting.interface";
import { Client } from "../../kuknos-wallet-connect";
import { Request } from "../../interfaces/request.interface";

export function createAccount_browserExtension_client(client: Client, identifier: string):Promise<Response<createAccountResponse>>{
    return new Promise((resolve , reject)=>{
        if(!identifier){
            reject('Identifier should not be empty')
            return
        }
        let confirmWin:any = window.open(
            `${client.extensionUrl}/intent/create-account?identifier=${encodeURIComponent(identifier)}`,
            "myWindow",
            `width=${windowConfig.width},height=${windowConfig.height},top=${windowConfig.top},left=${windowConfig.left},scrollbars=no`
        );
        const handleResponse = (response:any) => {            
            const data:Response<createAccountResponse> = response.data;     
            if (data.status === responseStatus.submit) {
                const res: Response<createAccountResponse> = {
                    status: responseStatus.submit,
                    type: actionType.createAccount,
                    message: '',
                    data: data.data
                }
                resolve(res)
                window.removeEventListener("message", handleResponse);
                confirmWin.close();
            }
			
            if (data.status === responseStatus.reject) {
                window.removeEventListener("message", handleResponse);
                confirmWin.close();
                const res: Response<createAccountResponse> = {
                    status: responseStatus.reject,
                    type: actionType.createAccount,
                    message: 'Canceled',
                    data: data.data
                }
                reject(res)
            }
        };
        let timer = setInterval(function () {
            if (confirmWin.closed) {
                clearInterval(timer);
                window.removeEventListener("message", handleResponse);
                const res: Response<createAccountResponse> = {
                    status: responseStatus.reject,
                    type: actionType.createAccount,
                    message: 'Canceled',
                    data: {
                        public: '',
                        signature: ''
                    }
                }
                reject(res)
            }
        }, 1000);
        window.addEventListener("message", handleResponse);
    })
    
}

export async function createAccount_WalletConnect_client(client: Client, identifier: string): Promise<Response<createAccountResponse>>{
    return new Promise((resolve, reject) => {
        let wallet:any = localStorage.getItem('walletConnect_wallet');
        try {
            wallet = JSON.parse(wallet).wallet_id;
        } catch (error) {
            throw new Error('Wallet not found. Connect to the wallet first')
        }

        let reqData:Request<createAccountRequest> = {
            type: actionType.createAccount,
            client: {
                project_id: client.project_id,
                meta: client.meta
            },
            data: {
                identifier: identifier
            }
        }
        client.socket?.emit('send_data', {
            data: reqData,
            project_id: wallet
        })

        client.socket?.on('receive_data', (d: Response<createAccountResponse>) =>{            
            if(d.type === actionType.createAccount){
                resolve(d)
            }
        })
        
    })
}