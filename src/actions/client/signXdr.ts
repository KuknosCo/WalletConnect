// import { extensionUrl, network, windowConfig } from "../config/config";
// import {
// 	IIntentResponse,
// 	IntentResponseStatus,
// } from "../interfaces/response.interface";
// import { signXdrResponse } from "../interfaces/signXdr.interface";

// export async function signXdr(xdr: string): Promise<signXdrResponse> {
// 	return new Promise((resolve, reject) => {
// 		if (!xdr) {
// 			reject("xdr should not be empty");
// 			return;
// 		}
// 		let confirmWin: any = window.open(
// 			`${extensionUrl}/intent/sign-xdr?xdr=${encodeURIComponent(xdr)}&network=${network}`,
// 			"myWindow",
// 			`width=${windowConfig.width},height=${windowConfig.height},top=${windowConfig.top},left=${windowConfig.left},scrollbars=no`
// 		);
// 		const handleResponse = (response: IIntentResponse) => {
// 			if (response.data.status === IntentResponseStatus.submit) {
// 				resolve({
// 					public: response.data.data.project_id,
// 					xdr: response.data.data.xdr,
// 					network: network
// 				});

// 				window.removeEventListener("message", handleResponse);
// 				confirmWin.close();
// 			}

// 			if (response.data.status === IntentResponseStatus.reject) {
// 				window.removeEventListener("message", handleResponse);
// 				confirmWin.close();
// 				reject("Canceled by user");
// 			}
// 		};
// 		let timer = setInterval(function () {
// 			if (confirmWin.closed) {
// 				clearInterval(timer);
// 				window.removeEventListener("message", handleResponse);
// 				reject("Canceled by user");
// 			}
// 		}, 1000);
// 		window.addEventListener("message", handleResponse);
// 	});
// }
