// import * as KuknosSdk from "js-kuknos-sdk";
// import { horizon , network } from "./../config/config";
// import { accountSettingEntry, accountSettingResponse } from "../interfaces/accountSetting.interface";

// export function getAccountSetting(project_id: string): Promise<accountSettingResponse> {
// 	return new Promise(async (resolve, reject) => {
// 		if (!project_id) {
// 			reject("project_id should not be empty");
// 			return;
// 		}
// 		try {
// 			let account = await new KuknosSdk.Server(horizon)
// 				.accounts()
// 				.accountId(project_id)
// 				.call()
// 				.then((result) => result);

// 			resolve({
// 				public: project_id,
// 				network: network,
// 				setting: {
// 					thresholds: account.thresholds,
// 					flags: account.flags,
// 					inflation_destination: account.inflation_destination,
// 					home_domain: account.home_domain,
// 					signers: account.signers,
// 				},
// 			});
// 		} catch (error) {
// 			reject(error);
// 		}
// 	});
// }
