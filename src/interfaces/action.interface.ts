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






















// gete balance
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







// account setting
export interface accountSettingEntry{
    project_id: string
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


// change trust
export interface changeTrustEntry{
    type: 'add'|'remove',
    asset_code: string,
    asset_issuer?: string,
    limit?: number
}

export interface changeTrustResponse {
    public: string;
	status: string;
}


// create account
export interface createAccountresponse{
    public: string;
	signature: string;
}



// curve decrypt
export interface curveDecryptResponse{
    public: string;
	data: string;
}


//curve encrypt
export interface curveEncryptEntry{
    data: string,
    project_id: string
}

export interface curveEncryptResponse{
    ciphertext: string;
}


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


//sign data



//sign xdr
export interface signXdrResponse {
	public: string;
	xdr: string;
	network: string
}



//
