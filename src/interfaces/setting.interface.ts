export enum walletType {
    pwa = "pwa",
    android = "android",
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
    changeTrust = "change-trust"
}

export interface clientApp{
    project_id: string,
    meta: meta
}

