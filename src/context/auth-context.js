import React from "react";

export default React.createContext({
  token: null,
  userid: null,
  login: (token, userid, tokenExpiration) => {},
  logout: () => {},
});
