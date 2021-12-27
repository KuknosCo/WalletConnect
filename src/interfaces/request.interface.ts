import { SignDataRequest } from "./action.interface"
import { Response } from "./response.interface"
import { actionType, clientApp } from "./setting.interface"


export interface requestFn<T = SignDataRequest>{
    (   
        type: actionType,
        client: clientApp,
        data: T,
    ) : void
}

export interface Request<T = SignDataRequest>{
    type: actionType
    client: clientApp
    data: T
}