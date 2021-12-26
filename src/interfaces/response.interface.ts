import { actionType } from "./setting.interface";

export interface Response<T = {}>{
	status: responseStatus;
	type: actionType;
	message?: string;
	data: T ;
}
export enum responseStatus {
	submit = "submit",
	reject = "reject",
}



