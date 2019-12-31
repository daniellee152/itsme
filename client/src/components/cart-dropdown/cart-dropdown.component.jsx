import React from 'react';
import './cart-dropdown.styles.scss';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import CustomButton from '../custom-button/custom-button.component';
import { selectCartItems } from '../../redux/cart/cart.selectors';
import CartItem from '../cart-item/cart-item.component';

const CartDropdown = ({ cartItems }) => {
  return (
    <div className="cart-dropdown">
      <div className="cart-items">
        {cartItems.length ? (
          cartItems.map(cartItem => (
            <CartItem key={cartItem._id} item={cartItem} />
          ))
        ) : (
          <span className="empty-message">Your cart is empty</span>
        )}
      </div>
      <CustomButton>CHECKOUT</CustomButton>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  cartItems: selectCartItems
});

export default connect(mapStateToProps)(CartDropdown);
