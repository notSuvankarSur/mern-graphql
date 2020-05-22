import React, { Component } from "react";
import AuthContext from "../context/authContext";
import "./auth.css";

class Auth extends Component {
  state = {
    isLogin: false,
  };

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.emailRef = React.createRef();
    this.passRef = React.createRef();
    this.nameRef = React.createRef();
  }

  toggleLogin = () => {
    this.setState((prevState) => {
      return { isLogin: !prevState.isLogin };
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    let name = null;
    if (!this.state.isLogin) {
      name = this.nameRef.current.value;
    }
    const email = this.emailRef.current.value;
    const password = this.passRef.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) return;

    const requestBody = !this.state.isLogin
      ? {
          query: `
        mutation CreateUser($name: String!, $email: String!, $password: String!){
            createUser(userInput: {
              name: $name,
              email: $email,
              password: $password
            }){
              _id
              email
            }
          }
        `,
          variables: {
            name: name,
            email: email,
            password: password,
          },
        }
      : {
          query: `
          query LoginUser($email: String!, $password: String!){
            loginUser(email: $email, password: $password){
              userId
              token
              tokenExpiration
            }
          }
        `,
          variables: {
            email: email,
            password: password,
          },
        };

    try {
      const res = await fetch("http://localhost:8000/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.status !== 200 && res.status !== 201) {
        throw new Error("Failed");
      }

      if (this.state.isLogin) {
        const {
          data: {
            loginUser: { token, userId, tokenExpiration },
          },
        } = await res.json();
        //   console.log(token);
        if (token) {
          this.context.login(token, userId, tokenExpiration);
        }
      }
    } catch (error) {
      throw error;
    }
  };

  render() {
    const { isLogin } = this.state;
    return (
      <form action="" className="auth-form" onSubmit={this.handleSubmit}>
        {!isLogin && (
          <div className="form-control">
            <label htmlFor="name">Name</label>
            <input type="name" id="name" ref={this.nameRef} />
          </div>
        )}
        <div className="form-control">
          <label htmlFor="email">E-mail</label>
          <input type="email" id="email" ref={this.emailRef} />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" ref={this.passRef} />
        </div>
        <div className="form-actions">
          <button type="submit">{isLogin ? "Login" : "Register"}</button>
          <button type="button" onClick={this.toggleLogin}>
            {isLogin ? "Switch to Register" : "Switch to Login"}
          </button>
        </div>
      </form>
    );
  }
}

export default Auth;
