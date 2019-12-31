import directoryReducer from './directory/directory.reducer';
import userReducer from './user/user.reducer';
import shopReducer from './shop/shop.reducer';
import cartReducer from './cart/cart.reducer';

import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import { combineReducers } from 'redux';

const persistConfig = {
  key: 'root',
  storage
};

const rootReducer = combineReducers({
  directory: directoryReducer,
  user: userReducer,
  shop: shopReducer,
  cart: cartReducer
});

export default persistReducer(persistConfig, rootReducer);
