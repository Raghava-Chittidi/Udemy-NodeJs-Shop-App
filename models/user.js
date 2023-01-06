const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
  const existingItemIndex = this.cart.items.findIndex(
    (item) => item.productId.toString() === product._id.toString()
  );

  const updatedCart = { items: [...this.cart.items] };
  if (existingItemIndex >= 0) {
    const existingItem = this.cart.items[existingItemIndex];
    const updatedProduct = {
      ...existingItem,
      quantity: existingItem.quantity + 1,
    };
    updatedCart.items[existingItemIndex] = updatedProduct;
  } else {
    const updatedProduct = {
      productId: product._id,
      quantity: 1,
    };
    updatedCart.items.push(updatedProduct);
  }

  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.deleteCartItem = function (id) {
  const updatedItems = this.cart.items.filter(
    (item) => item.productId.toString() !== id.toString()
  );

  this.cart.items = updatedItems;
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
