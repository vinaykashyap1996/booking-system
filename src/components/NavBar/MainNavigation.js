import React from "react";
import "./MainNavigation.css";
import { NavLink } from "react-router-dom";

const mainNavigation = props => (
    <header className="main-navigation">
        <div className="main-navigation-logo">
            <h1>EasyBooking</h1>
        </div>
        <nav className="main-navigation-items">
           <ul>
            <li><NavLink to="/auth">Authentication</NavLink></li>
            <li><NavLink to="/booking">Bookings</NavLink></li>
            <li><NavLink to="/events">Events</NavLink></li>
           </ul>
        </nav>
    </header>
)

export default mainNavigation;