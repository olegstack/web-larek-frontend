import { IProduct } from '../types';
import { Component } from './base/Component';
import { IEvents } from './base/events';

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export interface ICard extends IProduct {
	changeName: boolean;
	basketItemIndex?: number;
}

export class ProductCard extends Component<ICard> {
	protected _image?: HTMLImageElement;
	protected _title: HTMLElement;
	protected _category?: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;
	protected _description?: HTMLElement;

	constructor(container: HTMLElement, protected actions: ICardActions) {
		super(container);

		// Инициализация элементов карточки
		this._title = container.querySelector('.card__title');
		this._image = container.querySelector('.card__image');
		this._category = container.querySelector('.card__category');
		this._price = container.querySelector('.card__price');
		this._description = container.querySelector('.card__text');
		this._button = container.querySelector('.card__button');

		// Установка обработчиков событий
		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set category(value: string) {
		this.setText(this._category, value);
		this._category?.classList.remove(
			'card__category_soft',
			'card__category_other',
			'card__category_additional',
			'card__category_button',
			'card__category_hard'
		);

		if (value === 'софт-скил') {
			this._category?.classList.add('card__category_soft');
		} else if (value === 'другое') {
			this._category?.classList.add('card__category_other');
		} else if (value === 'дополнительное') {
			this._category?.classList.add('card__category_additional');
		} else if (value === 'кнопка') {
			this._category?.classList.add('card__category_button');
		} else if (value === 'хард-скил') {
			this._category?.classList.add('card__category_hard');
		}
	}

	set description(value: string) {
		if (this._description) {
			this.setText(this._description, value);
		}
	}

	set price(value: number | null) {
		if (value === null) {
			this.setText(this._price, 'Бесценно');
			this.setDisabled(this._button, true);
		} else {
			this.setText(this._price, `${value} синапсов`);
			this.setDisabled(this._button, false);
		}
	}
	

	set changeName(productInBasket: boolean) {
		if (!productInBasket) {
			this.setText(this._button, 'В корзину');
		} else {
			this.setText(this._button, 'Убрать из корзины');
		}
	}

	setData(product: IProduct): void {
		this.title = product.title;
		this.image = product.image;
		this.category = product.category;
		this.price = product.price;
		this.description = product.description || '';
		this.container.dataset.productId = product.id;
	}

	get id(): string {
		return this.container.dataset.productId || '';
	}
}

export class CardInBasket extends ProductCard {
	protected _basketItemIndex: HTMLElement;

	constructor(container: HTMLElement, actions: ICardActions) {
		super(container, actions);
		this._basketItemIndex = container.querySelector('.basket__item-index');
	}

	set basketItemIndex(value: number) {
		this.setText(this._basketItemIndex, value.toString());
	}
}
