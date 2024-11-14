import { ModalContact } from '../types';
import { IEvents } from './base/events';
import { Form } from './common/Form';

export class ModalContacts extends Form<ModalContact> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}
	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}
}
