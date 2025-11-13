import { Routes, Route } from "react-router-dom";
import SideBar from "./components/SideBar";
import ChatBox from "./components/ChatBox";
import Credits from "./pages/Credits";
import Community from "./pages/Community";
import { useState } from "react";
import { assets } from "./assets/asset/assets";
import { useContext } from "react";
import { Appcontext } from "./contexts/Appcontext";
function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme } = useContext(Appcontext);

  return (
    <>
      {!isMenuOpen && (
        <img
          src={assets.menu_icon}
          className={`absolute top-3 left-3 w-8 h-8 
    cursor-pointer md:hidden ${theme !== "dark" ? "invert" : ""}`}
          onClick={() => setIsMenuOpen(true)}
        />
      )}
      <div
        className={`min-h-screen bg-bg-primary text-text-primary transition-colors duration-200`}
      >
        <div className="flex w-screen h-screen gap-2">
          <SideBar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
          <main className="flex-1 overflow-hidden">
            <Routes>
              <Route path="/" element={<ChatBox />} />
              <Route path="/credits" element={<Credits />} />
              <Route path="/community" element={<Community />} />
            </Routes>
          </main>
        </div>
      </div>
    </>
  );
}

export default App;
