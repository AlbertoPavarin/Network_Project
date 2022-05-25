import React, { Component } from "react";
import { render } from "react-dom";
import { Link } from "react-router-dom"

export default class Register extends Component {
    constructor(props) {
      super(props);
      this.state = {
            username: "",
            email: "",
            password: "",
            passwordConf: "",
            is_active: true,
            logged: "",
      };
      this.IsLoggedIn();
      this.usernameChange = this.usernameChange.bind(this);
      this.emailChange = this.emailChange.bind(this);
      this.passwordChange = this.passwordChange.bind(this);
      this.passwordConfermationChange = this.passwordConfermationChange.bind(this)
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

    usernameChange(e) {  // Funzione per il cambio dello username, viene preso il campo dell'oggetto passato come parametRO
        this.setState({
            username: e.target.value,
        });
    }

    emailChange(e){
        this.setState({
            email: e.target.value,
        });
    }

    passwordChange(e){
        this.setState({
            password: e.target.value,
        });
    }

    passwordConfermationChange(e){
        this.setState({
            passwordConf: e.target.value,
        });
    }

    buttonPressed(e){
        e.preventDefault();
        if (this.state.password.toString() != this.state.passwordConf.toString()){
            document.getElementById('error-message').innerHTML = "Passwords must match";
            return -1;
        }
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: this.state.username,
              email: this.state.email,
              password: this.state.password,
              is_active: this.state.is_active
            }),
          };
          fetch("/api/create-user", requestOptions)
            .then((response) => {
                if (response.ok){
                    return response.json();
                }
                throw new Error(response.data);
            })
            .then((data) => window.location.href = '/login')
            .catch((error) => {
                document.getElementById('error-message').innerHTML = "User already exist";
            });
        }
        
    render(){
        if (this.state.logged === true)
        {
        return (
            <div>
                <h5 id="error-message">You're already logged in</h5>
            </div>
            )
        }
        return (    
            <div className="register mt-5">
                <h1>Register</h1>
                <h5 id="error-message"></h5>
                <form className="mt-4">   
                    <label for="username">Username</label>
                    <input name="username" type="text" onChange={this.usernameChange} placeholder="Enter your Username" class="form-control w-100" />
                    <label className="mt-4" for="email">Email</label>
                    <input name="email" type="email" className="form-control w-100" onChange={this.emailChange} placeholder="Enter your Email"/>
                    <label className="mt-4" for="password">Password</label>
                    <input name="password" type="password" className="form-control w-100" onChange={this.passwordChange} placeholder="Enter your Password" />
                    <label className="mt-4" for="passwordConf">Password Confermation</label>
                    <input name="passwordConf" type="password" className="form-control w-100" onChange={this.passwordConfermationChange} placeholder="Enter your Password again" />
                    <input type="Submit" className="sub-btn mt-4" value="Register" onClick={this.buttonPressed}/>
                </form>       
            </div>          
        );
    }
}