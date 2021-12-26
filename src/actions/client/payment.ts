// import { extensionUrl, windowConfig  , network} from "../config/config";
// import { paymentEntry, paymentresponse } from "../interfaces/payment.interface";
// import { IIntentResponse, IntentResponseStatus } from "../interfaces/response.interface";

// export function payment(data:paymentEntry):Promise<paymentresponse>{
//     return new Promise((resolve , reject)=>{

//         if(!data.asset_code || !data.amount || !data.destination){
//             reject('Amount and destination and asset code should not be empty');
//             return;
//         }

//         let confirmWin:any = window.open(
//             `${extensionUrl}/intent/payment?asset_code=${data.asset_code}&amount=${data.amount}&asset_issuer=${data.asset_issuer}&destination=${data.destination}&memo=${data.memo}&network=${network}`,
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