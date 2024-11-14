import {
	IProduct,
	IOrder,
	IAppState,
	FormErrors,
	ModalContact,
	ModalForm,
} from '../types';
import { IEvents } from './base/events';
import { Model } from './base/Model';
import { ProductItem } from './ProductItem';

export type CatalogChangeEvent = {
	catalog: ProductItem[];
};

export class AppState extends Model<IAppState> {
	basket: ProductItem[] = [];
	catalog: ProductItem[] = [];
	order: IOrder = {
		address: '',
		email: '',
		phone: '',
		payment: '',
		items: [],
		total: 0,
	};
	preview: string | null = null;
	formErrors: FormErrors = {};

	// Устанавливаем каталог продуктов
	setCatalog(items: IProduct[]) {
		this.catalog = items.map((item) => new ProductItem(item, this.events));
		this.emitChanges('catalog:updated', { catalog: this.catalog });
	}

	// Устанавливаем товар для предпросмотра
	setPreview(item: ProductItem) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	// Получаем товары, находящиеся в корзине
	getProductsInBasket() {
		return this.catalog.filter((item) => item.productInBasket);
	}

	// Добавляем товар в корзину
	addToBasket(item: ProductItem) {
		const product = this.catalog.find((product) => product.id === item.id);
		if (product && !product.productInBasket) {
			product.addToBasket();
			this.basket.push(product);
			this.updateOrderItems();
			this.emitChanges('basket:updated', { basket: this.basket });
		}
	}

	// Удаляем товар из корзины
	removeFromBasket(item: ProductItem) {
		const product = this.catalog.find((product) => product.id === item.id);
		if (product && product.productInBasket) {
			product.removeFromBasket();
			this.basket = this.basket.filter(
				(basketItem) => basketItem.id !== item.id
			);
			this.updateOrderItems();
			this.emitChanges('basket:updated', { basket: this.basket });
		}
	}

	// Получаем общую стоимость товаров в корзине
	getTotalPrice(): number {
		return this.getProductsInBasket().reduce(
			(acc, item) => acc + (item.price || 0),
			0
		);
	}

	// Очистка корзины
	clearBasket() {
		this.basket.forEach((item) => item.removeFromBasket());
		this.basket = [];
		this.updateOrderItems();
		this.emitChanges('basket:cleared', {});
	}

	// Очистка заказа
	clearOrder() {
		this.order = {
			address: '',
			email: '',
			phone: '',
			payment: '',
			total: 0,
			items: [],
		};
		this.emitChanges('order:cleared', this.order);
	}

	// Обновление данных заказа на основе корзины
	updateOrderItems() {
		this.order.items = this.getProductsInBasket().map((item) => item.id);
		this.order.total = this.getTotalPrice();
	}

	setModalForm(field: keyof ModalForm, value: string) {
		this.order[field] = value;
		this.validateModalForm();
	}

	setModalContact(field: keyof ModalContact, value: string) {
		this.order[field] = value;
		this.validateModalContact();
	}

	validateModalForm() {
		const errors: typeof this.formErrors = {};
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес доставки';
		}
		if (!this.order.payment) {
			errors.payment = 'Необходимо указать способ оплаты';
		}
		this.formErrors = errors;
		this.events.emit('formOrderErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	validateModalContact() {
		const errors: typeof this.formErrors = {};
		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		const phoneRegex = /^(\+7|8)[0-9]{10}$/;

		// Валидация email
		if (!this.order.email) {
			errors.email = 'Заполните адрес электронной почты';
		} else if (!emailRegex.test(this.order.email)) {
			errors.email = 'Неправильно введен адрес электронной почты';
		}

		// Валидация номера телефона
		if (!this.order.phone) {
			errors.phone = 'Заполните номер телефона';
		} else {
			let phone = this.order.phone;
			if (phone.startsWith('8')) {
				phone = `+7${phone.slice(1)}`; // Заменяем 8 на +7
			}

			if (!phoneRegex.test(phone)) {
				errors.phone = 'Неправильно введен номер телефона';
			}
		}

		this.formErrors = errors;
		this.events.emit('formContactsErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	// Получение текущего заказа
	getOrder(): IOrder {
		this.order.total = this.getTotalPrice();
		this.order.items = this.getProductsInBasket().map((item) => item.id);
		return this.order;
	}
}
