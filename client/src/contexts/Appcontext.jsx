import React, { createContext, useState, useEffect } from "react";


const Appcontext = createContext();

const AppcontextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [theme, setTheme] = useState(null);
  useEffect(() => {
    // Simulate API call to fetch user data
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/api/user', {
          headers: {
            Authorization: token,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.Success) {
            setUser(data.user);
          } else {
            setUser(null);
            localStorage.removeItem('token');
          }
        } else {
          setUser(null);
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };  

    fetchUser();
  }, []);

  useEffect(() => {
    // Simulate API call to fetch chats
    const fetchChats = async () => {
      if (user) {
        const response = await fetch('http://localhost:3000/api/getUserChats', {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.Success) {
            setChats(data.chats);
          } else {
            setChats([]);
          }
        } else {
          setChats([]);
        }
      }
    };

    fetchChats();
  }, [user]);
  useEffect(() => {
    // Initialize theme from localStorage or system preference
    const savedTheme = localStorage.getItem("theme");
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
    const initialTheme = savedTheme || systemTheme;

    setTheme(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);
  }, []);

  useEffect(() => {
    // Update theme whenever it changes
    if (theme) {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  const value = {
    user,
    setUser,
    loading,
    setLoading,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    theme,
    setTheme,
  };

  return <Appcontext.Provider value={value}>{children}</Appcontext.Provider>;
};

export { Appcontext, AppcontextProvider };
