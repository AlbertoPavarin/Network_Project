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
            const months = {
                0: "January",
                1: "February",
                2: "March",
                3: "April",
                4: "May",
                5: "June",
                6: "July",
                7: "August",
                8: "September",
                9: "October",
                10: "November",
                11: "December",
              };
            post['owner'] = this.usernameToFind;
            const d = new Date(post["timestamp"]);
            post["timestamp"] = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
            const postDiv = document.createElement('div');
            postDiv.className = 'post';
            postDiv.innerHTML = `<b class="owner text-primary"><a href="/User/${post['owner']}">${post['owner']}</a></b><br>
                                <span class="postContent">${post['content']}</span><br>
                                <span class="timestamp text-secondary">${post['timestamp']}</span><br>
                                <a href="/Comments/${post['id']}"><span class="comments-text text-secondary">Go to comments . . .</span></a>`;
            document.querySelector('.post-container').appendChild(postDiv);
        }))
    }

    render(){
        return (
            <div id='user-container'>
                <p>Username: {this.state.username}</p>
                <div className='post-container'>
                    <hr />
                </div>
            </div>
        )
    }
}