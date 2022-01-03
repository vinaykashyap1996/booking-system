import React from "react";
import "./MainNavigation.css";
import authContext from "../../context/auth-context";
import { NavLink } from "react-router-dom";

const mainNavigation = (props) => (
  <authContext.Consumer>
    {(context) => {
      return (
        <header className="main-navigation">
          <div className="main-navigation-logo">
            <h1>EasyBooking</h1>
          </div>
          <nav className="main-navigation-items">
            <ul>
              {!context.token && (
                <li>
                  <NavLink to="/auth">Authentication</NavLink>
                </li>
              )}
              <li>
                <NavLink to="/events">Events</NavLink>
              </li>
              {context.token && (
                <React.Fragment>
                  <li>
                    <NavLink to="/booking">Bookings</NavLink>
                  </li>
                  <button onClick={context.logout}>Logout</button>
                </React.Fragment>
              )}
            </ul>
          </nav>
        </header>
      );
    }}
  </authContext.Consumer>
);

export default mainNavigation;
