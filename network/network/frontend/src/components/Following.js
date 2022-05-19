import React, { Component } from "react";

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
            console.log(data['Following'].length);
            if (data['Following'].length == 0)
            {
                document.querySelector('.following-div').innerHTML = "No following";
            }
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
        .catch((error) => {
            const errorDiv = document.querySelector('.following-div');
            errorDiv.id = "error-message";
            errorDiv.innerHTML = 'Error: User doesn\'t exist';
        })
    }

    render(){
        return (
            <div>
                <div id='username'>
                    <h1>{this.usernameToFind}</h1>
                </div>
                <hr />
                <h3>Following</h3>
                <div className="following-div">
                </div>
            </div>
        )
    }
}  