import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Shield } from "lucide-react";

import Home from "./pages/Home";
import Scanner from "./pages/Scanner";
import Signup from "./pages/Signup";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-200">

        {/* NAVBAR */}
        <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

            <Link to="/home" className="flex items-center gap-2 text-xl font-bold text-white">
              <Shield className="w-6 h-6 text-indigo-500" />
              KeyShield AI
            </Link>

            <div className="flex gap-6 text-sm">
              <Link to="/home">Home</Link>
              <Link to="/scanner">Scanner</Link>
            </div>
          </div>
        </nav>

        {/* ROUTES */}
        <main className="max-w-7xl mx-auto px-6 py-10">
          <Routes>
            <Route path="/" element={<Signup />} /> {/* 🔥 FIRST PAGE */}
            <Route path="/home" element={<Home />} />
            <Route path="/scanner" element={<Scanner />} />
          </Routes>
        </main>

      </div>
    </Router>
  );
}

export default App;