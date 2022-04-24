import React, { Component } from "react";
import { render } from "react-dom";

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

export default class Comments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: "",
    };
    this.idToFind = window.location.pathname.split("Comments/")[1];
    this.getPostComments();
    this.contentChange = this.contentChange.bind(this);
    this.buttonPressed = this.buttonPressed.bind(this);
  }

  getPostComments() {
    fetch("/api/get-comments/" + "?id=" + this.idToFind)
      .then((response) => response.json())
      .then((data) => {
        data["detail"].forEach((comment) => {
          fetch("/api/get-user-id/" + "?id=" + comment["commentator"])
            .then((response) => response.json())
            .then((data) => {
              comment["commentator"] = data.username;
              const commentDiv = document.createElement("div");
              commentDiv.className = "comment";
              commentDiv.innerHTML = `<b class="owner text-primary"><a href="/User/${comment["commentator"]}">${comment["commentator"]}</a></b><br>
                                        <span class="comments-text">${comment["content"]}</span><br>`;
              document
                .querySelector("#comments-container")
                .appendChild(commentDiv);
            });
        });
      });
  }

  contentChange(e) {
    this.setState({
      content: e.target.value,
    });
  }

  buttonPressed(e) {
    e.preventDefault();
    if (this.state.content.length <= 0) {
      document.querySelector('#error-message').innerHTML = "Write Something";
    }
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: JSON.stringify({
        content: this.state.content,
        post: this.idToFind,
      }),
    };

    fetch('/api/create-comment', requestOptions)
    .then((response) => response.json())
    .then((data) => location.reload())
  }

  render() {
    return (
      <div>
        <div>
          <h1>Add Comment</h1>
          <h5 id="error-message"></h5>
          <form>
            <label htmlFor="content">Content</label>
            <textarea
              name="content"
              className="form-control"
              onChange={this.contentChange}
            />
            <input type="button" className="btn btn-primary mt-3" onClick={this.buttonPressed} value="Add" />
          </form>
        </div>
        <hr />
        <h1>Comments</h1>
        <div id="comments-container"></div>
      </div>
    );
  }
}
