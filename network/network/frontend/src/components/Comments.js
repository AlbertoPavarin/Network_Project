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
      logged: "",
    };
    this.idToFind = window.location.pathname.split("Comments/")[1];
    this.getPostComments();
    this.IsLoggedIn();
    this.contentChange = this.contentChange.bind(this);
    this.buttonPressed = this.buttonPressed.bind(this);
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
        this.getFollowingUsers();
      })
      .catch((error) => {
        this.setState({
          logged: false,
        })
      });
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
              commentDiv.classList = "comment p-4";
              commentDiv.innerHTML = `<b class="owner text-primary"><a href="/User/${comment["commentator"]}">${comment["commentator"]}</a></b><br>
                                        <span class="comments-text">${comment["content"]}</span><br>`;
              document.querySelector("#comments-container").appendChild(commentDiv);
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
      document.querySelector("#error-message").innerHTML = "Write Something";
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

    fetch("/api/create-comment", requestOptions)
      .then((response) => response.json())
      .then((data) => location.reload());
  }

  render() {
    if (this.state.logged === false) {
      return <h5 id="error-message">You're not logged in</h5>;
    }
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
            <input
              type="button"
              className="btn btn-primary mt-3"
              onClick={this.buttonPressed}
              value="Comment"
            />
          </form>
        </div>
        <hr />
        <h1>Comments</h1>
        <div id="comments-container"></div>
      </div>
    );
  }
}
