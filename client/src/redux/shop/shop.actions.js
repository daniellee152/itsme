import shopActionTypes from './shop.types';

export const getCollection = collection => ({
  type: shopActionTypes.GET_COLLECTION,
  payload: collection
});
