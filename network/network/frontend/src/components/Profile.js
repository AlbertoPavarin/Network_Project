import React, { Component } from 'react';

export default class Profile extends Component{
    constructor(props){
        super(props);
        this.state = {
            username: "",
            date_joined: "",
            last_name: "",
            first_name: "",
            info: "",
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
                first_name: data.first_name,
                last_name: data.last_name,
                info: data.info,
            });
            console.log(data.info);
            this.isLoggedIn();
        })
        .catch((error) => {
            const errorDiv = document.querySelector('#user-container');
            errorDiv.id = "error-message";
            errorDiv.innerHTML = 'Error: User doesn\'t exist';
        });
    }

    isLoggedIn(){
        fetch('/api/isLoggedIn')
        .then((response) => {
            if (response.ok){
                return response.json();
            }
            throw new Error(response.data);
        })
        .then((data) => {
            console.log(this.state.username);
            if (this.state.username == data['Success'])
            {
                const btnDiv = document.createElement('div');
                btnDiv.innerHTML = `<input type="button" class="btn btn-primary" value="Edit Bio">`;
                btnDiv.onclick=this.editBioPressed;
                document.querySelector('#edit-bio-btn').appendChild(btnDiv);
            }
            else
            {
                const btnFolBtn = document.createElement('div');
                btnFolBtn.innerHTML = `<input type="button" class="btn btn-primary" value="Follow">`;
                btnFolBtn.onclick=this.editBioPressed;
                document.querySelector('#un-follow-btn').appendChild(btnFolBtn);
            }
        })
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
            postDiv.addEventListener('click', () => window.location.href = `/Post/${post['id']}`);
        }))
    }

    editBioPressed(e)
    {
        e.preventDefault();
        window.location.href = "/EditBio"
    }

    render(){
        return (
            <div id='user-container'>
                <p>Username: {this.state.username}</p>
                <div id="un-follow-btn"></div>
                <hr />
                <h5>Bio:</h5>
                <p>{this.state.first_name} {this.state.last_name}</p>
                <p>{this.state.info}</p>
                <div id="edit-bio-btn">
                </div>
                <hr />
                <p className="text-secondary">Joined: {this.state.date_joined}</p>
                <div className='post-container'>
                    <hr />
                </div>
            </div>
        )
    }
}