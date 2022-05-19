import React, { Component } from "react";

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
            if (data['Followers'].length == 0)
            {
                document.querySelector('.follower-div').innerHTML = "No Followers";
            }
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
        .catch((error) => {
            const errorDiv = document.querySelector('.follower-div');
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
                <h3>Followers</h3>
                <div className="follower-div">
                </div>
            </div>
        )
    }
}  