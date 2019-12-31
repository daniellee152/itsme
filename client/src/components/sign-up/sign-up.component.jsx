import React, { Component } from 'react';
import './sign-up.styles.scss';
import axios from 'axios';
import GoogleLogin from 'react-google-login';

import FormInput from '../form-input/form-input.component';
import CustomButton from '../custom-button/custom-button.component';

class SignUp extends Component {
  state = {
    displayName: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = async event => {
    const { displayName, email, password, confirmPassword } = this.state;
    event.preventDefault();
    try {
      axios({
        method: 'post',
        url: 'http://localhost:9000/api/v1/users/signup',
        data: {
          name: displayName,
          email,
          password,
          confirmPassword
        },
        validateStatus: status => {
          return true; // I'm always returning true, you may want to do it depending on the status received
        }
      })
        .catch(error => {
          console.log(error);
        })
        .then(res => {
          localStorage.setItem('token', res.data.token);
          // window.location = '/';
          this.setState({
            displayName: '',
            email: '',
            password: '',
            confirmPassword: ''
          });
        });
    } catch (err) {
      console.log(err);
    }
  };

  googleResponse = response => {
    axios({
      method: 'post',
      url: 'http://localhost:9000/api/v1/users/googleSignup',
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
          displayName: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
      });
  };

  render() {
    const { displayName, email, password, confirmPassword } = this.state;
    return (
      <div className="sign-up">
        <h2 className="title">I do not have an account</h2>
        <span>Sign up with your email and password</span>
        <form className="sign-up-form" onSubmit={this.handleSubmit}>
          <FormInput
            type="text"
            name="displayName"
            value={displayName}
            label="Display Name"
            handleChange={this.handleChange}
            autoComplete="on"
            required
          />

          <FormInput
            type="email"
            name="email"
            value={email}
            label="Email"
            handleChange={this.handleChange}
            autoComplete="on"
            required
          />

          <FormInput
            type="password"
            name="password"
            value={password}
            label="Password"
            handleChange={this.handleChange}
            autoComplete="on"
            required
          />

          <FormInput
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            label="Confirm Password"
            handleChange={this.handleChange}
            autoComplete="on"
            required
          />
          <div className="buttons">
            <CustomButton type="submit">SIGN UP</CustomButton>
            <GoogleLogin
              className="btn btn-lg btn-block btn-primary center"
              clientId="595159769075-feo109969di1tvgkb1s9vg6rkct98hv3.apps.googleusercontent.com"
              buttonText="Sign up with Google"
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

export default SignUp;
