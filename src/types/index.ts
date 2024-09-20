// Интерфейс карточек товара
export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;
}

// Интерфейс выбранной карточки товара
export interface IProductCardData {
	products: IProduct[];
	preview: string | null;
	addProduct(product: IProduct): void; // Добавление товара в список
	getProductById(productId: string): IProduct | undefined; // Получение товара по ID
	setPreviewProduct(productId: string): void; // Установка товара для предпросмотра
	getAllProducts(): IProduct[]; // Получение всех товаров
}

// Интерфейс корзины
export interface ICartData {
	items: ICartItem[];
	totalPrice: number;
	addItem(product: IProduct, quantity: number): void; // Добавление товара в корзину
	deleteItem(productId: string): void; // Удаление товара из корзины
	clearCart(): void; // Очистка корзины
	calculateTotalPrice(): number; // Расчет общей стоимости товаров
	getCartItems(): ICartItem[]; // Получение списка товаров в корзине
}
// Интерфейс элемента корзины
export interface ICartItem {
	product: IProduct; //описывает сам товар
	quantity: number; //число, кол-ва товара
}

export interface IValidationData {
	validateAddress(address: string): boolean; // Валидация адреса
	validatePhoneNumber(phoneNumber: string): boolean; // Валидация номера телефона
	validateEmail(email: string): boolean; // Валидация email
	validatePaymentMethod(paymentMethod: PaymentMethod): boolean; // Проверка метода оплаты
}

// Определения способа оплаты товара
export enum PaymentMethod {
	online = 'online',
	onDelivery = 'on_delivery',
}
