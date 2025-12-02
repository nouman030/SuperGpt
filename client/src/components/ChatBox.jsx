import React, { useContext, useState, useRef, useEffect } from "react";
import { Appcontext } from "../contexts/Appcontext";
import { FiSend, FiImage, FiPaperclip } from "react-icons/fi";
import { FaDownload, FaExpand, FaTimes } from "react-icons/fa";
import { BsRobot, BsPerson } from "react-icons/bs";
import logo from "../assets/logo.png";
import { toast } from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

function ChatBox() {
  const { selectedChat, setSelectedChat, setChats } = useContext(Appcontext);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);

  const [inputMode, setInputMode] = useState("text"); // 'text' or 'image'
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleDownload = async (imageUrl, prompt) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `generated-image-${prompt ? prompt.substring(0, 20) : 'ai'}-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      window.open(imageUrl, "_blank");
    }
  };

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

    try {
      const userMessage = {
        isImage: false,
        role: "user",
        content: inputValue,
        timestamp: Date.now(),
      };

      // If no chat selected, create a new one
      if (!selectedChat) {
        setInputValue("");
        setIsTyping(true);

        const response = await fetch("http://localhost:3000/api/createChat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify({
            message: inputValue,
            name: inputValue.substring(0, 30) + (inputValue.length > 30 ? "..." : ""),
            mode: inputMode,
          }),
        });

        const data = await response.json();

        if (data.Success) {
          // Update chats list and select the new chat
          setChats((prev) => [data.chat, ...prev]);
          setSelectedChat(data.chat);
          
          // Simulate AI response
          setTimeout(async () => {
            const aiResponse = await {
              isImage: data.chat.messages[data.chat.messages.length - 1].isImage || false,
              role: "assistant",
              content: data.chat.messages[data.chat.messages.length - 1].content,
              timestamp: Date.now(),
            };
             // Ensure we don't duplicate if the backend already added it (which it does)
             // But for optimistic UI or sync, we might need to check. 
             // In this flow, we are fetching the chat which already has the message.
             // So we just update the selectedChat with the new chat data.
             setSelectedChat({...data.chat}); 
             setIsTyping(false);
          }, 1500);

        } else {
          toast.error(data.message || "Failed to create chat");
          setIsTyping(false);
        }
        return;
      }

      // Existing logic for adding message to selected chat
      selectedChat.messages.push(userMessage);
      setInputValue("");
      setTimeout(scrollToBottom, 10);
      setIsTyping(true);

      const response = await fetch("http://localhost:3000/api/addMessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({
          chatId: selectedChat._id,
          message: inputValue,
          mode: inputMode,
        }),
      });

      const data = await response.json();

      if (!data.Success) {
        toast.error(data.message || "Failed to send message");
        selectedChat.messages.pop();
        setIsTyping(false);
        return;
      }

      setTimeout(() => {
        const lastMsg = data.chat.messages[data.chat.messages.length - 1];
        const aiResponse = {
          isImage: lastMsg.isImage || false,
          role: "assistant",
          content: lastMsg.content,
          timestamp: Date.now(),
        };
        selectedChat.messages.push(aiResponse);
        setIsTyping(false);
      }, 1500);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      setIsTyping(false);
      if (selectedChat) {
         selectedChat.messages.pop();
      }
    }
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
                        <div className="relative group overflow-hidden rounded-lg shadow-sm mb-2">
                          <img
                            src={message.content}
                            alt="Chat content"
                            className="max-w-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
                            onLoad={scrollToBottom}
                            onClick={() => setSelectedImage({ imageUrl: message.content, prompt: "generated-image" })}
                          />
                          {/* Overlay */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedImage({ imageUrl: message.content, prompt: "generated-image" });
                              }}
                              className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/40 transition-colors"
                              title="Preview"
                            >
                              <FaExpand />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(message.content, "generated-image");
                              }}
                              className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/40 transition-colors"
                              title="Download"
                            >
                              <FaDownload />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="markdown-container text-[15px] md:text-base leading-relaxed">
                          <ReactMarkdown
                            components={{
                              code({ node, inline, className, children, ...props }) {
                                const match = /language-(\w+)/.exec(className || "");
                                return !inline && match ? (
                                  <div className="rounded-md overflow-hidden my-2 border border-(--color-border)">
                                    <div className="flex items-center justify-between px-4 py-1.5 bg-[#1e1e1e] border-b border-(--color-border)">
                                      <span className="text-xs font-medium text-gray-400 lowercase">
                                        {match[1]}
                                      </span>
                                      <button
                                        onClick={() => {
                                           navigator.clipboard.writeText(String(children).replace(/\n$/, ""));
                                           toast.success("Copied to clipboard!");
                                        }}
                                        className="text-xs text-gray-400 hover:text-white transition-colors cursor-pointer"
                                      >
                                        Copy
                                      </button>
                                    </div>
                                    <SyntaxHighlighter
                                      style={vscDarkPlus}
                                      language={match[1]}
                                      PreTag="div"
                                      customStyle={{
                                        margin: 0,
                                        borderRadius: "0 0 0.375rem 0.375rem",
                                        fontSize: "0.875rem", // 14px
                                      }}
                                      {...props}
                                    >
                                      {String(children).replace(/\n$/, "")}
                                    </SyntaxHighlighter>
                                  </div>
                                ) : (
                                  <code className={`${className} bg-black/20 rounded px-1 py-0.5 text-sm`} {...props}>
                                    {children}
                                  </code>
                                );
                              },
                              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                              ul: ({ children }) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
                              ol: ({ children }) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
                              li: ({ children }) => <li className="mb-1">{children}</li>,
                              a: ({ href, children }) => (
                                <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                                  {children}
                                </a>
                              ),
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
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
            className="flex items-center gap-2 pl-4 pr-2 py-2 rounded-full shadow-lg border backdrop-blur-md transition-all duration-300 focus-within:shadow-xl focus-within:border-[var(--color-accent)]"
            style={{ 
              backgroundColor: 'var(--color-bg-secondary)',
              borderColor: 'var(--color-border)'
            }}
          >
            {/* Mode Dropdown */}
            <div className="relative">
              <div 
                className="hidden md:flex items-center gap-1 pr-4 border-r border-(--color-border) text-(--color-text-secondary) cursor-pointer hover:text-(--color-text-primary) transition-colors"
                onClick={() => setShowModeDropdown(!showModeDropdown)}
              >
                <span className="text-sm font-medium capitalize min-w-[40px]">{inputMode}</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                
                {/* Dropdown Menu */}
                {showModeDropdown && (
                  <div className="absolute bottom-full left-0 mb-2 w-32 bg-(--color-bg-secondary) border border-(--color-border) rounded-xl shadow-xl overflow-hidden z-50 animate-fadeIn">
                    <div 
                      className={`px-4 py-2 text-sm hover:bg-(--color-bg-tertiary) cursor-pointer flex items-center gap-2 ${inputMode === 'text' ? 'text-(--color-accent)' : ''}`}
                      onClick={() => { setInputMode('text'); setShowModeDropdown(false); }}
                    >
                      <BsPerson className="w-4 h-4" /> Text
                    </div>
                    <div 
                      className={`px-4 py-2 text-sm hover:bg-(--color-bg-tertiary) cursor-pointer flex items-center gap-2 ${inputMode === 'image' ? 'text-(--color-accent)' : ''}`}
                      onClick={() => { setInputMode('image'); setShowModeDropdown(false); }}
                    >
                      <FiImage className="w-4 h-4" /> Image
                    </div>
                  </div>
                )}
              </div>
            </div>

            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder={inputMode === 'image' ? "Describe the image you want to generate..." : "Type your prompt here..."}
              className="flex-1 bg-transparent text-(--color-text-primary) placeholder-gray-400 focus:outline-none text-base py-2 pl-2"
            />
            
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="p-2 rounded-full hover:bg-(--color-bg-tertiary) text-(--color-text-secondary) transition-colors"
                title="Attach file"
              >
                <FiPaperclip className="h-5 w-5" />
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
      {/* Image Preview Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white text-3xl transition-colors cursor-pointer z-50"
            onClick={() => setSelectedImage(null)}
          >
            <FaTimes />
          </button>
          
          <div 
            className="relative max-w-5xl max-h-[90vh] w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.imageUrl}
              alt="Preview"
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
            />
            <div className="mt-4 flex items-center gap-4">
              <button
                onClick={() => handleDownload(selectedImage.imageUrl, selectedImage.prompt)}
                className="flex items-center gap-2 px-4 py-2 bg-(--color-accent) text-white rounded-lg hover:bg-(--color-accent-hover) transition-colors cursor-pointer"
              >
                <FaDownload /> Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatBox;

