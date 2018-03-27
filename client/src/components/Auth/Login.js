import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  changeUserInfoId,
  changeUserInfoUsername,
  changeUserInfoEmail,
  playAuthFailedAnimation,
  fetchFavDataFromDatabase,
  transferDataFromLocalStorageToDB
} from "../../actions/eventsAppActions";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authFailed: false,
    };
  }

  shouldComponentUpdate(newProps, newState) {
    if (this.state.authFailed !== newState.authFailed) {
      return true;
    } else {
      return false;
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.eventsAppStore.userInfo.email !== null && newProps.eventsAppStore.userInfo.id !== null && newProps.eventsAppStore.userInfo.username !== null) {
      this.props.history.push(`/profile`);
    }
  }

  handleLoginForm = (e) => {
    e.preventDefault();
    fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({
        username: e.target.username.value,
        password: e.target.password.value,
      }),
    })
      .then((response) => {
        return response.json()
      })
      .then((responseJson) => {
        if (responseJson.message && responseJson.message === "login failed") {
          this.setState({ authFailed: true });
          this.props.dispatch(playAuthFailedAnimation(this.refs.authFailed, "shake"));
        } else {
          this.props.dispatch(changeUserInfoId(responseJson.userInfo.id));
          this.props.dispatch(changeUserInfoUsername(responseJson.userInfo.username));
          this.props.dispatch(changeUserInfoEmail(responseJson.userInfo.email));
          (JSON.parse(localStorage.getItem("savedItemsObj")) !== undefined) && (this.props.dispatch(transferDataFromLocalStorageToDB(responseJson.userInfo.id)));
          this.props.dispatch(fetchFavDataFromDatabase(responseJson.userInfo.id));
          this.props.history.push(`/profile`);
        }
      })
  }

  render() {
    return (
      <div className="user-form-container">
        <h3 ref="authFailed" className={"auth-failed " + (this.state.authFailed ? "show" : "")}>Wrong Username or Password</h3>
        <div className="user-form">
          <h3>Login Your Account</h3>
          <form className="form" onSubmit={this.handleLoginForm}>
            <label htmlFor="username">User Name</label>
            <input
              type="text"
              name="username"
              required
              placeholder="User Name"
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              required
              placeholder="Your Password"
            />
            <button>Login</button>
          </form>

        </div>
      </div>
    );
  }
}

function mapStateToProps({ eventsAppStore }) {
  return { eventsAppStore };
}

export default withRouter(connect(mapStateToProps)(Register));
