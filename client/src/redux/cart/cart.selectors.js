import { createSelector } from 'reselect';

const slectCart = state => state.cart;

export const selectCartHidden = createSelector(
  [slectCart],
  cart => cart.hidden
);

export const selectCartItems = createSelector(
  [slectCart],
  cart => cart.cartItems
);

export const selectCartItemsCount = createSelector(
  [selectCartItems],
  cartItems =>
    cartItems.reduce(
      (accumulator, cartItem) => accumulator + cartItem.quantity,
      0
    )
);

export const selectCartTotal = createSelector([selectCartItems], cartItems =>
  cartItems.reduce(
    (accumulator, cartItem) => accumulator + cartItem.quantity * cartItem.price,
    0
  )
);
