import { createSelector } from 'reselect';

const slectCart = state => state.cart;

export const selectCartHidden = createSelector(
  [slectCart],
  cart => cart.hidden
);
