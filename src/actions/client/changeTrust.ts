// import { extensionUrl, network, windowConfig } from "../config/config";
// import { changeTrustEntry , changeTrustResponse } from "../interfaces/changeTrust.interface";
// import {  IIntentResponse, IntentResponseStatus } from "../interfaces/response.interface";

// export function changeTrust( data:changeTrustEntry ):Promise<changeTrustResponse>{
//     return new Promise((resolve , reject)=>{
//         if(!data.asset_code){
//             reject('Asset code should not be empty');
//             return;
//         }
//         if(data.asset_issuer && !data.limit){
//             reject('limit should not be empty');
//             return;
//         }

//         let confirmWin:any = window.open(
//             `${extensionUrl}/intent/change-trust?asset_code=${data.asset_code}&type=${data.type}&asset_issuer=${data.asset_issuer}&network=${network}`,
//             "myWindow",
//             `width=${windowConfig.width},height=${windowConfig.height},top=${windowConfig.top},left=${windowConfig.left},scrollbars=no`
//         );
//         const handleResponse = (response:IIntentResponse) => {            
//             if (response.data.status === IntentResponseStatus.submit) {
//                 resolve({
//                     ...response.data.data,
//                     network: network
//                 })
//                 window.removeEventListener("message", handleResponse);
//                 confirmWin.close();
//             }
    
//             if (response.data.status === IntentResponseStatus.reject) {
//                 window.removeEventListener("message", handleResponse);
//                 confirmWin.close();
//                 reject('Canceled by user')
//             }
//         };
//         let timer = setInterval(function () {
//             if (confirmWin.closed) {
//                 clearInterval(timer);
//                 window.removeEventListener("message", handleResponse);
//                 reject("Canceled by user");
//             }
//         }, 1000);
//         window.addEventListener("message", handleResponse);
//     })
    
// }