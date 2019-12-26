import React, { Component } from 'react';
import './header.styles.scss';
import { Link } from 'react-router-dom';
import { ReactComponent as Logo } from '../assets/crown.svg';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectCurrentUser } from '../../redux/user/user.selectors';

class Header extends Component {
  handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.clear();
    window.location = '/';
  };

  render() {
    const { currentUser } = this.props;
    return (
      <div className="header">
        <Link to="/" className="logo-container">
          <Logo className="logo" />
        </Link>
        <div className="options">
          <Link className="option" to="/aboutme">
            ABOUT ME
          </Link>
          {currentUser ? (
            <div className="option" onClick={this.handleLogout}>
              SIGN OUT
            </div>
          ) : (
            <Link to="/signin" className="option">
              SIGN IN
            </Link>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser
});

export default connect(mapStateToProps)(Header);
