import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import axios from 'axios';
import jwtDecoded from 'jwt-decode';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectCurrentUser } from './redux/user/user.selectors';
import { setCurrentUser } from './redux/user/user.actions';
import SignInAndSignUpPage from './pages/sign-in-and-sign-up/sign-in-and-sign-up.component';
import CollectionPage from './pages/collection/collection.component';
import Header from './components/header/header.component';
import HomePage from './pages/homepage/homepage.component';
import CheckoutPage from './pages/checkout/checkout.component';

class App extends Component {
  componentDidMount() {
    try {
      const jwt = localStorage.getItem('token');
      const id = jwtDecoded(jwt).id;

      axios({
        method: 'get',
        url: `http://localhost:9000/api/v1/users/${id}`,
        validateStatus: status => {
          return true; // I'm always returning true, you may want to do it depending on the status received
        },
        headers: { Authorization: jwt }
      })
        .catch(error => {})
        .then(res => {
          this.props.setCurrentUser(res.data.user);
        });
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    return (
      <div>
        <Header />
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/checkout" component={CheckoutPage} />
          <Route path="/shop/:collectionID" component={CollectionPage} />
          <Route
            exact
            path="/signin"
            render={() =>
              this.props.currentUser ? (
                <Redirect to="/" />
              ) : (
                <SignInAndSignUpPage />
              )
            }
          />
        </Switch>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setCurrentUser: user => dispatch(setCurrentUser(user))
  };
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
