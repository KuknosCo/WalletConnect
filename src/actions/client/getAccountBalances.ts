import * as KuknosSdk from "js-kuknos-sdk";
import { horizon } from "./../../config/config";
import {  windowConfig  } from "../../config/config";
import { accountBlancesResponse, curveDecryptRequest, curveDecryptResponse, GetAccountResponse, SignDataRequest, SignDataResponse } from "../../interfaces/action.interface";
import {Response, responseStatus } from "../../interfaces/response.interface";
import { actionType } from "../../interfaces/setting.interface";
import { Socket } from 'socket.io-client'
import { Request } from "../../interfaces/request.interface";
import { Client } from "../../kuknos-wallet-connect";


export function getAccountBalances(client: Client,publicKey: string): Promise<Response<accountBlancesResponse>> {
	return new Promise(async (resolve, reject) => {
		if(!publicKey){
            reject('publicKey should not be empty')
            return
        }
		try {
			let account = await new KuknosSdk.Server(horizon)
				.accounts()
				.accountId(publicKey)
				.call()
				.then((result) => result);

			let balances = account.balances.map((item: any) => {
				let availableBalance = 0;
				if (item.asset_type === "native") {
					availableBalance = calculateAvailablePMN(account.balances , account.subentry_count);
				} else {
					availableBalance =
						parseFloat(item.balance) - parseFloat(item.selling_liabilities);
				}
				return {
					asset_type: item.asset_type,
					asset_code: item.asset_type === "native" ? "PMN" : item.asset_code,
					balance: parseFloat(item.balance),
					available_balance: availableBalance,
					buying_liabilities: item.buying_liabilities,
					selling_liabilities: item.selling_liabilities,
					limit: item.limit ? item.limit : "unlimited",
				};
			});

            let res:Response<accountBlancesResponse> = {
                type: actionType.getBalance,
                status: responseStatus.submit,
                message: '',
                data: {
                    public: publicKey,
                    network: client.network,
                    balances: balances 
                }
            }

			resolve(res);
		} catch (error) {
			reject(error);
		}
	});
}

function calculateAvailablePMN(balances:any, subentry_count:any) {
	try {
		let reserve = 1;
		reserve += subentry_count * 0.5;
		reserve += parseFloat(
			balances.filter((e: any) => e.asset_type === "native")[0]
				.selling_liabilities
		);

		return (
			parseFloat(balances.filter((e:any) => e.asset_type === "native")[0].balance) -
			reserve
		);
	} catch (error) {
		return 0;
	}
}
