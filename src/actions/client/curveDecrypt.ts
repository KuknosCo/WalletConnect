import {  windowConfig  } from "../../config/config";
import { curveDecryptRequest, curveDecryptResponse, GetAccountResponse, SignDataRequest, SignDataResponse } from "../../interfaces/action.interface";
import {Response, responseStatus } from "../../interfaces/response.interface";
import { actionType } from "../../interfaces/setting.interface";
import { Socket } from 'socket.io-client'
import { Request } from "../../interfaces/request.interface";
import { Client } from "../../kuknos-wallet-connect";

export async function curveDecrypt_browserExtension_client(client: Client, cipherText: string):Promise<Response<curveDecryptResponse>>{
	return new Promise((resolve , reject)=>{
        if(!cipherText){
            reject('data should not be empty')
            return
        }
        let confirmWin:any = window.open(
            `${client.extensionUrl}/intent/curve-decrypt?ciphertext=${encodeURIComponent(cipherText)}`,
            "myWindow",
            `width=${windowConfig.width},height=${windowConfig.height},top=${windowConfig.top},left=${windowConfig.left},scrollbars=no`
        );
        const handleResponse = (response:any) => {            
            const data:Response<curveDecryptResponse> = response.data;     
            if (data.status === responseStatus.submit) {
                const res: Response<curveDecryptResponse> = {
                    status: responseStatus.submit,
                    type: actionType.curveDecrypt,
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
                const res: Response<curveDecryptResponse> = {
                    status: responseStatus.reject,
                    type: actionType.curveDecrypt,
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
                const res: Response<curveDecryptResponse> = {
                    status: responseStatus.reject,
                    type: actionType.curveDecrypt,
                    message: 'Canceled',
                    data: {
                        plain_text: '',
                        public: ''
                    }
                }
                reject(res)
            }
        }, 1000);
        window.addEventListener("message", handleResponse);
    })
}


export async function curveDecrypt_WalletConnect_client(client: Client, cipherText: string): Promise<Response<curveDecryptResponse>>{
    return new Promise((resolve, reject) => {
        let wallet:any = localStorage.getItem('walletConnect_info');
        try {
            wallet = JSON.parse(wallet).wallet_id;
        } catch (error) {
            throw new Error('No wallet found. First, connect to a wallet')
        }

        let reqData:Request<curveDecryptRequest> = {
            type: actionType.curveDecrypt,
            client: {
                project_id: client.project_id,
                meta: client.meta
            },
            data: {
               cipher_text :  cipherText
            }
        }
        client.socket?.emit('send_data', {
            data: reqData,
            project_id: wallet
        })

        client.socket?.on('receive_data', (d: Response<curveDecryptResponse>) =>{            
            if(d.type === actionType.curveDecrypt){
                resolve(d)
            }
        })
        
    })
}