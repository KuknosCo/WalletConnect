// import * as KuknosSdk from "js-kuknos-sdk";
// import { horizon, network } from "./../config/config";
// import { accountBlancesResponse } from "../interfaces/accountBalances.interface";

// export function getAccountBalances(project_id: string): Promise<accountBlancesResponse> {
// 	return new Promise(async (resolve, reject) => {
// 		if(!project_id){
//             reject('project_id should not be empty')
//             return
//         }
// 		try {
// 			let account = await new KuknosSdk.Server(horizon)
// 				.accounts()
// 				.accountId(project_id)
// 				.call()
// 				.then((result) => result);

// 			let balances = account.balances.map((item: any) => {
// 				let availableBalance = 0;
// 				if (item.asset_type === "native") {
// 					availableBalance = calculateAvailablePMN(account.balances , account.subentry_count);
// 				} else {
// 					availableBalance =
// 						parseFloat(item.balance) - parseFloat(item.selling_liabilities);
// 				}
// 				return {
// 					asset_type: item.asset_type,
// 					asset_code: item.asset_type === "native" ? "PMN" : item.asset_code,
// 					balance: parseFloat(item.balance),
// 					available_balance: availableBalance,
// 					buying_liabilities: item.buying_liabilities,
// 					selling_liabilities: item.selling_liabilities,
// 					limit: item.limit ? item.limit : "unlimited",
// 				};
// 			});

// 			resolve({
// 				public: project_id,
// 				balances: balances,
// 				network: network
// 			});
// 		} catch (error) {
// 			reject(error);
// 		}
// 	});
// }

// function calculateAvailablePMN(balances:any, subentry_count:any) {
// 	try {
// 		let reserve = 1;
// 		reserve += subentry_count * 0.5;
// 		reserve += parseFloat(
// 			balances.filter((e: any) => e.asset_type === "native")[0]
// 				.selling_liabilities
// 		);

// 		return (
// 			parseFloat(balances.filter((e:any) => e.asset_type === "native")[0].balance) -
// 			reserve
// 		);
// 	} catch (error) {
// 		return 0;
// 	}
// }
