import { Api, ApiListResponse } from './base/api';
import { IProduct, IOrder, IOrderResponse } from '../types';

// Интерфейс, описывающий методы API для работы с продуктами и заказами
export interface IAppAPI {
	getProductList(): Promise<IProduct[]>;
	submitOrder: (order: IOrder) => Promise<IOrderResponse>;
}

export class AppApi extends Api implements IAppAPI {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	// Получить список продуктов с сервера
	async getProductList(): Promise<IProduct[]> {
		return this.get('/product').then((data: ApiListResponse<IProduct>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	submitOrder(order: IOrder): Promise<IOrderResponse> {
		return this.post(`/order`, order).then((data: IOrderResponse) => data);
	}
}
