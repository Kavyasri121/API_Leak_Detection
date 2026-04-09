import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";

import Home from "./pages/Home";
import Scanner from "./pages/Scanner";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

function Navigation() {
  const location = useLocation(); // Re-evaluates component on route changes
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("user");

  const isAuthPage = ['/login', '/signup'].includes(location.pathname);

  const handleLogout = () => {
    const isConfirm = window.confirm("Are you sure you want to log out?");
    if (isConfirm) {
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  return (
    <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/home" className="flex items-center gap-2 text-xl font-bold text-white">
          <Shield className="w-6 h-6 text-indigo-500" />
          KeyShield AI
        </Link>
        <div className="flex gap-6 text-sm items-center">
          <Link to="/home" className="hover:text-white transition-colors">Home</Link>
          <Link to="/scanner" className="hover:text-white transition-colors">Scanner</Link>
          
          {!isAuthPage && (
            isAuthenticated ? (
              <button 
                onClick={handleLogout} 
                className="px-4 py-2 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded-lg transition-colors ml-4 border border-rose-500/20 font-medium"
              >
                Log Out
              </button>
            ) : (
              <Link 
                to="/login" 
                className="px-4 py-2 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 rounded-lg transition-colors ml-4 border border-indigo-500/20 font-medium"
              >
                Log In
              </Link>
            )
          )}
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-200">

        <Navigation />

        {/* ROUTES */}
        <main className="max-w-7xl mx-auto px-6 py-10">
          <Routes>
            <Route path="/" element={<Navigate to="/signup" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/home" element={<Home />} />
            <Route path="/scanner" element={<Scanner />} />
          </Routes>
        </main>

      </div>
    </Router>
  );
}

export default App;