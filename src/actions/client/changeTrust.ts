import {windowConfig} from "../../config/config";
import { Client } from "../../kuknos-wallet-connect";
import {changeTrustResponse, changeTrustRequest} from './../../interfaces/action.interface'
import {Response, responseStatus } from "../../interfaces/response.interface";
import { actionType } from "../../interfaces/setting.interface";
import { Socket } from 'socket.io-client'
import { Request } from "../../interfaces/request.interface";

export function changeTrust_browserExtension_client(client: Client, data:changeTrustRequest ):Promise<Response<changeTrustResponse>>{
    return new Promise((resolve , reject)=>{
        if(!data.asset_code){
            reject('Asset code should not be empty');
            return;
        }
        if(data.asset_issuer && !data.limit){
            reject('limit should not be empty');
            return;
        }

        let confirmWin:any = window.open(
            `${client.extensionUrl}/intent/change-trust?asset_code=${data.asset_code}&type=${data.type}&asset_issuer=${data.asset_issuer}&network=${data.network ? data.network : client.network}`,
            "myWindow",
            `width=${windowConfig.width},height=${windowConfig.height},top=${windowConfig.top},left=${windowConfig.left},scrollbars=no`
        );
        const handleResponse = (response:any) => {            
            const data:Response<changeTrustResponse> = response.data;     
            if (data.status === responseStatus.submit) {
                const res: Response<changeTrustResponse> = {
                    status: responseStatus.submit,
                    type: actionType.changeTrust,
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
                const res: Response<changeTrustResponse> = {
                    status: responseStatus.reject,
                    type: actionType.changeTrust,
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
                const res: Response<changeTrustResponse> = {
                    status: responseStatus.reject,
                    type: actionType.changeTrust,
                    message: 'Canceled',
                    data: {
                        public: '',
                        status : '',
                        transaction_hash: ''
                    }
                }
                reject(res)
            }
        }, 1000);
        window.addEventListener("message", handleResponse);
    })
    
}

export async function changeTrust_WalletConnect_client(client: Client, data: changeTrustRequest): Promise<Response<changeTrustResponse>>{
    return new Promise((resolve, reject) => {
        let wallet:any = localStorage.getItem('walletConnect_info');
        wallet = JSON.parse(wallet).wallet_id;



        let reqData:Request<changeTrustRequest> = {
            type: actionType.changeTrust,
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

        client.socket?.on('receive_data', (d: Response<changeTrustResponse>) =>{            
            if(d.type === actionType.changeTrust){
                resolve(d)
            }
        })
        
    })
}