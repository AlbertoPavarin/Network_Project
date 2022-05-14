import React, { Component } from "react";
//Aggiungere gestione errori
export default class Following extends Component {
    constructor(props) {
      super(props);
      this.getFollowingUsers = this.getFollowingUsers.bind(this);
      this.usernameToFind = window.location.pathname.split('/Following/')[1];
      this.getFollowingUsers(); 
    }

    getFollowingUsers(){
        fetch('/api/get-following-users/' + '?username=' + this.usernameToFind)
        .then((response) => response.json())
        .then((data) => {
            data['Following'].forEach(following => {
                fetch('/api/get-user-id/' + '?id=' + following['following'])
                .then((response) => response.json())
                .then((data) => {
                    const a = document.createElement('a');
                    a.href = '/User/' + data['username'];
                    a.innerHTML = data['username'] + '<br>';
                    document.querySelector('.following-div').appendChild(a);
                })
            });
        })
    }

    render(){
        return (
            <div>
                <div className="following-div">
                </div>
            </div>
        )
    }
}  