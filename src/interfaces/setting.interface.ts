export enum walletType {
    browser_extension = "browser_extension",
    wallet_connect = "wallet_connect"
}

export enum network{
    public = "public",
    test = "test"
}

export interface initOptions {
    browser_extension_url?: string
    relay_server_url?: string
    network?: network,
    wallet_type?: walletType
    meta?: meta
    
}

export interface meta{
    title?: string
    logo?: string
    url?: string
}

export interface walletConnectLink{
    project_id: string
    meta?: meta

}

export enum actionType {
    getAccount = "account-publickey",
    signData = "sign-data",
    signXdr = "sign-xdr",
    changeTrust = "change-trust",
    createAccount = "create-account",
    curveEncrypt = "curve-encrypt",
    curveDecrypt = "curve-decrypt",
    accountBalance = "get_balance",
    accountSetting = "get_setting",
    payment = "payment"
}

export interface clientApp{
    project_id: string,
    meta: meta
}

