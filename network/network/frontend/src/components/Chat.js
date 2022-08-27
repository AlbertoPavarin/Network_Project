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
        }
        this.names = this.state.roomName.split('-');
        this.sendBtnPressed = this.sendBtnPressed.bind(this);
        this.messageTextChange = this.messageTextChange.bind(this);
        this.IsLoggedIn = this.IsLoggedIn.bind(this);
        this.checkUser = this.checkUser.bind(this);
        this.getMessages = this.getMessages.bind(this);
        this.renderMessages = this.renderMessages.bind(this)
        this.recipient = ''
        this.myUsername = '';
        this.messages = [];
        this.state.socket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            const messageDiv = document.createElement('div');
            if (data.sender == this.myUsername) {
              messageDiv.className = 'chat-right';
            }
            else {
              messageDiv.className = 'chat-left';
            }
            messageDiv.innerHTML = `<p>${data.message}</p>`
            document.getElementById('chat-log').appendChild(messageDiv);
            window.scrollTo(0, document.body.scrollHeight)
        }

        this.state.socket.onclose = (e) => {
            console.error('Socket closed');
        }
        this.IsLoggedIn();
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
                else{
                  this.myUsername = username
                }
            })
            this.checkUser();
            this.getMessages(this.myUsername, this.recipient);
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
        //console.log(this.names)
        if (this.state.messageText.length !== 0) {
            this.state.socket.send(JSON.stringify({
                'message': this.state.messageText,
                'sender': this.myUsername,
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
                messageText: '',
            })
            document.querySelector('#chat-input').value = '';
            window.scrollTo(0, document.body.scrollHeight)
        }
    }

    getMessages(sender, recipient){
      fetch(`/api/get-messages/${sender}/${recipient}`)
      .then((response) => response.json())
      .then((data) => {
        data['Messages'].forEach((message) => {
          //console.log(this.messages);
          this.messages.push(message)
      })
        this.renderMessages(this.messages.sort((a, b) => a.timestamp.localeCompare(b.timestamp)))
          })
    }

    renderMessages(messages){
      messages.forEach((message) => {
        //console.log(this.messages);
        const messageDiv = document.createElement('div');
        if (message['sender'] === this.myUsername) {
          messageDiv.className = 'chat-right';
        }
        else {
          messageDiv.className = 'chat-left';
        }
        messageDiv.innerHTML = `<p>${message['content']}</p>`
        document.getElementById('chat-log').appendChild(messageDiv);
        window.scrollTo(0, document.body.scrollHeight)
    })
    }

    render(){
        if (typeof this.names[1] == 'undefined' || this.names[1].length <= 0 || this.state.usersExist == false){
            return(
                <p>No chat</p>
            )
        }
        else{
            return (
                <div id="chat-wrapper mt-5">
                    <div id="chat-log">
                    </div>
                    <div id="sticky-chat">
                      <form autoComplete="off" className="form-control pb-3">
                        <div className="form-row">
                          <div className="col-10 col-md-11">
                            <input type="text" id="chat-input" className="form-control mt-2" onChange={this.messageTextChange}/>
                          </div>
                          <div className="col-2 col-md-1">
                            <input type="Submit" id="chat-input-btn" className="btn btn-primary mt-2" value="Send" onClick={this.sendBtnPressed}/>
                          </div>
                        </div>
                      </form>
                    </div>
                </div>
            )
        }
    }
}