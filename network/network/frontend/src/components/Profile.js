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
            myUsername: "",
            profile_pic: '',
            profile_pic_change: '',
        };
        this.usernameToFind = window.location.pathname.split('User/')[1];
        this.getUserDetails();
        this.picChange = this.picChange.bind(this);
        this.followingPressed = this.followingPressed.bind(this);
        this.followerPressed = this.followerPressed.bind(this);
        this.getUserPosts();
        this.editBioPressed = this.editBioPressed.bind(this);
        this.followPressed = this.followPressed.bind(this);
        this.unfollowPressed = this.unfollowPressed.bind(this);
        this.chatPressed = this.chatPressed.bind(this);
        this.changePicPressed = this.changePicPressed.bind(this);
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
                profile_pic: data.profile_pic
            });
            this.isLoggedIn();
            this.getFollowernumber();
            this.getFollowingNumber();
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
            this.setState({
                myUsername: data['Success']
            })
            this.chatRender(data['Success']);
            if (this.state.username == data['Success'])
            {
                const btnEdit = document.createElement('button');
                btnEdit.classList = "btn btn-primary";
                btnEdit.innerHTML = "Edit Bio";
                btnEdit.onclick = this.editBioPressed; 
                document.querySelector('#edit-bio-btn').appendChild(btnEdit);
                document.querySelector('#change-prof-pic').innerHTML = `<input name="img" id="img-change-btn" type="file"/>
                                                                        <input type="submit" class='btn btn-primary' />`
                document.querySelector('#img-change-btn').addEventListener('change', (e) => this.picChange(e))
            }
            else
            {
                fetch(`/api/isFollowing/?username=${this.state.username}`)
                .then((response) => response.json())
                .then((data) => {
                    if (!data['Found'])
                    { 
                        const btnFolBtn = document.createElement('button');
                        btnFolBtn.classList = 'btn btn-primary w-25';
                        btnFolBtn.innerHTML = `Follow`;
                        btnFolBtn.onclick=this.followPressed;
                        document.querySelector('#un-follow-btn').appendChild(btnFolBtn);
                    }
                    else
                    {
                        const btnUnFolBtn = document.createElement('button');
                        btnUnFolBtn.classList = 'btn btn-primary w-25';
                        btnUnFolBtn.innerHTML = `Unfollow`;
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
        .then((data) => {
            console.log(data['detail'].length)
            if (data['detail'].length === 0)
            {
                document.querySelector('.post-container').innerHTML = "<h2>No posts</h2>";
            }
            data['detail'].forEach(post => {
            post['owner'] = this.usernameToFind;
            const d = new Date(post["timestamp"]);
            post["timestamp"] = `${d.getDate()} ${this.months[d.getMonth()]} ${d.getFullYear()}`;
            const postDiv = document.createElement('div');
            postDiv.className = 'post';
            postDiv.innerHTML = `<div class = "row p-4">
                                    <div class = "col-12 col-md-3 col-xl-3">
                                        <b class="owner text-primary"><a href="/User/${post["owner"]}">${post["owner"]}</a></b><br>
                                        <span class="timestamp text-secondary">${post["timestamp"]}</span><br>
                                    </div>
                                    <div class="col-12 col-md-6 col-xl-6 content-wrapper">
                                        <span class="postContent">${post["content"]}</span><br>
                                    </div>
                                    <div class="col-12 col-md-3 col-xl-3 comment-icon">
                                        <a href="/Comments/${post['id']}"><span class="material-icons blue-color"> comment</span></a>
                                        <a href=""><span class="material-icons">mood</span></a>
                                    </div>
                                </div`;
            document.querySelector('.post-container').appendChild(postDiv);
            postDiv.addEventListener('click', () => window.location.href = `/Post/${post['id']}`);
        })})
    }
    
    editBioPressed(e)
    {
        e.preventDefault();
        window.location.href = "/EditBio"
    }

    followPressed(e){
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
        fetch('/api/get-follower-count/' + '?username=' + this.usernameToFind)
        .then((response) => response.json())
        .then((data) => {
            this.setState({
                followerNumber: data['Count']
            })
        })
    }

    getFollowingNumber(){
        fetch(`/api/get-following-count/` + `?username=` + this.usernameToFind)
        .then((response) => response.json())
        .then((data) => {
            this.setState({
                followingNumber: data['Count']
            })
        })
    }

    followingPressed(){
        window.location.href = '/User/Following/' + this.usernameToFind;
    }

    followerPressed(){
        window.location.href = '/User/Follower/' + this.usernameToFind;
    }

    chatRender(username){
        if (username !== this.state.username){
            document.querySelector('#chat').innerHTML = 'Chat'
        }
    }

    chatPressed(){
        let names = [this.state.username, this.state.myUsername]
        names.sort()
        window.location.href = `/Chat/${names[0]}-${names[1]}`
    }

    picChange(e){
        this.setState({
            profile_pic_change: e.target.files[0],
        })
    }

    changePicPressed(e){
        e.preventDefault()
        let fileInput = new FormData();
        fileInput.append('profile_pic', this.state.profile_pic_change);
        const requestOptions = {
            method: "POST",
            headers: { 
                "X-CSRFToken": getCookie("csrftoken"),
            },
            body: fileInput
          };
        fetch('/api/change-pic', requestOptions)
        .then((response) => response.json())
        .then((data) => {
            window.location.reload();
        })
    }

    render(){
        return (
            <div id='user-container'>
                <div id='username' className='mb-4'>
                    <h1>{this.state.username}</h1>
                    <hr />
                    <img id='profile-pic' src={this.state.profile_pic} />
                    <form id='change-prof-pic' onSubmit={this.changePicPressed}>
                    </form>
                    <a id="chat" onClick={this.chatPressed}></a>
                </div>
                <div id="un-follow-btn"></div>
                <hr />
                <b onClick={this.followerPressed}>Followers: {this.state.followerNumber}</b><br />
                <b onClick={this.followingPressed}>Following: {this.state.followingNumber}</b><br /><br />
                <hr />
                <p>{this.state.first_name} {this.state.last_name}</p>
                <p>{this.state.info}</p>
                <div id="edit-bio-btn">
                </div>
                <hr />
                <p className="text-secondary">Joined: {this.state.date_joined}</p>
                <hr />
                <h1>Posts</h1>
                <div className='post-container'>    
                </div>
            </div>
        )
    }
}