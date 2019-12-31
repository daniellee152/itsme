import React from 'react';
import './cart-icon.styles.scss';
import { ReactComponent as ShoppingIcon } from '../assets/shopping-bag.svg';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectCartItemsCount } from '../../redux/cart/cart.selectors';
import { toggleCartHidden } from '../../redux/cart/cart.actions';

const CartIcon = ({ toggleCartHidden, count }) => {
  return (
    <div className="cart-icon" onClick={toggleCartHidden}>
      <ShoppingIcon className="shopping-icon" />
      <span className="item-count">{count}</span>
    </div>
  );
};

const mapDispatchToProps = dispatch => ({
  toggleCartHidden: () => dispatch(toggleCartHidden())
});

const mapStateToProps = createStructuredSelector({
  count: selectCartItemsCount
});

export default connect(mapStateToProps, mapDispatchToProps)(CartIcon);
