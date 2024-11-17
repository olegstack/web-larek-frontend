export interface IProduct {
	title: string;
	category: string;
	price: number | null;
	image: string;
	description?: string;
	id: string;
	productInBasket?: boolean;
	basketItemIndex?: number;
}

export interface IOrder {
	payment: string;
	address: string;
	phone: string;
	email: string;
	total: number;
	items: string[];
}

export interface IAppState {
	catalog: IProduct[];
	basket: IProduct[];
	order: IOrder;
}

export type ModalForm = Pick<IOrder, 'payment' | 'address'>;

export type ModalContact = Pick<IOrder, 'phone' | 'email'>;

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export type ISuccess = Pick<IOrder, 'total'>;

export interface ISuccessAction {
	onClick: () => void;
}

export interface IOrderResponse {
	id: string;
	total: number;
}
