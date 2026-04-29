import Cart from "../models/cart.model.js";
import { getAvailableQuantity } from "../services/inventory.service.js";

export const buildPopulatedCartResponse = async (userId) => {
  const cart = await Cart.findOne({ user: userId }).populate({
    path: "cartItems.product",
    select: "title price images countInStock",
  });

  if (!cart) {
    return { cartItems: [] };
  }

  const originalLength = cart.cartItems.length;
  cart.cartItems = cart.cartItems.filter((item) => item.product !== null);

  const cartItemsWithAvailability = await Promise.all(
    cart.cartItems.map(async (item) => {
      const availableQuantity = await getAvailableQuantity(item.product._id);
      return {
        ...item.toObject(),
        availableQuantity,
        inStock: availableQuantity > 0,
        hasEnoughStock: availableQuantity >= item.quantity,
      };
    })
  );

  if (cart.cartItems.length < originalLength) {
    await cart.save();
  }

  return {
    ...cart.toObject(),
    cartItems: cartItemsWithAvailability,
  };
};
