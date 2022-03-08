import { extensionUrl, windowConfig , network } from "../../config/config";
import { GetAccountResponse } from "../../interfaces/action.interface";
import {Response, responseStatus } from "../../interfaces/response.interface";
import { actionType } from "../../interfaces/setting.interface";


export function getAccount_browserExtension_client():Promise<Response<GetAccountResponse>>{
    return new Promise((resolve , reject)=>{
        let confirmWin:any = window.open(
            `${extensionUrl}/intent/account-publickey?network=${network}`,
            "myWindow",
            `width=${windowConfig.width},height=${windowConfig.height},top=${windowConfig.top},left=${windowConfig.left},scrollbars=no`
        );
        const handleResponse = (response:any) => {    
            const data:Response<GetAccountResponse> = response.data;     
            if (data.status === responseStatus.submit) {
                const res: Response<GetAccountResponse> = {
                    status: responseStatus.submit,
                    type: actionType.getAccount,
                    message: '',
                    data: data.data
                }
                window.removeEventListener("message", handleResponse);
                confirmWin.close();
                resolve(res)
            }
    
            if (data.status === responseStatus.reject) {
                window.removeEventListener("message", handleResponse);
                confirmWin.close();
                const res: Response<GetAccountResponse> = {
                    status: responseStatus.reject,
                    type: actionType.getAccount,
                    message: 'Canceled by user',
                    data: data.data
                }
                reject(res)
            }

        };
        let timer = setInterval(function () {
            if (confirmWin.closed) {
                clearInterval(timer);
                window.removeEventListener("message", handleResponse);
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
        }, 1000);
        window.addEventListener("message", handleResponse);
    })
    
}