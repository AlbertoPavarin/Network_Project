import React, { Component } from "react";
import { render } from "react-dom";

export default class Comments extends Component {
  constructor(props) {
    super(props);

    this.idToFind = window.location.pathname.split('Comments/')[1];
    this.getPostComments();
  }

  getPostComments(){
      fetch('/api/get-comments/' + '?id=' + this.idToFind)
      .then((response) => response.json())
      .then((data) => {data['detail'].forEach(comment => {
        fetch("/api/get-user-id/" + "?id=" + comment["commentator"])
            .then((response) => response.json())
            .then((data) => {
                comment["commentator"] = data.username;
                const commentDiv = document.createElement('div');
                commentDiv.className = 'comment';
                commentDiv.innerHTML = `<b class="owner text-primary"><a href="/User/${comment["commentator"]}">${comment["commentator"]}</a></b><br>
                                        <span class="comments-text">${comment['content']}</span><br>`;
                document.querySelector('#comments-container').appendChild(commentDiv);
            })
      })
    })
  }

  render(){
      return (
      <div>
        <h1>Comments</h1>
        <hr/>
        <div id="comments-container">

        </div>
      </div>
      )
  }
}