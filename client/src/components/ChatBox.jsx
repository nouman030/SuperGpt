import React, { useContext, useState, useRef, useEffect } from "react";
import { Appcontext } from "../contexts/Appcontext";
import { FiSend, FiImage, FiPaperclip } from "react-icons/fi";
import { BsRobot, BsPerson } from "react-icons/bs";
import logo from "../assets/logo.png";
function ChatBox() {
  const { selectedChat } = useContext(Appcontext);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Auto-scroll when messages change or chat is selected
  useEffect(() => {
    scrollToBottom();
  }, [selectedChat, selectedChat?.messages, isTyping]);

  // Initial scroll when component mounts or chat changes (instant)
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [selectedChat?._id]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputValue.trim() === "") return;

    // Add user message
    const userMessage = {
      isImage: false,
      role: "user",
      content: inputValue,
      timestamp: Date.now(),
    };

    selectedChat.messages.push(userMessage);
    setInputValue("");
    // Immediate scroll for better UX
    setTimeout(scrollToBottom, 10);

    // Simulate typing indicator
    setIsTyping(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiResponse = {
        isImage: false,
        role: "assistant",
        content: "I'm your AI assistant. How can I help you today?",
        timestamp: Date.now(),
      };
      selectedChat.messages.push(aiResponse);
      setIsTyping(false);
    }, 1500);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Empty State Component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 animate-fadeIn">
      <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mb-6">
        <img src={logo} alt="SuperGpt Logo" className="w-12 h-12 object-contain" />
      </div>
      <h1 className="text-4xl md:text-5xl font-light mb-3 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 drop-shadow-md">
        SuperGpt
      </h1>
      <p className="text-xl text-[var(--color-text-secondary)] font-light">
        Intelligent AI Assistant
      </p>
      <h2 className="text-3xl md:text-4xl font-semibold mt-8 text-[var(--color-text-primary)] opacity-90">
        Ask me anything.
      </h2>
    </div>
  );

  return (
    <div 
      className="flex flex-col h-full relative transition-colors duration-300"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      {/* Messages Area */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8 custom-scrollbar chat-scroll pb-44"
      >
        {(!selectedChat?.messages || selectedChat.messages.length === 0) ? (
          <EmptyState />
        ) : (
          <>
            {selectedChat.messages.map((message, index) => (
              <div
                key={index}
                className={`flex w-full animate-slideUp ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex max-w-[85%] md:max-w-2xl gap-4 ${
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`shrink-0 h-8 w-8 md:h-10 md:w-10 rounded-full flex items-center justify-center shadow-sm transition-transform hover:scale-110 ${
                      message.role === "user"
                        ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                        : "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
                    }`}
                  >
                    {message.role === "user" ? (
                      <BsPerson className="h-5 w-5 md:h-6 md:w-6" />
                    ) : (
                      <BsRobot className="h-5 w-5 md:h-6 md:w-6" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className="flex flex-col">
                    <div
                      className={`px-6 py-4 shadow-sm ${
                        message.role === "user"
                          ? "rounded-2xl rounded-tr-sm text-white"
                          : "rounded-2xl rounded-tl-sm text-(--color-text-primary)"
                      }`}
                      style={{
                        background: message.role === 'user' 
                          ? 'var(--button-gradient)' 
                          : 'var(--card-gradient)',
                        border: message.role === 'assistant' ? '1px solid var(--color-border)' : 'none'
                      }}
                    >
                      {message.isImage ? (
                        <img
                          src={message.content}
                          alt="Chat content"
                          className="max-w-full rounded-lg shadow-sm mb-2"
                          onLoad={scrollToBottom}
                        />
                      ) : (
                        <p className="whitespace-pre-wrap leading-relaxed text-[15px] md:text-base">
                          {message.content}
                        </p>
                      )}
                    </div>
                    <span 
                      className={`text-[11px] mt-1.5 font-medium opacity-70 ${
                        message.role === 'user' ? 'text-right' : 'text-left'
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start animate-fadeIn">
                <div className="flex items-center gap-4 max-w-2xl">
                   <div className="shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-sm">
                      <BsRobot className="h-6 w-6" />
                   </div>
                   <div 
                     className="px-6 py-5 rounded-2xl rounded-tl-sm shadow-sm"
                     style={{ background: 'var(--card-gradient)', border: '1px solid var(--color-border)' }}
                   >
                    <div className="flex items-center space-x-1.5">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                    </div>
                   </div>
                </div>
              </div>
            )}
            
            {/* Spacer to prevent input overlap */}
            <div className="h-32 md:h-40 shrink-0" />
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Floating Input Area */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-4 md:p-6 bg-gradient-to-t from-[var(--color-bg-primary)] via-[var(--color-bg-primary)] to-transparent">
        <div className="max-w-4xl mx-auto">
          <form 
            onSubmit={handleSubmit} 
            className="flex items-center gap-2 p-2 rounded-full shadow-lg border backdrop-blur-md transition-all duration-300 focus-within:shadow-xl focus-within:border-[var(--color-accent)]"
            style={{ 
              backgroundColor: 'var(--color-bg-secondary)',
              borderColor: 'var(--color-border)'
            }}
          >
            {/* Text Dropdown (Visual) */}
            <div className="hidden md:flex items-center gap-1 px-4 py-2 border-r border-[var(--color-border)] text-(--color-text-secondary) cursor-pointer hover:text-(--color-text-primary) transition-colors">
              <span className="text-sm font-medium">Text</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>

            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Type your prompt here..."
              className="flex-1 px-4 py-3 bg-transparent text-(--color-text-primary) placeholder-gray-400 focus:outline-none text-base"
            />
            
            <div className="flex items-center gap-1 pr-2">
              <button
                type="button"
                className="p-2 rounded-full hover:bg-(--color-bg-tertiary) text-(--color-text-secondary) transition-colors"
                title="Attach file"
              >
                <FiPaperclip className="h-5 w-5" />
              </button>
              
              <button
                type="button"
                className="p-2 rounded-full hover:bg-(--color-bg-tertiary) text-(--color-text-secondary) transition-colors"
                title="Send image"
              >
                <FiImage className="h-5 w-5" />
              </button>

              <button
                type="submit"
                disabled={!inputValue.trim()}
                className={`p-3 rounded-full shadow-md transform transition-all duration-200 ml-1 ${
                  inputValue.trim()
                    ? "hover:scale-105 active:scale-95"
                    : "opacity-50 cursor-not-allowed"
                }`}
                style={{ 
                  background: 'var(--button-gradient)',
                  color: 'var(--color-button-text)'
                }}
                title="Send message"
              >
                <FiSend className="h-5 w-5" />
              </button>
            </div>
          </form>
          <div className="text-center mt-2">
             <p className="text-[10px] text-[var(--color-text-secondary)] opacity-60">
               SuperGpt can make mistakes. Consider checking important information.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatBox;

