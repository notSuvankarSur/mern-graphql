import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import "./App.css";
import Auth from "./components/auth";
import Events from "./components/events";
import Bookings from "./components/bookings";
import NavBar from "./components/Navigation/navBar";

function App() {
  return (
    <BrowserRouter>
      <>
        <NavBar />
        <main className="main-content">
          <Switch>
            <Route path="/auth" component={Auth} />
            <Route path="/events" component={Events} />
            <Route path="/bookings" component={Bookings} />
            <Redirect from="/" to="/auth" />
          </Switch>
        </main>
      </>
    </BrowserRouter>
  );
}

export default App;
