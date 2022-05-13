import React, { Component } from 'react';

// https://docs.djangoproject.com/en/1.11/ref/csrf/#ajax
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      var cookies = document.cookie.split(";");
      for (var i = 0; i < cookies.length; i++) {
        var cookie = jQuery.trim(cookies[i]);
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

export default class Profile extends Component{
    constructor(props){
        super(props);
        this.state = {
            user_id: 0,
            username: "",
            date_joined: "",
            last_name: "",
            first_name: "",
            info: "",
            followerNumber: 0,
            followingNumber: 0,
        };
        this.usernameToFind = window.location.pathname.split('User/')[1];
        this.getUserDetails();
        this.getFollowingNumber();
        this.getUserPosts();
        this.editBioPressed = this.editBioPressed.bind(this);
        this.followPressed = this.followPressed.bind(this);
        this.unfollowPressed = this.unfollowPressed.bind(this);
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
                user_id: data.id,
                username: data.username,
                date_joined: `${d.getDate()} ${this.months[d.getMonth()]} ${d.getFullYear()}`,
                first_name: data.first_name,
                last_name: data.last_name,
                info: data.info,
            });
            this.isLoggedIn();
            this.getFollowernumber();
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
            if (this.state.username == data['Success'])
            {
                const btnDiv = document.createElement('div');
                btnDiv.innerHTML = `<input type="button" class="btn btn-primary" value="Edit Bio">`;
                btnDiv.onclick=this.editBioPressed;
                document.querySelector('#edit-bio-btn').appendChild(btnDiv);
            }
            else
            {
                fetch(`/api/isFollowing/?username=${this.state.username}`)
                .then((response) => response.json())
                .then((data) => {
                    if (!data['Found'])
                    { 
                        const btnFolBtn = document.createElement('div');
                        btnFolBtn.innerHTML = `<input type="button" class="btn btn-primary" value="Follow">`;
                        btnFolBtn.onclick=this.followPressed;
                        document.querySelector('#un-follow-btn').appendChild(btnFolBtn);
                    }
                    else
                    {
                        const btnUnFolBtn = document.createElement('div');
                        btnUnFolBtn.innerHTML = `<input type="button" class="btn btn-primary" value="Unfollow">`;
                        btnUnFolBtn.onclick=this.unfollowPressed;
                        document.querySelector('#un-follow-btn').appendChild(btnUnFolBtn);
                    }
                })
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

    followPressed(e){
        e.preventDefault();
        console.log(this.state.user_id);
        const requestOptions = {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "X-CSRFToken": getCookie("csrftoken"),
            },
            body: JSON.stringify({
              following: this.state.user_id,
            }),
          };
        fetch('/api/create-follower', requestOptions)
        .then((response) => {
            if (response.ok) {
              return response.json();
            }
            throw new Error(response.data);
          })
        .then((data) => {
            console.log(data);
            window.location.reload();
        })
        .catch((error) => {
            document.querySelector('#user-container').innerHTML = "Error";
        })
    }

    unfollowPressed(e){
        e.preventDefault();
        const requestOptions = {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "X-CSRFToken": getCookie("csrftoken"),
            },
            body: JSON.stringify({
              following: this.state.user_id,
            }),
          };
        fetch('/api/unfollow', requestOptions)
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.data);
            })
        .then((data) => window.location.reload())
        .catch((error) => console.log(error))
    }

    getFollowernumber(){
        fetch('/api/get-follower-count')
        .then((response) => response.json())
        .then((data) => {
            this.setState({
                followerNumber: data['Count']
            })
        })
    }

    getFollowingNumber(){
        console.log(this.state.username);
        fetch(`/api/get-following-count/?username=${this.state.username}`)
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            this.setState({
                followingNumber: data['Count']
            })
        })
    }

    render(){
        return (
            <div id='user-container'>
                <p>Username: {this.state.username}</p>
                <div id="un-follow-btn"></div>
                <hr />
                <b>Followers: {this.state.followerNumber}</b><br />
                <b>Following: {this.state.followingNumber}</b><br /><br />
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