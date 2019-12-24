import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import SignInAndSignUpPage from './pages/sign-in-and-sign-up/sign-in-and-sign-up.component';

import CollectionPage from './pages/collection/collection.component';
import Header from './components/header/header.component';
import HomePage from './pages/homepage/homepage.component';

class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/shop/:collectionID" component={CollectionPage} />
          <Route path="/signin" component={SignInAndSignUpPage} />
        </Switch>
      </div>
    );
  }
}

export default App;
