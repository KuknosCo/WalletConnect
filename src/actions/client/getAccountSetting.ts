import * as KuknosSdk from "stellar-sdk";
import { horizon } from "./../../config/config";
import {  windowConfig  } from "../../config/config";
import { accountBlancesResponse, accountSettingResponse, curveDecryptRequest, curveDecryptResponse, GetAccountResponse, SignDataRequest, SignDataResponse } from "../../interfaces/action.interface";
import {Response, responseStatus } from "../../interfaces/response.interface";
import { actionType } from "../../interfaces/setting.interface";
import { Socket } from 'socket.io-client'
import { Request } from "../../interfaces/request.interface";
import { Client } from "../../kuknos-wallet-connect";


export function getAccountSetting(client: Client, publicKey: string): Promise<Response<accountSettingResponse>> {
	return new Promise(async (resolve, reject) => {
		if (!publicKey) {
			reject("publicKey should not be empty");
			return;
		}
		try {
			let account = await new KuknosSdk.Server(horizon)
				.accounts()
				.accountId(publicKey)
				.call()
				.then((result) => result);

            let res: Response<accountSettingResponse> = {
                type: actionType.accountSetting,
                status: responseStatus.submit,
                message: '',
                data: {
                    public: publicKey,
                    network: client.network,
                    setting: {
                        thresholds: account.thresholds,
                        flags: account.flags,
                        inflation_destination: account.inflation_destination,
                        home_domain: account.home_domain,
                        signers: account.signers,
                    },
                }
            }


			resolve(res);
		} catch (error) {
			reject(error);
		}
	});
}
