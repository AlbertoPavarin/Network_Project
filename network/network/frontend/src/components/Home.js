import React, { Component } from "react";
import { render } from "react-dom";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Redirect,
} from "react-router-dom";
import Login from "./Login";
import HomePage from './HomePage';

export default class Home extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />}>
          </Route>
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    );
  }
}
