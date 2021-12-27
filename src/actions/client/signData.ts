import { extensionUrl, windowConfig , network } from "../../config/config";
import { GetAccountResponse, SignDataRequest, SignDataResponse } from "../../interfaces/action.interface";
import {Response, responseStatus } from "../../interfaces/response.interface";
import { actionType } from "../../interfaces/setting.interface";
import { Socket } from 'socket.io-client'
import { Request } from "../../interfaces/request.interface";
import { Client } from "../../kuknos-wallet-connect";

export async function signData_browserExtension_client(client: Client, data: string): Promise<Response<SignDataResponse>>{
	return new Promise((resolve, reject) => {
		if (!data) {
			reject("data should not be empty");
			return;
		}
		let confirmWin: any = window.open(
			`${client.extensionUrl}/intent/sign-data?data=${encodeURIComponent(data)}&network=${client.network}`,
			"myWindow",
			`width=${windowConfig.width},height=${windowConfig.height},top=${windowConfig.top},left=${windowConfig.left},scrollbars=no`
		);
		const handleResponse = (response: any) => {
            const data:Response<SignDataResponse> = response.data;     
            if (data.status === responseStatus.submit) {
                const res: Response<SignDataResponse> = {
                    status: responseStatus.submit,
                    type: actionType.signData,
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
                const res: Response<SignDataResponse> = {
                    status: responseStatus.reject,
                    type: actionType.signData,
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
				const res: Response<SignDataResponse> = {
                    status: responseStatus.reject,
                    type: actionType.signData,
                    message: 'Canceled',
                    data: {
                        public: '',
                        signature :''
                    }
                }
                reject(res)
			}
		}, 1000);
		window.addEventListener("message", handleResponse);
	});
}

export async function signData_WalletConnect_client(client: Client, data: string): Promise<Response<SignDataResponse>>{
    return new Promise((resolve, reject) => {
        let wallet:any = localStorage.getItem('walletConnect_info');
        wallet = JSON.parse(wallet).wallet_id;

        let reqData:Request<SignDataRequest> = {
            type: actionType.signData,
            client: {
                project_id: client.project_id,
                meta: client.meta
            },
            data: {
                data: data
            }
        }
        client.socket?.emit('send_data', {
            data: reqData,
            project_id: wallet
        })

        client.socket?.on('receive_data', (d: Response<SignDataResponse>) =>{            
            if(d.type === actionType.signData){
                resolve(d)
            }
        })
        
    })
}
