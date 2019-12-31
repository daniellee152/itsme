import React, { Component } from 'react';
import axios from 'axios';
import './sign-in.styles.scss';
import GoogleLogin from 'react-google-login';

import FormInput from '../form-input/form-input.component';
import CustomButton from '../custom-button/custom-button.component';

class SignIn extends Component {
  state = {
    email: '',
    password: ''
  };

  handleSubmit = event => {
    const { email, password } = this.state;
    event.preventDefault();
    try {
      axios({
        method: 'post',
        url: 'http://localhost:9000/api/v1/users/login',
        data: {
          email,
          password
        },
        validateStatus: status => {
          return true; // I'm always returning true, you may want to do it depending on the status received
        }
      })
        .catch(error => {})
        .then(res => {
          localStorage.setItem('token', res.data.token);
          this.setState({ email: '', password: '' });
          window.location = '/';
        });
    } catch (err) {
      console.log(err);
    }
  };

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  googleResponse = response => {
    axios({
      method: 'post',
      url: 'http://localhost:9000/api/v1/users/googleLogin',
      data: {
        name: response.profileObj.givenName,
        email: response.profileObj.email,
        token: response.tokenId
      },
      validateStatus: status => {
        return true; // I'm always returning true, you may want to do it depending on the status received
      }
    })
      .catch(error => {})
      .then(res => {
        console.log(res);
        localStorage.setItem('token', res.data.token);
        window.location = '/';
        this.setState({
          email: '',
          password: ''
        });
      });
  };

  render() {
    return (
      <div className="sign-in">
        <h2>I already have an account</h2>
        <span>Sign in with your email and password</span>

        <form onSubmit={this.handleSubmit}>
          <FormInput
            name="email"
            type="email"
            value={this.state.email}
            handleChange={this.handleChange}
            label="Email"
            autoComplete="on"
            required
          />
          <FormInput
            name="password"
            type="password"
            value={this.state.password}
            handleChange={this.handleChange}
            label="Password"
            autoComplete="on"
            required
          />
          <div className="buttons">
            <CustomButton type="submit" value="Submit Form">
              Sign In
            </CustomButton>
            <GoogleLogin
              className="btn btn-lg btn-block btn-primary center"
              clientId="595159769075-feo109969di1tvgkb1s9vg6rkct98hv3.apps.googleusercontent.com"
              buttonText="Sign in with Google"
              onSuccess={this.googleResponse}
              onFailure={this.onFailure}
              cookiePolicy={'single_host_origin'}
            />
          </div>
        </form>
      </div>
    );
  }
}

export default SignIn;
