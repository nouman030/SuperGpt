import React, { useContext, useState } from "react";
import { Appcontext } from "../contexts/Appcontext";
import {
  FiPlus,
  FiMessageSquare,
  FiLogOut,
  FiSearch,
  FiUsers,
  FiCreditCard,
  FiTrash,
  FiMoon,
  FiSun,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/Logo_with_name.png";
import moment from "moment";
import { assets } from "../assets/asset/assets";
import { toast } from "react-hot-toast";

import { usePopup, ConfirmationPopup } from "../hooks/popup";

function SideBar({ isMenuOpen, setIsMenuOpen }) {
  const { chats, setChats, selectedChat, setSelectedChat, user, theme, setTheme, setUser } =
    useContext(Appcontext);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { isOpen, openPopup, closePopup } = usePopup();

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  // Filter chats based on search query
  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogoutClick = () => {
    openPopup();
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/log-in");
    closePopup();
  };

  const newChat = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/createChat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({
          name: "New Chat",
        }),
      });
      const data = await response.json();
      if (data.Success) {
        toast.success("New chat created!");
        navigate("/");
        setIsMenuOpen(false);
        setChats((prev) => [data.chat, ...prev]);
        setSelectedChat(data.chat);
      } else {
        toast.error(data.message || "Failed to create chat");
      }
    } catch (error) {
      
      toast.error("Something went wrong");
    }
  };

  const onDeleteChat = async (chatId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/deleteChat/${chatId}`, {
        method: "DELETE",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      const data = await response.json();
      if (data.Success) {
        toast.success("Chat deleted");
        setChats((prev) => prev.filter((chat) => chat._id !== chatId));
        if (selectedChat?._id === chatId) {
          setSelectedChat(null);
          navigate("/");
        }
      } else {
        toast.error(data.message || "Failed to delete chat");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
      
      <div
        className={`fixed md:relative w-64 md:w-72 h-screen bg-bg-primary text-text-primary flex flex-col transform transition-transform duration-300 ease-in-out z-40 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
        style={{
          background: "var(--sidebar-gradient)",
        }}
      >
        {/* Logo */}
        <div className="flex justify-center py-2 px-3 bg-bg-primary/50">
          <Link
            to="/"
            className="flex items-center"
            onClick={() => navigate("/") && setIsMenuOpen(false)}
          >
            <img
              src={logo}
              alt="Logo"
              className="h-16 w-36 object-cover rounded"
            />
          </Link>
        </div>

        {/* New Chat Button */}
        <button
          className="flex items-center justify-center cursor-pointer gap-2 mx-4 mb-1 p-3 rounded-lg border bg-bg-secondary/20 text-text-primary border-border hover:bg-bg-tertiary transition-colors"
          onClick={() => newChat()}
        >
          <FiPlus className="w-5 h-5" />
          <span>New chat</span>
        </button>



        {/* Search Bar */}
        <div className="p-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <span className="text-text-secondary">
                <FiSearch />
              </span>
            </div>
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="placeholder:text-gray-400 w-full bg-bg-secondary text-text-primary pl-10 pr-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>
        </div>

        {/* History Section */}
        <div className="flex-1 overflow-y-auto px-4">
          <h3 className="text-sm font-medium text-gray-400 px-2 mb-2">Recent</h3>
          <div className="space-y-1">
            {filteredChats.map((chat) => (
              <button
                key={chat._id}
                className={`w-full flex items-center gap-3 p-2 rounded-lg text-left text-sm ${
                  selectedChat?._id === chat._id
                    ? "bg-bg-tertiary text-text-primary"
                    : "hover:bg-bg-secondary text-text-primary"
                }`}
                onClick={() => setSelectedChat(chat)}
              >
                <FiMessageSquare className="shrink-0 w-4 h-4 text-text-secondary " />

                <div
                  className="cursor-pointer flex flex-1 justify-around align-center items-center pr-2"
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate("/");
                  }}
                >
                  <div className="flex flex-col">
                    <span className="truncate" title={chat.name}>
                      {chat.name}
                    </span>
                    <span className="text-xs text-gray-400">
                      {moment(chat.updatedAt).fromNow()}
                    </span>
                  </div>
                  <div className="ml-auto">
                    <span
                      title="Delete chat"
                      className="cursor-pointer hover:text-red-400 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteChat(chat._id);
                      }}
                    >
                      {<FiTrash className="w-4 h-4" />}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Menu Items */}
        <div className="p-2 space-y-1">
          <Link
            to="/community"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-bg-secondary transition-colors text-text-secondary hover:text-text-primary"
          >
            <FiUsers className="w-5 h-5" />
            <span>Community</span>
          </Link>

          <Link
            to="/credits"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-bg-secondary transition-colors text-text-secondary hover:text-text-primary"
          >
            <div className="flex items-center gap-3">
              <FiCreditCard className="w-5 h-5" />
              <span>Credits</span>
            </div>
            {user && (
              <span className="text-xs bg-bg-tertiary text-text-primary px-2 py-1 rounded-full">
                {user.credits || 0}
              </span>
            )}
          </Link>
        </div>
        {/* Theme Switcher */}
        <div className="px-4 py-1">
          <div className="flex items-center justify-between p-3 rounded-lg bg-bg-secondary/50">
            <div className="flex items-center gap-3">
              {theme === "dark" ? (
                <FiSun className="w-4 h-4" />
              ) : (
                <FiMoon className="w-4 h-4" />
              )}
              <span className="text-text-secondary text-sm">Dark mode</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={theme === "dark"}
                onChange={toggleTheme}
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-800 mt-auto">
          {user && (
            <div 
              className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-600/30 transition-colors cursor-pointer"
              onClick={handleLogoutClick}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-medium shrink-0">
                  {user.name.split("").slice(0, 2).join("").toUpperCase()}
                </div>
                <div className="text-sm">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-xs text-gray-400">
                    {user.email || "View profile"}
                  </div>
                </div>
              </div>
              <FiLogOut className="w-4 h-4 text-gray-400" />
            </div>
          )}
        </div>

        <img
          src={assets.close_icon}
          className={`absolute top-3 right-3 w-5 h-5 cursor-pointer md:hidden z-50 ${
            theme !== "dark" ? "invert" : ""
          }`}
          alt=""
          onClick={() => setIsMenuOpen(false)}
        />

        <ConfirmationPopup
          isOpen={isOpen}
          onClose={closePopup}
          onConfirm={confirmLogout}
          title="Confirm Logout"
          message="Are you sure you want to log out?"
          confirmText="Logout"
          cancelText="Cancel"
        />
      </div>
    </>
  );
}

export default SideBar;
