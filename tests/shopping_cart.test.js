import test from 'node:test';
import assert from 'node:assert';
import { Product, ShoppingCart } from '../src/shopping_cart.js';

test('test_add_item_success', () => {
    const product = new Product("prod_1", "Смартфон", 50000.0, 10);
    const cart = new ShoppingCart();
    cart.addItem(product, 2);
    assert.strictEqual(cart.items.get("prod_1").quantity, 2);
});

test('test_add_item_invalid_quantity', () => {
    const product = new Product("prod_1", "Смартфон", 50000.0, 10);
    const cart = new ShoppingCart();
    
    assert.throws(() => {
        cart.addItem(product, 0);
    }, /Количество должно быть больше нуля/);

    assert.throws(() => {
        cart.addItem(product, -1);
    }, /Количество должно быть больше нуля/);
});

test('test_add_item_exceed_stock', () => {
    const product = new Product("prod_1", "Смартфон", 50000.0, 5);
    const cart = new ShoppingCart();
    
    assert.throws(() => {
        cart.addItem(product, 6);
    }, /Превышено доступное количество на складе/);
});

test('test_remove_item', () => {
    const product = new Product("prod_1", "Смартфон", 50000.0, 10);
    const cart = new ShoppingCart();
    cart.addItem(product, 5);
    cart.removeItem("prod_1", 2);
    assert.strictEqual(cart.items.get("prod_1").quantity, 3);
    
    cart.removeItem("prod_1");
    assert.strictEqual(cart.items.has("prod_1"), false);
});

test('test_total_price_and_promo', () => {
    const product1 = new Product("prod_1", "Товар 1", 100.0, 10);
    const product2 = new Product("prod_2", "Товар 2", 200.0, 10);
    const cart = new ShoppingCart();
    
    cart.addItem(product1, 2);
    cart.addItem(product2, 1);
    assert.strictEqual(cart.getTotalPrice(), 400.0);
    
    cart.apply_promo("DISCOUNT10");
    assert.strictEqual(cart.getTotalPrice(), 360.0);
    
    assert.throws(() => {
        cart.apply_promo("WRONGCODE");
    }, /Неверный промокод/);
});