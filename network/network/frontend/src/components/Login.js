import React, { Component } from "react";
import { render } from "react-dom";

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
        };
        this.emailChange = this.emailChange.bind(this);
        this.passwordChange = this.passwordChange.bind(this);
        this.buttonPressed = this.buttonPressed.bind(this);
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
        console.log(`Email: ${this.state.email}, Password: ${this.state.password}`);
    }

    render() {
        return (
            <div className="login mt-5">
                <h1>Login</h1>
                <h5 id="error-message"></h5>
                <form className="mt-4">
                    <label className="mt-4" for="email">Email</label>
                    <input name="email" type="email" className="form-control w-100" onChange={this.emailChange}/>
                    <label className="mt-4" for="password">Password</label>
                    <input name="password" type="password" className="form-control w-100" onChange={this.passwordChange}/>
                    <input type="Submit" className="btn btn-primary mt-4" value="Login" onClick={this.buttonPressed}/>
                </form>       
            </div>  
        );
    }
}