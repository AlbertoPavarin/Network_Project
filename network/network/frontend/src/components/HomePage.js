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
  }

  getPosts() {
    fetch("/api/posts")
      .then((response) => response.json())
      .then((data) => {
        data["detail"].forEach((post) => {
          fetch("/api/get-user-id/" + "?id=" + post["owner"])
            .then((response) => response.json())
            .then((data) => {
              const d = new Date(post["timestamp"]);
              post["timestamp"] = `${d.getDate()} ${this.months[d.getMonth()]} ${d.getFullYear()}`;
              post["owner"] = data.username;
              const postDiv = document.createElement("div");
              postDiv.className = "post p-4";
              postDiv.innerHTML =`  <div class = "row">
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
                                    </div>`;
              document.querySelector(".post-container").appendChild(postDiv);
              postDiv.addEventListener('click', () => window.location.href = `Post/${post['id']}`);
            });
        });
      });
  }

  render() {
    return (
      <div>
        <h1>Posts</h1>
        <hr/>
        <div className="post-container">
        </div>
      </div>
    );
  }
}
