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

	protected _categoryColor: Record<string, string> = {
		'софт-скил': 'soft',
		другое: 'other',
		дополнительное: 'additional',
		кнопка: 'button',
		'хард-скил': 'hard',
	};

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
		if (!this._category) {
			return;
		}
		this.setText(this._category, value);

		// Добавляем класс текущей категории
		const categoryClass = this._categoryColor[value];
		this.toggleClass(this._category, `card__category_${categoryClass}`, true);
	}

	set description(value: string) {
		if (this._description) {
			this.setText(this._description, value);
		}
	}

	set price(value: number | null) {
		if (value === null) {
			this.setText(this._price, 'Бесценно');
			this.toggleButton(this._button, true);
		} else {
			this.setText(this._price, `${value} синапсов`);
			this.toggleButton(this._button, false);
		}
	}

	set changeName(productInBasket: boolean) {
		if (!productInBasket) {
			this.setText(this._button, 'В корзину');
		} else {
			this.setText(this._button, 'Убрать из корзины');
		}
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
