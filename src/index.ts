import './scss/styles.scss';
import { AppApi } from './components/AppApi';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { AppState } from './components/AppState';
import { Page } from './components/Page';
import { ProductCard, CardInBasket } from './components/ProductCard';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Modal } from './components/common/Modal';
import { Basket } from './components/common/Basket';
import { OrderForm } from './components/OrderForm';
import { Success } from './components/common/Success';
import { ModalContacts } from './components/ModalContact';
import { IOrderResponse, ModalForm, ModalContact } from './types';
import { ProductItem } from './components/ProductItem';

const events = new EventEmitter();
const api = new AppApi(CDN_URL, API_URL);

// Шаблоны для элементов интерфейса
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Инициализация модели данных
const appData = new AppState({}, events);

// Основные компоненты интерфейса
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new OrderForm(cloneTemplate(orderTemplate), events);
const contacts = new ModalContacts(cloneTemplate(contactTemplate), events);
const success = new Success(cloneTemplate(successTemplate), {
	onClick: () => {
		modal.close();
		appData.clearBasket();
		events.emit('basket:changed');
	},
});

// Загрузка каталога продуктов
api.getProductList().then((productList) => {
	appData.setCatalog(productList);
	events.emit('items:changed');
});

// Обработка изменения каталога
events.on('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const cardContainer = cloneTemplate(cardCatalogTemplate);
		const card = new ProductCard(cardContainer, {
			onClick: () => events.emit('card:select', item),
		});
		card.setData(item);
		return cardContainer;
	});
	page.counter = appData.getProductsInBasket().length;
});

// Обработка выбора товара
events.on('card:select', (item: ProductItem) => {
	appData.setPreview(item);
	events.emit('preview:changed', item);
});

// Открытие модального окна с предварительным просмотром товара
events.on('preview:changed', (item: ProductItem) => {
	const card = new ProductCard(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			if (item.productInBasket) {
				appData.removeFromBasket(item);
			} else {
				appData.addToBasket(item);
			}
			modal.close();
			events.emit('basket:changed');
		},
	});
	modal.render({
		content: card.render({
			title: item.title,
			image: item.image,
			category: item.category,
			description: item.description,
			price: item.price,
			changeName: item.productInBasket,
		}),
	});
});

// Обновление содержимого корзины
events.on('basket:changed', () => {
	const cards = appData.getProductsInBasket().map((item, index) => {
		const cardContainer = cloneTemplate(cardBasketTemplate);
		const card = new CardInBasket(cardContainer, {
			onClick: () => {
				appData.removeFromBasket(item);
				events.emit('basket:changed');
			},
		});
		card.setData({ ...item, basketPosition: index + 1 });
		return cardContainer;
	});
	basket.items = cards;
	page.counter = appData.getProductsInBasket().length;
	basket.total = appData.getTotalPrice();
});

// Открытие формы заказа
events.on('order:open', () => {
	modal.render({
		content: order.render({
			payment: '',
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

// Обработка изменения формы заказа
events.on('formOrderErrors:change', (errors: Partial<ModalForm>) => {
	const { payment, address } = errors;
	order.valid = !payment && !address;
	order.errors = Object.values({ payment, address }).filter(Boolean).join('; ');
});

// Обработка изменения контактной информации
events.on('formContactsErrors:change', (errors: Partial<ModalContact>) => {
	const { email, phone } = errors;
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ email, phone }).filter(Boolean).join('; ');
});

// Отправка формы заказа
 events.on('order:submit', () => {
	modal.render({
		content: contacts.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

// Сабмит заказа
events.on('contacts:submit', () => {
	api
		.submitOrder(appData.getOrder())
		.then((result: IOrderResponse) => {
			appData.clearBasket();
			appData.clearOrder();
			page.counter = appData.getProductsInBasket().length;
			modal.render({
				content: success.render({
					total: result.total,
				}),
			});
			events.emit('basket:changed');
		})
		.catch((err) => {
			console.error('Error submitting order:', err);
		});
});

// Изменение поля заказа
events.on(
	/^order\..*:change/,
	(data: { field: keyof ModalForm; value: string }) => {
		appData.setModalForm(data.field, data.value);
	}
);

// Изменение поля контактной информации
events.on(
	/^contacts\..*:change/,
	(data: { field: keyof ModalContact; value: string }) => {
		appData.setModalContact(data.field, data.value);
	}
);

// Блокировка прокрутки страницы при открытии модального окна
events.on('modal:open', () => {
	page.locked = true;
});

// Разблокировка прокрутки при закрытии модального окна
events.on('modal:close', () => {
	page.locked = false;
});

// Открытие корзины
events.on('basket:open', () => {
	modal.render({
		content: basket.render(),
	});
	events.emit('basket:changed');
});

