import React, { Component } from "react";
import { render } from "react-dom";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      logged: "",
    };
    this.IsLoggedIn();
    this.usernameChange = this.usernameChange.bind(this);
    this.passwordChange = this.passwordChange.bind(this);
    this.buttonPressed = this.buttonPressed.bind(this);
  }

  IsLoggedIn() {
    fetch("/api/isLoggedIn")
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.data);
      })
      .then((data) => {
        console.log(data);
        this.setState({
          logged: true,
        });
      })
      .catch((error) => {
        this.setState({
          logged: false,
        })
      });
  }

  usernameChange(e) {
    // Funzione per il cambio dello username, viene preso il campo dell'oggetto passato come parametro
    this.setState({
      username: e.target.value,
    });
  }

  passwordChange(e) {
    this.setState({
      password: e.target.value,
    });
  }

  buttonPressed(e) {
    e.preventDefault();
    //console.log(`${this.state.username}, ${this.state.password}`)
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      }),
    };
    fetch('/api/login', requestOptions)
    .then((response) => {
      if (response.ok){
          return response.json();
      }
      throw new Error(response.data);
  })
    .then((data) => window.location.href="/")
    .catch((error) => {
      document.getElementById('error-message').innerHTML = "Wrong Username or Password";
  });
  }

  render() {
    if (this.state.logged === true)
    {
      return (
        <div>
          <h5 id="error-message">You're already logged in</h5>
        </div>
      )
    }
    return (
      <div class="mr-4 ml-4">
        <div class="login mt-5">
          <h1>Login</h1>
          <h5 id="error-message"></h5>
          <form class="mt-4">
            <label class="mt-4" for="username">
              Username
            </label>
            <input name="username" type="text" class="form-control w-100" autoComplete="Off" onChange={this.usernameChange} placeholder="Enter your Username"/>
            <label class="mt-4" for="password">
              Password
            </label>
            <input name="password" type="password" class="form-control w-100" onChange={this.passwordChange} placeholder="Enter your Password"/>
            <input type="Submit" class="sub-btn mt-4" value="Login" onClick={this.buttonPressed} />
          </form>
        </div>
      </div>
    );
  }
}
