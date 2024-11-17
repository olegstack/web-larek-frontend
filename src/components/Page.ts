import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';

interface IPage {
	counter: number;
	catalog: HTMLElement;
	locked: boolean;
}

export class Page extends Component<IPage> {
	protected _counter: HTMLElement;
	protected _catalog: HTMLElement;
	protected _wrapper: HTMLElement;
	protected _basket: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		// Инициализация основных элементов страницы
		this._counter = ensureElement<HTMLElement>('.header__basket-counter');
		this._catalog = ensureElement<HTMLElement>('.gallery');
		this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
		this._basket = ensureElement<HTMLElement>('.header__basket');

		// Добавляем обработчик клика на иконку корзины
		this._basket.addEventListener('click', () => {
			this.events.emit('basket:open'); // Инициирует событие открытия корзины
		});
	}

	// Устанавливает значение счетчика корзины
	set counter(value: number) {
		this.setText(this._counter, String(value));
	}

	// Устанавливает содержимое каталога товаров
	set catalog(items: HTMLElement[]) {
		this._catalog.replaceChildren(...items);
	}

	// Управляет состоянием блокировки страницы
	set locked(value: boolean) {
		if (value) {
			this.toggleClass(this._wrapper, 'page__wrapper_locked', true);
		} else {
			this._wrapper.classList.remove('page__wrapper_locked');
		}
	}
}
