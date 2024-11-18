import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = Cookies.get('calendar_user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [googlesync, setGoogleSync] = useState(() => {
    const storedUser = Cookies.get('google_sync');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = async (userData) => {
    try {

      setUser(userData);

      Cookies.set('calendar_user', JSON.stringify(userData), { expires: 2 / 24 });

    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  const handleGoogleSync = async(googlesync) =>{
    try {

        setGoogleSync(googlesync);
  
        Cookies.set('google_sync', JSON.stringify(googlesync), { expires: 2 / 24 });
  
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
  }

  const logout = async () => {
    if (!user) return;
    try{
      Cookies.remove('calendar_user');
      Cookies.remove('google_sync');
      setUser(null);
      setgooglesync(null);
      console.log("Logged out and cart data synced successfully.");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };


  useEffect(() => {
    const checkTokenExpiration = () => {
      if (user) {
        const decodedToken = jwtDecode(user);
        const currentTime = Date.now() / 1000; 

        if (decodedToken.exp < currentTime) {
          logout(); 
        }
      }
    };

    const intervalId = setInterval(checkTokenExpiration, 60 * 1000); 

    return () => clearInterval(intervalId);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user,googlesync, login,handleGoogleSync, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
