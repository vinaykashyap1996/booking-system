import React, { Component } from "react";
import "./Auth.css";
import AuthContext from "../context/auth-context";

class AuthPage extends Component {
  state = {
    isLogin: true,
  };

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
  }
  switchModeHandler = (event) => {
    event.preventDefault();
    this.setState((prevState) => {
      return { isLogin: !prevState.isLogin };
    });
  };
  submitHandler = (event) => {
    event.preventDefault();
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }
    let requestBody = {
      query: `
            query{
                login(email:"${email}",password:"${password}"){
                    userid
                    Token
                    TokenExpiration
                }
            }
        `,
    };
    if (!this.state.isLogin) {
      requestBody = {
        query: `
              mutation{
                  createUser(userInput : {email:"${email}" , password: "${password}" }) {
                      _id
                      email
                  }
              } `,
      };
    }
    fetch(process.env.REACT_APP_BASE_URL, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((resData) => {
        if (resData.data.login.Token) {
          this.context.login(
            resData.data.login.Token,
            resData.data.login.userid,
            resData.data.login.TokenExpiration
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  render() {
    return (
      <form className="auth-form" onSubmit={this.submitHandler}>
        <div className="form-control">
          <label htmlFor="email">E-mail</label>
          <input type="email" id="email" ref={this.emailEl}></input>
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" ref={this.passwordEl}></input>
        </div>
        <div className="form-actions">
          <button type="submit">Submit</button>
          <button type="button" onClick={this.switchModeHandler}>
            Switch to {this.state.isLogin ? "Signup" : "Login"}
          </button>
        </div>
      </form>
    );
  }
}

export default AuthPage;
