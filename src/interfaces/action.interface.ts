import { Horizon } from "js-kuknos-sdk";





export interface GetAccountResponse{
    public: string;
}


export interface SignDataResponse {
	public: string;
	signature: string;
}
export interface SignDataRequest {
	data: string
}


export interface signXdrResponse {
	public: string;
	xdr: string;
	network: string
}
export interface signXdrRequest {
	xdr: string;
	network: string
}


export interface changeTrustResponse {
    public: string;
	status: string;
	transaction_hash: string;
}
export interface changeTrustRequest{
    type: 'add'|'remove',
    asset_code: string,
    asset_issuer?: string,
    limit?: number,
	network?: string
}


export interface createAccountResponse{
    public: string;
	signature: string;
}
export interface createAccountRequest{
    identifier: string
}


export interface curveEncryptResponse{
    cipher_text: string;
}
export interface curveEncryptRequest{
    plain_text: string,
    publickey: string
}


export interface curveDecryptResponse{
    public: string;
	plain_text: string;
}
export interface curveDecryptRequest{
	cipher_text: string;
}


export interface accountBlancesResponse{
    public: string;
	network: string;
	balances: balance[];
}
export interface balance {
	asset_code: string;
	asset_type: string;
	available_balance: number;
	balance: number;
	buying_liabilities: string;
	selling_liabilities: string;
	limit: string;
}



export interface accountSettingResponse {
	public: string;
	network: string;
	setting: {
		thresholds: Horizon.AccountThresholds;
		flags: Horizon.Flags;
		inflation_destination: string | undefined;
		home_domain: string | undefined;
		signers: Horizon.AccountSigner[];
	};
}






////////////////////////////////////////////////////////












// gete balance







// account setting




// curve decrypt




// payment
export interface paymentEntry{
    amount: number,
    destination: string,
    memo?: string,
    asset_code: string,
    asset_issuer?: string
}

export interface paymentresponse{
    public: string;
    network: string;
	status: string;
	transaction_hash: string;
}

// recover account
export interface recoverAccountResponse {
	public: string;
	signature: string;
}


