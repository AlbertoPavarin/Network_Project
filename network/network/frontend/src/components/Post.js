import React, { Component } from "react";
import { render } from "react-dom";

export default class Post extends Component {
    constructor(props) {
      super(props);

      this.idToFind = window.location.pathname.split('Post/')[1];
      this.getPost();
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
    };

    getPost(){
        fetch("/api/get-post/?id=" + this.idToFind)
        .then((response) => {
            if (response.ok){
                return response.json();
            }
            throw new Error(response.data);
        })
        .then((post) => {
            fetch("/api/get-user-id/" + "?id=" + post["owner"])
            .then((response) => response.json())
            .then((owner) => {
                const d = new Date(post["timestamp"]);
                post["timestamp"] = `${d.getDate()} ${this.months[d.getMonth()]} ${d.getFullYear()}`;
                post['owner'] = owner.username;
                const postDiv = document.createElement("div");
                postDiv.classList = "post-view mt-5 pb-3";
                postDiv.innerHTML =     `<div class="row p-4">
                                            <div class = "col-12 col-md-3 col-xl-3">
                                                <b class="owner-post-view text-primary"><a href="/User/${post["owner"]}">${post["owner"]}</a></b><br>
                                                <span class="timestamp-post-view text-secondary">${post["timestamp"]}</span><br>
                                            </div>
                                            <div class="col-12 col-md-6 col-xl-6 content-wrapper">
                                                <span class="postContent-post-view">${post["content"]}</span><br>
                                            </div>
                                            <div class="col-12 col-md-3 col-xl-3 comment-icon">
                                                <a href="/Comments/${post['id']}"><span class="material-icons blue-color mt-3">comment</span></a>
                                                <a href=""><span class="material-icons">mood</span></a>
                                            </div>
                                        </div>`;
                document.querySelector("#post-container").appendChild(postDiv);
            })
        })
        .catch((error) => {
            console.log(error);
            document.getElementById('error-message').innerHTML = "No Post";
        });
    }

    render(){
        return (
            <div>
                <h5 id="error-message"></h5>
                <div id="post-container"></div>
            </div>
        )
    }
}