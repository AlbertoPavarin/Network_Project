// channels: https://channels.readthedocs.io/en/stable/tutorial/part_2.html

import React, { Component } from "react";

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

export default class Chat extends Component {
    constructor(props) {
      super(props);
        this.state = {
            messageText: "",
            roomName: window.location.pathname.split('Chat/')[1],
            socket: new WebSocket(`ws://${window.location.host}/ws/chat/${this.roomName}/`),
            usersExist: true,
            logged: '',
            recipient: '',
        }
        this.names = this.state.roomName.split('-');
        this.sendBtnPressed = this.sendBtnPressed.bind(this);
        this.messageTextChange = this.messageTextChange.bind(this);
        this.checkUser = this.checkUser.bind(this)
        this.recipient = ''
        this.state.socket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            document.getElementById('chat-log').innerHTML += `${data.message}<br>`
        }

        this.state.socket.onclose = (e) => {
            console.error('Socket closed');
        }
        this.IsLoggedIn();
        this.checkUser();
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
            this.setState({
              logged: true,
            });
            this.names.forEach(username => {
                if (data['Success'] !== username){
                    this.recipient = username
                }
            })
            fetch(`/api/get-user/?username=${this.recipient}`)
            .then((response) => response.json())
            .then((data) => this.recipient = data['id'])
          })
          .catch((error) => {
            this.setState({
              logged: false,
            })
          });
      }

    checkUser(){
        this.names.forEach((username) => {
            fetch(`/api/user-exist/?username=${username}`)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error(response.data);
                })
            .catch(error => {
                this.setState({
                    usersExist: false
                })
                return -1;
            })
        })
    }

    messageTextChange(e) {
        this.setState({
            messageText: e.target.value,
        })
    }

    sendBtnPressed(e) {
        e.preventDefault();
        console.log(this.names)
        if (this.state.messageText.length !== 0) {
            this.state.socket.send(JSON.stringify({
                'message': this.state.messageText,
            }))
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCookie("csrftoken"),
                  },
                body: JSON.stringify({
                  recipient: this.recipient,
                  content: this.state.messageText,
                }),
              };
            fetch(`/api/send-message`, requestOptions)
            .then((response) => response.json())
            .then((data) => console.log(data))
            this.setState({
                messageText: ''
            })
            document.querySelector('#chat-input').value = '';
        }
    }

    render(){
        if (typeof this.names[1] == 'undefined' || this.names[1].length <= 0 || this.state.usersExist == false){
            return(
                <p>No chat</p>
            )
        }
        else{
            return (
                <div>
                    <form autoComplete="off">
                        <input type="text" id="chat-input" className="form-control mt-4" onChange={this.messageTextChange}/>
                        <input type="Submit" id="chat-input-btn" className="btn btn-primary mt-3" value="Send" onClick={this.sendBtnPressed}/>
                    </form>
                    <div id="chat-log">
                    </div>
                </div>
            )
        }
    }
}