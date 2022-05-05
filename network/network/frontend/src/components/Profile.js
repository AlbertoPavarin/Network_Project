import React, { Component } from 'react';

export default class Profile extends Component{
    constructor(props){
        super(props);
        this.state = {
            username: "",
            date_joined: "",
        };
        this.usernameToFind = window.location.pathname.split('User/')[1];
        this.getUserDetails();
        this.getUserPosts();
        this.months = {
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
        this.editBioPressed = this.editBioPressed.bind(this);
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
            const d = new Date(data.date_joined)
            this.setState({
                username: data.username,
                date_joined: `${d.getDate()} ${this.months[d.getMonth()]} ${d.getFullYear()}`,
            });
        })
        .catch((error) => {
            const errorDiv = document.querySelector('#user-container');
            errorDiv.id = "error-message";
            errorDiv.innerHTML = 'Error: User doesn\'t exist';
        });
    }

    getUserPosts(){
        fetch('/api/get-user-posts/' + '?username=' + this.usernameToFind)
        .then((response) => response.json())
        .then((data) => data['detail'].forEach(post => {
            post['owner'] = this.usernameToFind;
            const d = new Date(post["timestamp"]);
            post["timestamp"] = `${d.getDate()} ${this.months[d.getMonth()]} ${d.getFullYear()}`;
            const postDiv = document.createElement('div');
            postDiv.className = 'post';
            postDiv.innerHTML = `<b class="owner text-primary"><a href="/User/${post['owner']}">${post['owner']}</a></b><br>
                                <span class="postContent">${post['content']}</span><br>
                                <span class="timestamp text-secondary">${post['timestamp']}</span><br>
                                <a href="/Comments/${post['id']}"><span class="comments-text text-secondary">Go to comments . . .</span></a>`;
            document.querySelector('.post-container').appendChild(postDiv);
        }))
    }

    editBioPressed(e)
    {
        e.preventDefault();
        console.log("Tullio dioo");
    }

    render(){
        return (
            <div id='user-container'>
                <p>Username: {this.state.username}</p>
                <p className="text-secondary">Joined: {this.state.date_joined}</p>
                <input type="button" className='btn btn-primary' value="Edit Bio" onClick={this.editBioPressed}/>
                <div className='post-container'>
                    <hr />
                </div>
            </div>
        )
    }
}