import { Routes, Route } from "react-router-dom";
import SideBar from "./components/SideBar";
import ChatBox from "./components/ChatBox";
import Credits from "./pages/Credits";
import Community from "./pages/Community";
import { useState } from "react";
import { assets } from "./assets/asset/assets";
import { useContext } from "react";
import { Appcontext } from "./contexts/Appcontext";
import Login from "./pages/Login";
import SignUp from "./pages/sign-up";
import NotFound from "./pages/Erorr-404";
import { Toaster } from "react-hot-toast";


function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, user } = useContext(Appcontext);

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      {!isMenuOpen && (
        <img
          src={assets.menu_icon}
          className={`absolute top-3 left-3 w-8 h-8 z-50
    cursor-pointer md:hidden ${theme !== "dark" ? "invert" : ""}`}
          onClick={() => setIsMenuOpen(true)}
        />
      )}
      <div
        className={`min-h-screen bg-bg-primary text-text-primary transition-colors duration-200`}
      >
        <div className="flex w-screen h-screen">
          {user ? ( 
            <>
             <SideBar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
              <main className="flex-1 overflow-hidden">
                <Routes>
               <Route path="/" element={<ChatBox />} />  
                  <Route path="/credits" element={<Credits />} />
                  <Route path="/community" element={<Community />} />
                   <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </>
          ) : (   
            <div className="flex w-screen h-screen justify-center items-center">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/log-in" element={<Login />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
