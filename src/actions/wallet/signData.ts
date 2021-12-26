import { extensionUrl, windowConfig , network } from "../../config/config";
import { GetAccountResponse, SignDataRequest, SignDataResponse } from "../../interfaces/action.interface";
import { Request, requestFn } from "../../interfaces/request.interface";
import {Response, responseStatus } from "../../interfaces/response.interface";
import { actionType, clientApp } from "../../interfaces/setting.interface";
import { Socket } from 'socket.io-client'

export function signData_walletConnect_wallet(socket:Socket | undefined ,fn: requestFn<SignDataRequest, SignDataResponse>){

    let reqData: SignDataRequest 
    let clientId: string
    const resFunction = (res: SignDataResponse)=>{
        let d: Response<SignDataResponse> = {
            data: res,
            message: '',
            status: responseStatus.submit,
            type: actionType.signData
        }
        socket?.emit('send_data' , {
            data: d,
            project_id: clientId,
        })
    }

    const rejFunction = (message: string)=>{
        let d: Response<SignDataResponse> = {
            data: {
                public: '',
                signature: ''
            },
            message: message,
            status: responseStatus.reject,
            type: actionType.signData
        }
        socket?.emit('send_data' , {
            data: d,
            project_id: clientId,
        })
    }


    socket?.on('receive_data' , (data: Request<SignDataRequest>)=>{
        if(data.type === actionType.signData){
            reqData = data.data
            clientId = data.project_id
            fn(reqData, resFunction, rejFunction)
        }
        
    })


    
    

   

}

