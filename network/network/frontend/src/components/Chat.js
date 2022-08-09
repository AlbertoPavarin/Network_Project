// channels: https://channels.readthedocs.io/en/stable/tutorial/part_2.html

import React, { Component } from "react";

export default class Chat extends Component {
    constructor(props) {
      super(props);
        this.state = {
            messageText: "",
            roomName: window.location.pathname.split('Chat/')[1],
            socket: new WebSocket(`ws://${window.location.host}/ws/chat/${this.roomName}/`)
        }
        this.sendBtnPressed = this.sendBtnPressed.bind(this);
        this.messageTextChange = this.messageTextChange.bind(this);

        this.state.socket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            document.getElementById('chat-log').innerHTML += `${data.message}<br>`
        }

        this.state.socket.onclose = (e) => {
            console.error('Socket closed');
        }
    }

    messageTextChange(e) {
        this.setState({
            messageText: e.target.value,
        })
    }

    sendBtnPressed(e) {
        e.preventDefault();
        console.log(this.state.messageText)
        if (this.state.messageText.length !== 0) {
            this.state.socket.send(JSON.stringify({
                'message': this.state.messageText,
            }))
            this.setState({
                messageText: ''
            })
            document.querySelector('#chat-input').value = '';
        }
    }

    render(){
        let names = this.state.roomName.split('-');
        if (typeof names[1] == 'undefined' || names[1].length <= 0){
            return(
                <p>No chat</p>
            )
        }
        else{
            return (
                <div>
                    <input type="text" id="chat-input" className="form-control mt-4" onChange={this.messageTextChange}/>
                    <input type="button" id="chat-input-btn" className="btn btn-primary mt-3" value="Send" onClick={this.sendBtnPressed}/>
                    <div id="chat-log">
                    </div>
                </div>
            )
        }
    }
}