import React, { Component } from "react";
import { createRoot } from "react-dom/client";


export default class FollowingPosts extends Component {
  constructor(props) {
    super(props);
    this.state = {
        logged: "",
    };

    this.username = ""
    this.IsLoggedIn();
    this.getFollowingUsers = this.getFollowingUsers.bind(this);
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

  IsLoggedIn() {
    fetch("/api/isLoggedIn")
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.data);
      })
      .then((data) => {
        console.log(data);
        this.setState({
          logged: true,
        });
        this.username = data['Success']
        this.getFollowingUsers();
      })
      .catch((error) => {
        this.setState({
          logged: false,
        })
      });
  }

  getFollowingUsers(){
    fetch('/api/get-following-users/' + '?username=' + this.username)
    .then((response) => response.json())
    .then((data) => {
        if (data['Following'].length == 0)
        {
            document.querySelector('.post-container').innerHTML = "No following";
        }
        data['Following'].forEach(following => {
            fetch('/api/get-user-id/' + '?id=' + following['following'])
            .then((response) => response.json())
            .then((user) => {
                fetch('/api/get-user-posts/' + '?username=' + user['username'])
                .then((response) => response.json())
                .then((data) => data['detail'].forEach(post => {
                    console.log(post);
                    console.log("sss")
                    post['owner'] = user["username"];
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
        }))
            })
        });
    })
    .catch((error) => {
        const errorDiv = document.querySelector('.following-posts-div');
        errorDiv.id = "error-message";
        errorDiv.innerHTML = 'Error: User doesn\'t exist';
    })
}

  render() {
    if (this.state.logged === false) {
        return <h5 id="error-message">You're not logged in</h5>;
      }
    return(
        <div>
            <div id='username' className='mb-4'>
                <h1>{this.username}</h1>
            </div>
            <hr />
            <h3>Following Posts</h3>
            <div className="post-container mt-5"></div>
        </div>
    );
  }
}