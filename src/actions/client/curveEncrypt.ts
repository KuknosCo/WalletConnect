import * as kuknusSdk from "js-kuknos-sdk";
import e2c from "ed2curve";
import sodium_api from "libsodium-wrappers";
import { curveDecryptResponse, curveEncryptRequest, curveEncryptResponse } from "../../interfaces/action.interface";
import { Response, responseStatus } from "../../interfaces/response.interface";
import { actionType } from "../../interfaces/setting.interface";

export async function curveEncrypt(data: curveEncryptRequest):Promise<Response<curveEncryptResponse>> {
	return new Promise(async (resolve, reject) => {
		let publickey = data.publickey;
		let plainText = data.plain_text
        
		try {
			let pub: any = publickey;
			await sodium_api.ready;
			plainText = JSON.stringify(plainText);
			var buf = Buffer.from(plainText);
			pub = kuknusSdk.StrKey.decodeEd25519PublicKey(pub);
			pub = e2c.convertPublicKey(pub);
			var secretData = sodium_api.crypto_box_seal(buf, pub);
			let base64String = btoa(
				secretData.reduce(function (plainText, byte) {
					return plainText + String.fromCharCode(byte);
				}, "")
			)

            const res:Response<curveEncryptResponse> = {
                status: responseStatus.submit,
                type: actionType.curveEncrypt,
                message: '',
                data: {
                    cipher_text: base64String
                }
            }
			resolve(res);
		} catch (error) {
            const res:Response<curveEncryptResponse> = {
                status: responseStatus.reject,
                type: actionType.curveEncrypt,
                message: JSON.stringify(error),
                data: {
                    cipher_text: ''
                }
            }
			reject(res);
		}
	});
}
