export class Product {
    constructor(id, name, price, stock) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.stock = stock;
    }
}

export class ShoppingCart {
    constructor() {
        this.items = new Map(); // Храним товары по id
        this.discount = 0.0;
    }

    addItem(product, quantity) {
        if (quantity <= 0) {
            throw new Error("Количество должно быть больше нуля");
        }
        
        const currentItem = this.items.get(product.id);
        const currentInCart = currentItem ? currentItem.quantity : 0;
        const totalRequested = currentInCart + quantity;
        
        if (totalRequested > product.stock) {
            throw new Error("Превышено доступное количество на складе");
        }
        
        if (currentItem) {
            currentItem.quantity = totalRequested;
        } else {
            this.items.set(product.id, {
                product: product,
                quantity: quantity
            });
        }
    }

    removeItem(productId, quantity = null) {
        if (!this.items.has(productId)) {
            return;
        }
        
        const currentItem = this.items.get(productId);
        if (quantity === null || quantity >= currentItem.quantity) {
            this.items.delete(productId);
        } else {
            currentItem.quantity -= quantity;
        }
    }

    applyPromo(code) {
        if (code === "DISCOUNT10") {
            this.discount = 0.10;
        } else if (code === "DISCOUNT20") {
            this.discount = 0.20;
        } else {
            throw new Error("Неверный промокод");
        }
    }

    getTotalPrice() {
        let total = 0;
        for (const item of this.items.values()) {
            total += item.product.price * item.quantity;
        }
        return total * (1.0 - this.discount);
    }
}