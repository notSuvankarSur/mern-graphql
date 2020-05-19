import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import "./App.css";
import Auth from "./components/auth";
import Events from "./components/events";
import Bookings from "./components/bookings";
import NavBar from "./components/Navigation/navBar";
import AuthContext from "./context/authContext";

class App extends React.Component {
  state = {
    token: null,
    userId: null,
  };

  login = (token, userId, tokenExpiration) => {
    this.setState({
      token,
      userId,
    });
  };

  logout = () => {
    this.setState({
      token: null,
      userId: null,
    });
  };

  render() {
    return (
      <BrowserRouter>
        <>
          <AuthContext.Provider
            value={{
              token: this.state.token,
              userId: this.state.userId,
              login: this.login,
              logout: this.logout,
            }}
          >
            <NavBar />
            <main className="main-content">
              <Switch>
                {!this.state.token && <Route path="/auth" component={Auth} />}
                <Route path="/events" component={Events} />
                {this.state.token && (
                  <Route path="/bookings" component={Bookings} />
                )}
                {!this.state.token && <Redirect from="/" to="/auth" exact />}
                {this.state.token && <Redirect from="/" to="/events" exact />}
                {this.state.token && (
                  <Redirect from="/auth" to="/events" exact />
                )}
              </Switch>
            </main>
          </AuthContext.Provider>
        </>
      </BrowserRouter>
    );
  }
}

export default App;
