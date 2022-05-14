import React, { Component } from "react";
//Aggiungere gestione errori
export default class Follower extends Component {
    constructor(props) {
      super(props);
      this.getFollowerUsers = this.getFollowerUsers.bind(this);
      this.usernameToFind = window.location.pathname.split('/Follower/')[1];
      this.getFollowerUsers(); 
    }

    getFollowerUsers(){
        fetch('/api/get-follower-users/' + '?username=' + this.usernameToFind)
        .then((response) => response.json())
        .then((data) => {
            data['Followers'].forEach(follower => {
                fetch('/api/get-user-id/' + '?id=' + follower['follower'])
                .then((response) => response.json())
                .then((data) => {
                    const a = document.createElement('a');
                    a.href = '/User/' + data['username'];
                    a.innerHTML = data['username'] + '<br>';
                    document.querySelector('.follower-div').appendChild(a);
                })
            });
        })
    }

    render(){
        return (
            <div>
                <div className="follower-div">
                </div>
            </div>
        )
    }
}  