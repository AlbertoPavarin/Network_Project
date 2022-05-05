import React, { Component } from 'react';

export default class Bio extends Component{
    constructor(props){
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
        };
    }
}