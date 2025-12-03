import React, { useContext, useState, useRef, useEffect } from "react";
import { Appcontext } from "../contexts/Appcontext";
import { FiSend, FiImage, FiPaperclip, FiMoreVertical, FiTrash2, FiCopy, FiChevronDown } from "react-icons/fi";
import { FaDownload, FaExpand, FaTimes, FaRobot, FaUser } from "react-icons/fa";
import logo from "../assets/logo.png";
import { toast } from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

function ChatBox() {
  const { selectedChat, setSelectedChat, setChats } = useContext(Appcontext);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);
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

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat, selectedChat?.messages, isTyping]);

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

      if (!selectedChat) {
        setInputValue("");
        setIsTyping(true);

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/createChat`, {
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
          setChats((prev) => [data.chat, ...prev]);
          setSelectedChat(data.chat);
          
          setTimeout(async () => {
             setSelectedChat({...data.chat}); 
             setIsTyping(false);
          }, 1500);

        } else {
          toast.error(data.message || "Failed to create chat");
          setIsTyping(false);
        }
        return;
      }

      selectedChat.messages.push(userMessage);
      setInputValue("");
      setTimeout(scrollToBottom, 10);
      setIsTyping(true);

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/addMessage`, {
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

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 animate-fadeIn select-none">
      <div className="w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-purple-600/10 rounded-[2rem] flex items-center justify-center shadow-sm mb-8 backdrop-blur-sm border border-white/20 dark:border-white/5 ring-1 ring-white/20">
        <img src={logo} alt="SuperGpt Logo" className="w-14 h-14 object-contain opacity-90 drop-shadow-sm" />
      </div>
      <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 tracking-tight">
        SuperGpt
      </h1>
      <p className="text-lg text-[var(--color-text-secondary)] font-medium max-w-md leading-relaxed opacity-80">
        Your intelligent AI companion for code, creativity, and conversation.
      </p>
    </div>
  );

  return (
    <div className="flex flex-col h-full relative bg-[var(--color-bg-primary)] overflow-hidden transition-colors duration-300">
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 space-y-8 scroll-smooth pb-32 md:pb-48">
        <div className="max-w-5xl mx-auto w-full space-y-8">
          {(!selectedChat?.messages || selectedChat.messages.length === 0) ? (
            <EmptyState />
          ) : (
            <>
              {selectedChat.messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex w-full animate-slideUp group ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex max-w-[95%] md:max-w-3xl gap-4 ${
                      message.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`shrink-0 h-10 w-10 rounded-full flex items-center justify-center shadow-sm ring-2 ring-white/10 ${
                        message.role === "user"
                          ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white"
                          : "bg-gradient-to-br from-emerald-500 to-teal-600 text-white"
                      }`}
                    >
                      {message.role === "user" ? (
                        <FaUser className="h-4 w-4" />
                      ) : (
                        <FaRobot className="h-5 w-5" />
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div className={`flex flex-col ${message.role === "user" ? "items-end" : "items-start"} min-w-0 max-w-full`}>
                      <div
                        className={`px-6 py-4 shadow-sm w-full relative group-hover:shadow-md transition-shadow duration-300 ${
                          message.role === "user"
                            ? "rounded-[2rem] rounded-tr-sm text-white bg-gradient-to-br from-blue-600 to-indigo-600"
                            : "rounded-[2rem] rounded-tl-sm text-[var(--color-text-primary)] bg-[var(--color-bg-secondary)] border border-[var(--color-border)]"
                        }`}
                      >
                        {message.isImage ? (
                          <div className="relative group/image rounded-xl overflow-hidden bg-black/5 -m-2">
                            <img
                              src={message.content}
                              alt="Generated content"
                              className="max-w-full h-auto object-cover cursor-pointer transition-transform duration-700 group-hover/image:scale-105"
                              onLoad={scrollToBottom}
                              onClick={() => setSelectedImage({ imageUrl: message.content, prompt: "generated-image" })}
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedImage({ imageUrl: message.content, prompt: "generated-image" });
                                }}
                                className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-all transform hover:scale-110 active:scale-95"
                              >
                                <FaExpand size={18} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownload(message.content, "generated-image");
                                }}
                                className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-all transform hover:scale-110 active:scale-95"
                              >
                                <FaDownload size={18} />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="prose prose-invert max-w-none text-[15px] md:text-[16px] leading-7 break-words min-w-0">
                            <ReactMarkdown
                              components={{
                                code({ node, inline, className, children, ...props }) {
                                  const match = /language-(\w+)/.exec(className || "");
                                  return !inline && match ? (
                                    <div className="rounded-xl overflow-hidden my-4 border border-[var(--color-border)] bg-[#1e1e1e] shadow-lg w-full max-w-full group/code">
                                      <div className="flex items-center justify-between px-4 py-2.5 bg-[#2d2d2d] border-b border-[#404040]">
                                        <div className="flex items-center gap-2">
                                          <div className="flex gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
                                            <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
                                            <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
                                          </div>
                                          <span className="text-xs font-mono text-gray-400 lowercase ml-2">
                                            {match[1]}
                                          </span>
                                        </div>
                                        <button
                                          onClick={() => {
                                             navigator.clipboard.writeText(String(children).replace(/\n$/, ""));
                                             toast.success("Copied!");
                                          }}
                                          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors bg-white/5 px-2 py-1 rounded-md hover:bg-white/10"
                                        >
                                          <FiCopy /> Copy
                                        </button>
                                      </div>
                                      <div className="overflow-x-auto w-full">
                                        <SyntaxHighlighter
                                          style={vscDarkPlus}
                                          language={match[1]}
                                          PreTag="div"
                                          customStyle={{
                                            margin: 0,
                                            padding: '1.5rem',
                                            background: 'transparent',
                                            fontSize: '0.9rem',
                                            lineHeight: '1.5',
                                          }}
                                          {...props}
                                        >
                                          {String(children).replace(/\n$/, "")}
                                        </SyntaxHighlighter>
                                      </div>
                                    </div>
                                  ) : (
                                    <code className={`${className} bg-black/10 dark:bg-white/10 rounded-md px-1.5 py-0.5 text-[0.9em] font-mono break-all border border-black/5 dark:border-white/5`} {...props}>
                                      {children}
                                    </code>
                                  );
                                },
                                a: ({ href, children }) => (
                                  <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline decoration-blue-400/30 underline-offset-4 break-all transition-colors">
                                    {children}
                                  </a>
                                ),
                                p: ({ children }) => <p className="mb-2 last:mb-0 break-words">{children}</p>,
                                ul: ({ children }) => <ul className="list-disc ml-5 mb-2 space-y-1 marker:text-[var(--color-text-secondary)]">{children}</ul>,
                                ol: ({ children }) => <ol className="list-decimal ml-5 mb-2 space-y-1 marker:text-[var(--color-text-secondary)]">{children}</ol>,
                                blockquote: ({ children }) => <blockquote className="border-l-4 border-indigo-500/50 pl-4 italic my-2 text-[var(--color-text-secondary)]">{children}</blockquote>,
                              }}
                            >
                              {message.content}
                            </ReactMarkdown>
                          </div>
                        )}
                      </div>
                      <span className={`text-[11px] mt-2 text-[var(--color-text-secondary)] opacity-60 font-medium px-2 transition-opacity duration-300 ${message.role === "user" ? "text-right" : "text-left"}`}>
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start animate-fadeIn w-full">
                  <div className="flex items-center gap-4 max-w-3xl">
                     <div className="shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-sm ring-2 ring-white/10">
                        <FaRobot className="h-5 w-5" />
                     </div>
                     <div className="px-6 py-5 rounded-[2rem] rounded-tl-sm bg-[var(--color-bg-secondary)] border border-[var(--color-border)] shadow-sm">
                      <div className="flex items-center space-x-1.5">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                        <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                      </div>
                     </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} className="h-4" />
            </>
          )}
        </div>
      </div>

      {/* Input Area - Floating Pill Design */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-[var(--color-bg-primary)] via-[var(--color-bg-primary)]/90 to-transparent pointer-events-none">
        <div className="max-w-4xl mx-auto pointer-events-auto w-full">
          <form 
            onSubmit={handleSubmit} 
            className="flex items-end gap-1 md:gap-2 p-1.5 md:p-2 rounded-[2rem] bg-[var(--color-bg-secondary)]/80 backdrop-blur-xl border border-[var(--color-border)] shadow-lg hover:shadow-xl focus-within:shadow-2xl focus-within:border-indigo-500/30 focus-within:bg-[var(--color-bg-secondary)] transition-all duration-300 ease-out"
          >
            {/* Mode Selector */}
            <div className="relative self-center ml-1 md:ml-2">
              <button
                type="button"
                onClick={() => setShowModeDropdown(!showModeDropdown)}
                className={`px-2 md:px-4 py-2.5 rounded-full transition-all duration-200 flex items-center gap-2 font-medium text-sm ${
                  inputMode === 'image' 
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' 
                    : 'bg-[var(--color-bg-tertiary)]/50 hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)]'
                }`}
                title="Switch mode"
              >
                {inputMode === 'image' ? (
                  <>
                    <FiImage size={16} />
                    <span className="hidden md:inline">Image</span>
                  </>
                ) : (
                  <>
                    <FaUser size={14} />
                    <span className="hidden md:inline">Text</span>
                  </>
                )}
                <FiChevronDown size={14} className={`transition-transform duration-200 ${showModeDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showModeDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowModeDropdown(false)} />
                  <div className="absolute bottom-full left-0 mb-4 w-48 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl shadow-2xl overflow-hidden z-20 animate-fadeIn origin-bottom-left">
                    <div className="p-1.5 space-y-0.5">
                      <button
                        type="button"
                        className={`w-full px-4 py-3 text-sm text-left rounded-xl flex items-center gap-3 transition-all ${inputMode === 'text' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 font-medium' : 'text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]'}`}
                        onClick={() => { setInputMode('text'); setShowModeDropdown(false); }}
                      >
                        <FaUser className="w-4 h-4" /> Text Chat
                      </button>
                      <button
                        type="button"
                        className={`w-full px-4 py-3 text-sm text-left rounded-xl flex items-center gap-3 transition-all ${inputMode === 'image' ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 font-medium' : 'text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]'}`}
                        onClick={() => { setInputMode('image'); setShowModeDropdown(false); }}
                      >
                        <FiImage className="w-4 h-4" /> Generate Image
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder={inputMode === 'image' ? "Describe the image you want to generate..." : "Message SuperGpt..."}
              className="flex-1 min-w-0 bg-transparent text-[var(--color-text-primary)] placeholder-gray-400 focus:outline-none text-[16px] py-3.5 px-2 max-h-32 overflow-y-auto"
              autoComplete="off"
            />
            
            <div className="flex items-center gap-1 self-center mr-1">
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className={`p-3.5 rounded-full shadow-sm transition-all duration-300 transform ${
                  inputValue.trim()
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:scale-105 active:scale-95 rotate-0"
                    : "bg-[var(--color-bg-tertiary)] text-gray-400 cursor-not-allowed rotate-45 opacity-50"
                }`}
              >
                <FiSend className={`w-5 h-5 ${inputValue.trim() ? 'ml-0.5' : ''}`} />
              </button>
            </div>
          </form>
          <p className="text-center text-[10px] md:text-xs text-[var(--color-text-secondary)] mt-3 opacity-50 font-medium tracking-wide">
            SuperGpt can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-xl animate-fadeIn"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition-all z-50 hover:rotate-90 duration-300"
            onClick={() => setSelectedImage(null)}
          >
            <FaTimes size={24} />
          </button>
          
          <div 
            className="relative max-w-7xl w-full h-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.imageUrl}
              alt="Preview"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl ring-1 ring-white/10"
            />
            <div className="mt-8 flex items-center gap-4 animate-slideUp">
              <button
                onClick={() => handleDownload(selectedImage.imageUrl, selectedImage.prompt)}
                className="flex items-center gap-2 px-8 py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-100 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] active:scale-95 transform hover:-translate-y-1"
              >
                <FaDownload /> Download High Quality
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatBox;
