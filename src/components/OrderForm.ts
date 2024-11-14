import { IOrder, ModalForm } from '../types';
import { ensureAllElements } from '../utils/utils';
import { IEvents } from './base/events';
import { Form } from './common/Form';

export class OrderForm extends Form<ModalForm> {
	protected _paymentButtons: HTMLButtonElement[];
	protected _addressInput: HTMLInputElement;
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		// Получаем кнопки выбора способа оплаты
		this._paymentButtons = ensureAllElements<HTMLButtonElement>(
			'.button_alt',
			container
		);

		// Добавляем обработчики кликов для кнопок выбора способа оплаты
		this._paymentButtons.forEach((button) => {
			button.addEventListener('click', () => {
				this.updatePaymentMethod(button.name);
				this.events.emit(`${this.container.name}.payment:change`, {
					field: 'payment',
					value: button.name,
				});
			});
		});
	}

	// Метод для обновления состояния кнопок оплаты
	updatePaymentMethod(name: string) {
		this._paymentButtons.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', button.name === name);
			this.setDisabled(button, button.name === name);
		});
	}

	// Устанавливаем адрес
	set address(value: string) {
		const addressInput = this.container.elements.namedItem(
			'address'
		) as HTMLInputElement;
		if (addressInput) {
			addressInput.value = value;
		}
	}
}
