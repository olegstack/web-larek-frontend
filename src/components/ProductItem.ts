import { IProduct } from '../types';
import { IEvents } from './base/events';
import { Model } from './base/Model';

export type CatalogChangeEvent = {
	catalog: ProductItem[];
};

export class ProductItem extends Model<IProduct> {
	id: string;
	title: string;
	description: string;
	category: string;
	image: string;
	price: number | null;
	productInBasket: boolean;

	// Метод для добавления товара в корзину
	addToBasket() {
		this.productInBasket = true;
		this.emitChanges('product:addedToBasket', { id: this.id });
	}

	// Метод для удаления товара из корзины
	removeFromBasket() {
		this.productInBasket = false;
		this.emitChanges('product:removedFromBasket', { id: this.id });
	}

	// Метод для проверки, находится ли продукт в корзине
	isInBasket(): boolean {
		return this.productInBasket;
	}
}
