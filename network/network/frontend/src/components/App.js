import React, { Component } from "react";
import { createRoot } from "react-dom/client";
import Home from "./Home";


export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
        <Home></Home>
    );
  }
}

const div = createRoot(document.getElementById("app"));
div.render(<App />);
