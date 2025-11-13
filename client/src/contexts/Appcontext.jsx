import React, { createContext, useState, useEffect } from "react";
import { dummyChats, dummyUserData } from "../assets/asset/assets";

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
      setUser(dummyUserData);
      setLoading(false);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    // Simulate API call to fetch chats
    const fetchChats = async () => {
      setChats(dummyChats);
    };

    fetchChats();
  }, []);
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
