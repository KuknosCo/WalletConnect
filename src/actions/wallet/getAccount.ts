import { extensionUrl, windowConfig , network } from "../../config/config";
import { GetAccountResponse } from "../../interfaces/action.interface";
import { Request, requestFn } from "../../interfaces/request.interface";
import {Response, responseStatus } from "../../interfaces/response.interface";
import { actionType, clientApp } from "../../interfaces/setting.interface";
import { Socket } from 'socket.io-client'

export function getAccount_walletConnect_wallet(socket:Socket | undefined , walletConnectLink: string, status: responseStatus, data:GetAccountResponse ){
    const req : Request = {
        type: actionType.getAccount,
        client: {
            meta: {},
            project_id: ''
        },
        data: {
            data: ''
        }
    }   

    let clientId = ''
    if(walletConnectLink){
        let link:any = walletConnectLink.split('://')[1];
        link = Buffer.from(link, 'base64').toString()
        let client:clientApp = JSON.parse(link)
        clientId = client.project_id
    }    
        
    const resFunction = ()=>{
        
        
        let d: Response<GetAccountResponse> = {
            data: data,
            message: '',
            status: responseStatus.submit,
            type: actionType.getAccount
        }

        socket?.emit('walletConnect:send_data' , {
            data: d,
            project_id: clientId,
        })
        
    }

    const rejFunction = (message?: string) =>{
        let d: Response<GetAccountResponse> = {
            data: {
                public: ''
            },
            message: message,
            status: responseStatus.reject,
            type: actionType.getAccount
        }
        socket?.emit('walletConnect:send_data' , {
            data: d,
            project_id: clientId, 
        })
    }

    if(status == responseStatus.submit){
        resFunction()
    }else{
        rejFunction()
    }

}

