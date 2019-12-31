export const addItemToCart = (cartItems, itemToAdd) => {
  const existingCartItem = cartItems.find(
    cartItem => cartItem._id === itemToAdd._id
  );
  if (existingCartItem) {
    console.log('duplicated item');
    return cartItems.map(cartItem => {
      if (cartItem._id === itemToAdd._id) {
        return { ...cartItem, quantity: cartItem.quantity + 1 };
      }
      return cartItem;
    });
  }
  return [...cartItems, { ...itemToAdd, quantity: 1 }];
};
