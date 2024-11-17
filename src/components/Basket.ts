import { createElement, ensureElement, formatNumber } from '../utils/utils';
import { Component } from './base/Component';
import { EventEmitter } from './base/events';

interface IBasketView {
	items: HTMLElement[];
	total: number;
	selected: string[];
}

export class Basket extends Component<IBasketView> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		// Инициализация элементов корзины
		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.basket__button');

		// Добавление обработчика события для кнопки оформления заказа
		if (this._button) {
			this._button.addEventListener('click', () => {
				this.events.emit('order:open'); // Событие для открытия формы заказа
			});
		}

		this.items = []; // Инициализация пустого списка товаров
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this.toggleButton(this._button, false); //показываем кнопку оформления заказа
			this._list.replaceChildren(...items);
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
			this.toggleButton(this._button, true); //блокируем кнопку оформления заказа
		}
	}

	set total(total: number) {
		this.setText(this._total, `${formatNumber(total)} синапсов`);
	}
}
