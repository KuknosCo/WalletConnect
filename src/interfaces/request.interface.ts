import { Response } from "./response.interface"
import { actionType } from "./setting.interface"


export interface requestFn<reqT = {}, resT = {}>{
    ( 
        req: reqT,
        res: (res: resT) => void,
        rej: (message: string) => void
    ) : void
}

export interface Request<T = {}>{
    type: actionType
    project_id: string,
    data: T
}