export interface IResGetPayments {
	ok:   boolean;
	msg:  string;
	data: IGetDataPayments[];
}

export interface IGetDataPayments {
	id:          number;
	description: string;
	icon?: any;
}