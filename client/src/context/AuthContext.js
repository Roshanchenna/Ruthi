import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_URL = BACKEND_URL + "/api/auth";
// const API_URL = 'https://jobx-32a058281844.herokuapp.com/api/auth';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const setToken = useCallback((token) => {
    setAuthToken(token);
    if (token) {
      localStorage.setItem("authToken", token);
    } else {
      localStorage.removeItem("authToken");
    }
  }, []);

  const fetchUserInfo = useCallback(async () => {
    if (!authToken) {
      setIsLoading(false);
      return null;
    }

    try {
      const response = await fetch(`${API_URL}/user/info`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (response.ok) {
        const userData = await response.json();
        setUserInfo(userData);
        return userData;
      } else {
        throw new Error('Failed to fetch user info');
      }
    } catch (error) {
      console.error("Error fetching user information:", error);
      setToken(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [authToken, setToken]);

  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);

  const logout = useCallback(() => {
    setToken(null);
    setUserInfo(null);
  }, [setToken]);

  return (
    <AuthContext.Provider
      value={{ authToken, setToken, userInfo, fetchUserInfo, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
