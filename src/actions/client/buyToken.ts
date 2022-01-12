import { extensionUrl, windowConfig , network } from "../../config/config";
import {BuyTokenRequest, BuyTokenResponse } from "../../interfaces/action.interface";
import {Response, responseStatus } from "../../interfaces/response.interface";
import { actionType } from "../../interfaces/setting.interface";
import { Socket } from 'socket.io-client'
import { Request } from "../../interfaces/request.interface";
import { Client } from "../../kuknos-wallet-connect";



export async function buyToken_WalletConnect_client(client: Client, data: BuyTokenRequest): Promise<Response<BuyTokenResponse>>{
    return new Promise((resolve, reject) => {
        let wallet:any = localStorage.getItem('walletConnect_info');
        try {
            wallet = JSON.parse(wallet).wallet_id;
        } catch (error) {
            throw new Error('Wallet not found. Connect to the wallet first')
        }

        let reqData:Request<BuyTokenRequest> = {
            type: actionType.buyToken,
            client: {
                project_id: client.project_id,
                meta: client.meta
            },
            data: data
        }
        client.socket?.emit('send_data', {
            data: reqData,
            project_id: wallet
        })

        client.socket?.on('receive_data', (d: Response<BuyTokenResponse>) =>{            
            if(d.type === actionType.buyToken){
                resolve(d)
            }
        })
        
    })
}
