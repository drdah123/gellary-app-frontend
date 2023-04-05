import React from 'react';
export default React.createContext({
  token: null,
  name: null,
  userId: null,
  likes: null,
  login: () => {},
  logout: () => {},
});
