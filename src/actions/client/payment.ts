import {windowConfig} from "../../config/config";
import { Client } from "../../kuknos-wallet-connect";
import {changeTrustResponse, changeTrustRequest, paymentRequest, paymentResponse} from './../../interfaces/action.interface'
import {Response, responseStatus } from "../../interfaces/response.interface";
import { actionType } from "../../interfaces/setting.interface";
import { Request } from "../../interfaces/request.interface";

export function payment_browserExtension_client(client: Client, data:paymentRequest):Promise<Response<paymentResponse>>{
    return new Promise((resolve , reject)=>{

        if(!data.asset_code || !data.amount || !data.destination){
            reject('Amount and destination and asset code should not be empty');
            return;
        }

        let confirmWin:any = window.open(
            `${client.extensionUrl}/intent/payment?asset_code=${data.asset_code}&amount=${data.amount}&asset_issuer=${data.asset_issuer}&destination=${data.destination}&memo=${encodeURIComponent(data.memo || '')}&network=${data.network ? data.network : client.network}`,
            "myWindow",
            `width=${windowConfig.width},height=${windowConfig.height},top=${windowConfig.top},left=${windowConfig.left},scrollbars=no`
        );
        const handleResponse = (response:any) => {            
            const data:Response<paymentResponse> = response.data;     
            if (data.status === responseStatus.submit) {
                const res: Response<paymentResponse> = {
                    status: responseStatus.submit,
                    type: actionType.payment,
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
                const res: Response<paymentResponse> = {
                    status: responseStatus.reject,
                    type: actionType.payment,
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
                const res: Response<paymentResponse> = {
                    status: responseStatus.reject,
                    type: actionType.payment,
                    message: 'Canceled',
                    data: {
                        network: client.network,
                        public: '',
                        status: '',
                        transaction_hash: ''
                    }
                }
                reject(res)
            }
        }, 1000);
        window.addEventListener("message", handleResponse);
    })
    
}


export async function payment_WalletConnect_client(client: Client, data: paymentRequest): Promise<Response<paymentResponse>>{
    return new Promise((resolve, reject) => {
        let wallet:any = localStorage.getItem('walletConnect_info');
        try {
            wallet = JSON.parse(wallet).wallet_id;
        } catch (error) {
            throw new Error('Wallet not found. Connect to the wallet first')
        }



        let reqData:Request<paymentRequest> = {
            type: actionType.payment,
            client: {
                project_id: client.project_id,
                meta: client.meta
            },
            data: {
                ...data,
                network: data.network ? data.network : client.network
            }
        }
        client.socket?.emit('send_data', {
            data: reqData,
            project_id: wallet
        })

        client.socket?.on('receive_data', (d: Response<paymentResponse>) =>{            
            if(d.type === actionType.payment){
                resolve(d)
            }
        })
        
    })
}