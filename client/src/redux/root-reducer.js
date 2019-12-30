import { combineReducers } from 'redux';
import directoryReducer from './directory/directory.reducer';
import userReducer from './user/user.reducer';
import shopReducer from './shop/shop.reducer';

const rootReducer = combineReducers({
  directory: directoryReducer,
  user: userReducer,
  shop: shopReducer
});

export default rootReducer;
