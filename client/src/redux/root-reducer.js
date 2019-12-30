import { combineReducers } from 'redux';
import directoryReducer from './directory/directory.reducer';
import userReducer from './user/user.reducer';
import shopReducer from './shop/shop.reducer';
import cartReducer from './cart/cart.reducer';

const rootReducer = combineReducers({
  directory: directoryReducer,
  user: userReducer,
  shop: shopReducer,
  cart: cartReducer
});

export default rootReducer;
