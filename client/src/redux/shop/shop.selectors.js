import { createSelector } from 'reselect';

const selectShop = state => state.shop;

export const selectItems = createSelector([selectShop], shop =>
  shop ? shop[0].items : null
);
