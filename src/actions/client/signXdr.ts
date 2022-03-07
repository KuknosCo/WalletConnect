import {  Client } from "../../kuknos-wallet-connect";
import {  windowConfig } from "../../config/config";
import {Response, responseStatus } from "../../interfaces/response.interface";
import { signXdrResponse, signXdrRequest } from "./../../interfaces/action.interface";
import { Request } from "../../interfaces/request.interface";
import {actionType} from './../../interfaces/setting.interface'

export async function signXdr_browserExtension_client(client: Client, xdr: string): Promise<Response<signXdrResponse>> {
	return new Promise((resolve, reject) => {
		if (!xdr) {
			reject("xdr should not be empty");
			return;
		}
		let confirmWin: any = window.open(
			`${client.extensionUrl}/intent/sign-xdr?xdr=${encodeURIComponent(xdr)}&network=${client.network}`,
			"myWindow",
			`width=${windowConfig.width},height=${windowConfig.height},top=${windowConfig.top},left=${windowConfig.left},scrollbars=no`
		);
		const handleResponse = (response: any) => {
            const data:Response<signXdrResponse> = response.data;     
            if (data.status === responseStatus.submit) {
                const res: Response<signXdrResponse> = {
                    status: responseStatus.submit,
                    type: actionType.signXdr,
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
                const res: Response<signXdrResponse> = {
                    status: responseStatus.reject,
                    type: actionType.signXdr,
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
				reject("Canceled");
			}
		}, 1000);
		window.addEventListener("message", handleResponse);
	});
}

export async function signXdr_WalletConnect_client(client: Client, xdr: string): Promise<Response<signXdrResponse>>{
    return new Promise((resolve, reject) => {
        let wallet:any = localStorage.getItem('walletConnect_wallet');
        try {
            wallet = JSON.parse(wallet).wallet_id;
        } catch (error) {
            throw new Error('Wallet not found. Connect to the wallet first')
        }

        let reqData:Request<signXdrRequest> = {
            type: actionType.signXdr,
            client: {
                project_id: client.project_id,
                meta: client.meta
            },
            data: {
                xdr: xdr,
                network: client.network
            }
        }
        client.socket?.emit('send_data', {
            data: reqData,
            project_id: wallet
        })

        client.socket?.on('receive_data', (d: Response<signXdrResponse>) =>{            
            if(d.type === actionType.signXdr){
                resolve(d)
            }
        })
    })
}