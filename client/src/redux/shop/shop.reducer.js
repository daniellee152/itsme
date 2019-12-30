import shopActionTypes from './shop.types';

const shopReducer = (state = null, action) => {
  switch (action.type) {
    case shopActionTypes.GET_COLLECTION:
      return {
        ...state,
        ...action.payload
      };

    default:
      return state;
  }
};

export default shopReducer;
