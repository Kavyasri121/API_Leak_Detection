import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔥 REQUIRED VALIDATION
    if (!form.username || !form.email || !form.password || !form.confirmPassword) {
      setError("All fields are required *");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Save user (temporary)
    localStorage.setItem("user", JSON.stringify(form));

    // 🔥 REDIRECT TO HOME
    navigate("/home");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-black to-gray-900">

      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 w-full max-w-md shadow-xl">

        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Sign Up 🚀
        </h2>

        {error && (
          <div className="text-red-400 text-center mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Username */}
          <div>
            <label className="text-sm text-gray-300">
              Username <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full p-3 mt-1 bg-black/40 border border-gray-600 rounded-lg text-white"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-300">
              Email <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 mt-1 bg-black/40 border border-gray-600 rounded-lg text-white"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-300">
              Password <span className="text-red-400">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-3 mt-1 bg-black/40 border border-gray-600 rounded-lg text-white"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-sm text-gray-300">
              Confirm Password <span className="text-red-400">*</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 mt-1 bg-black/40 border border-gray-600 rounded-lg text-white"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-semibold"
          >
            Create Account
          </button>

        </form>
      </div>
    </div>
  );
};

export default Signup;