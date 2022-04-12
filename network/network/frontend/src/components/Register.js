import React, { Component } from "react";
import { render } from "react-dom";
import { Link } from "react-router-dom"

export default class Home extends Component {
    constructor(props) {
      super(props);
      this.state = {
            username: "",
            email: "",
            password: "",
      };
      this.usernameChange = this.usernameChange.bind(this)
      this.emailChange = this.emailChange.bind(this)
      this.passwordChange = this.passwordChange.bind(this)
      this.buttonPressed = this.buttonPressed.bind(this)
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

    buttonPressed(e){
        e.preventDefault();
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: this.state.username,
              email: this.state.email,
              password: this.state.password,
            }),
          };
          fetch("/api/create-user", requestOptions)
            .then((response) => response.json())
            .then((data) => window.location.href = `/login`);
        }
        
    render(){
        return (    
            <div className="register mt-5">
                <h1>Register</h1>
                <form className="mt-4">   
                    <label for="username">Username</label>
                    <input name="username" type="text" onChange={this.usernameChange} class="form-control w-100" />
                    <label className="mt-4" for="email">Email</label>
                    <input name="email" type="email" className="form-control w-100" onChange={this.emailChange}/>
                    <label className="mt-4" for="password">Password</label>
                    <input name="password" type="password" className="form-control w-100" onChange={this.passwordChange}/>
                    <input type="Submit" className="btn btn-primary mt-4" value="Register" onClick={this.buttonPressed}/>
                </form>       
            </div>          
        );
    }
}