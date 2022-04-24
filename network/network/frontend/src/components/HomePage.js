import React, { Component } from "react";
import { render } from "react-dom";

export default class HomePage extends Component {
  constructor(props) {
    super(props);
    this.getPosts();
  }

  getPosts() {
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
    fetch("/api/posts")
      .then((response) => response.json())
      .then((data) => {
        data["detail"].forEach((post) => {
          fetch("/api/get-user-id/" + "?id=" + post["owner"])
            .then((response) => response.json())
            .then((data) => {
              const d = new Date(post["timestamp"]);
              post["timestamp"] = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
              post["owner"] = data.username;
              const postDiv = document.createElement("div");
              postDiv.className = "post";
              postDiv.innerHTML = `<b class="owner text-primary"><a href="/User/${post["owner"]}">${post["owner"]}</a></b><br>
                                   <span class="postContent">${post["content"]}</span><br>
                                   <span class="timestamp text-secondary">${post["timestamp"]}</span><br>
                                   <a href="/Comments/${post['id']}"><span class="comments-text text-secondary">Go to comments . . .</span></a>`;
              document.querySelector(".post-container").appendChild(postDiv);
            });
        });
      });
  }

  render() {
    return (
      <div>
        <h1>Posts</h1>
        <div className="post-container">
          <hr />
        </div>
      </div>
    );
  }
}
