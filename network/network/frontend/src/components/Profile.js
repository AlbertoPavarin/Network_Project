import React, { Component } from 'react';

export default class Profile extends Component{
    constructor(props){
        super(props);
        this.state = {
            username: "",
        };
        this.usernameToFind = window.location.pathname.split('User/')[1];
        this.getUserDetails()
    }

    getUserDetails(){
        fetch('/api/get-user/' + '?username=' + this.usernameToFind)
        .then((response) => response.json())
        .then((data) => {
            this.setState({
                username: data.username,
            });
        });
    }

    render(){
        return (
            <div>Username: {this.state.username}</div>
        )
    }
}