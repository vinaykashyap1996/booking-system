import React, { useState } from "react";

import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import AuthPage from "./pages/Auth";
import BookingsPage from "./pages/Bookings";
import EventsPage from "./pages/Events";
import MainNavigation from "./components/NavBar/MainNavigation";
import AuthContext from "./context/auth-context";

function App() {
  const [token, setToken] = useState(null);
  const [userid, setUserId] = useState(null);

  const login = (token, tokenExpiration, userid) => {
    setToken(token);
    setUserId(userid);
  };
  const logout = () => {
    setToken(null);
    setUserId(null);
  };

  return (
    <BrowserRouter>
      <AuthContext.Provider
        value={{ token: token, userid: userid, login: login, logout: logout }}
      >
        <MainNavigation />
        <main className="main-content">
          <Routes>
            {!token && <Route path="/" element={<Navigate to="/auth" />} />}
            {token && <Route path="/" element={<Navigate to="/events" />} />}
            {token && (
              <Route path="/auth" element={<Navigate to="/events" />} />
            )}

            {!token && <Route path="/auth" element={<AuthPage />} />}
            <Route path="/events" element={<EventsPage />} />
            {token && <Route path="/booking" element={<BookingsPage />} />}
          </Routes>
        </main>
      </AuthContext.Provider>
    </BrowserRouter>
  );
}

export default App;
