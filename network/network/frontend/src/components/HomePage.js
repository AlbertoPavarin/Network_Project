import React, { Component } from "react";
import { render } from "react-dom";

export default class HomePage extends Component {
  constructor(props) {
    super(props);
    this.getPosts();
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
    this.state = {
      searchTxt: "",
    };
    this.likeClick = this.likeClick.bind(this);
    this.searchChange = this.searchChange.bind(this);
    this.searchBtnPressed = this.searchBtnPressed.bind(this);
    this.getFollowing();
  }

  // https://docs.djangoproject.com/en/1.11/ref/csrf/#ajax
  getCookie(name) {
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

  likeClick(id, state) {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": this.getCookie("csrftoken"),
      },
      body: JSON.stringify({
        liked_post: id,
      }),
    };
    fetch("api/like-post", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(state["False"]);
        console.log(data);
        fetch(`/api/check-like/?id=${id}`)
          .then((response) => response.json())
          .then((checkLike) => {
            console.log(checkLike);
            if (checkLike["False"] == undefined)
              console.log(document.getElementById(`like-${id}`).innerHTML++);
            else console.log(document.getElementById(`like-${id}`).innerHTML--);
          });
      });
  }

  getPosts() {
    fetch("/api/posts")
      .then((response) => response.json())
      .then((data) => {
        if (data["detail"].length === 0) {
          document.querySelector(".post-container").innerHTML =
            "<h2>No posts</h2>";
        }
        data["detail"].forEach((post) => {
          fetch("/api/get-user-id/" + "?id=" + post["owner"])
            .then((response) => response.json())
            .then((data) => {
              fetch(`/api/get-likes-count/?id=${post["id"]}`)
                .then((response) => response.json())
                .then((likeCount) => {
                  fetch(`/api/check-like/?id=${post["id"]}`)
                    .then((response) => response.json())
                    .then((checkLike) => {
                      console.log(checkLike);
                      const d = new Date(post["timestamp"]);
                      post["timestamp"] = `${d.getDate()} ${
                        this.months[d.getMonth()]
                      } ${d.getFullYear()}`;
                      post["owner"] = data.username;
                      const postDiv = document.createElement("div");
                      postDiv.className = "post p-4";
                      postDiv.innerHTML = `<div class = "row">
                                      <div class = "col-12 col-md-3 col-xl-3" id="header-${post["id"]}">
                                        <b class="owner text-primary"><a href="/User/${post["owner"]}">${post["owner"]}</a></b><br>
                                        <span class="timestamp text-secondary">${post["timestamp"]}</span><br>
                                      </div>
                                      <div class="col-12 col-md-6 col-xl-6 content-wrapper">
                                        <span class="postContent">${post["content"]}</span><br>
                                      </div>
                                      <div class="col-12 col-md-3 col-xl-3 comment-icon">
                                        <a href="/Comments/${post["id"]}"><span class="material-icons blue-color"> comment</span></a>
                                        <a href="" id="${post["id"]}"><span class="material-icons">mood</span></a>                                   
                                      </div>
                                      <div class="col-12 col-md-3 col-xl-3">
                                        <span>Likes:</span><span id="like-${post["id"]}">  ${likeCount["Likes count"]}</span>
                                      </div>
                                    </div>`;
                      document
                        .querySelector(".post-container")
                        .appendChild(postDiv);
                      document
                        .getElementById(`${post["id"]}`)
                        .addEventListener("click", (e) => {
                          e.preventDefault();
                          this.likeClick(post["id"], checkLike);
                        });
                      document
                        .getElementById(`header-${post["id"]}`)
                        .addEventListener(
                          "click",
                          () => (window.location.href = `Post/${post["id"]}`)
                        );
                    });
                });
            });
        });
      });
  }

  searchChange(e) {
    this.setState({
      searchTxt: e.target.value,
    });
  }

  searchBtnPressed(e) {
    e.preventDefault();
    if (this.state.searchTxt.length == 0)
    {
      return 1;
    }
    window.location.href = `/Search/${this.state.searchTxt}`;
  }

  getFollowing(){
    fetch('/api/get-random-following')
    .then((response) => response.json())
    .then((data) => {
      //console.log(data['Following']);
      data['Following'].forEach((following) => {
        fetch(`/api/get-user-id/?id=${following['following']}`)
        .then((response) => response.json())
        .then((user) => {
          //console.log(data['username'])
          const followingDiv = document.createElement('div')
          followingDiv.classList = 'text-center';
          followingDiv.innerHTML = `<p>${user['username']}</p><img src=${user['profile_pic']} id='profile-pic'><hr>` 
          document.querySelector('#following-col').appendChild(followingDiv);
        })
      })
    })
  }

  render() {
    return (
      <div>
        <form className="mt-2">
          <input
            name="searchbar"
            type="text"
            className="form-control"
            onChange={this.searchChange}
          />
          <input
            type="submit"
            className="btn btn-primary mt-2"
            value="Search"
            onClick={this.searchBtnPressed}
          />
        </form>
        <hr />
        <div className="home-wrapper">
          <div className="row">
            <div className="col-12 col-xl-2" id="following-col">
            </div>
            <div className="col-12 col-xl-8">
              <h1>Posts</h1>
              <hr />
              <div className="post-container"></div>
            </div>
            <div className="col-12 col-xl-2">
              sdrogo 2
            </div>
          </div>
        </div>
      </div>
    );
  }
}
