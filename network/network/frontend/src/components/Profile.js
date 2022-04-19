import React, { Component } from 'react';

export default class Profile extends Component{
    constructor(props){
        super(props);
        this.state = {
            username: "",
        };
        this.usernameToFind = window.location.pathname.split('User/')[1];
        this.getUserDetails();
        this.getUserPosts();
    }

    getUserDetails(){
        fetch('/api/get-user/' + '?username=' + this.usernameToFind)
        .then((response) => {
            if (response.ok){
                return response.json();
            }
            throw new Error(response.data);
        })
        .then((data) => {
            this.setState({
                username: data.username,
            });
        })
        .catch((error) => {
            const errorDiv = document.querySelector('#user-container');
            errorDiv.id = "error-message"
            errorDiv.innerHTML = 'Error: User doesn\'t exist';
        });
    }

    getUserPosts(){
        fetch('/api/get-user-posts/' + '?username=' + this.usernameToFind)
        .then((response) => response.json())
        .then((data) => data['detail'].forEach(post => {
            post['owner'] = this.usernameToFind;
            const postDiv = document.createElement('div');
            postDiv.className = 'post';
            postDiv.innerHTML = `<b class="owner text-primary"><a href="/User/${post['owner']}">${post['owner']}</a></b><br>
                                <span class="postContent">${post['content']}</span><br>
                                <span class="timestamp text-secondary">${post['timestamp']}</span>`;
            document.querySelector('.post-container').appendChild(postDiv);
        }))
    }

    render(){
        return (
            <div id='user-container'>
                <p>Username: {this.state.username}</p>
                <div className='post-container'></div>
            </div>
        )
    }
}