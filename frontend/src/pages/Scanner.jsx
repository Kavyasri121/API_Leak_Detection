import React, { useState } from "react";
import {
  Search,
  Loader2,
  AlertTriangle,
  ShieldCheck,
  FileText,
  Globe,
  ClipboardCopy,
  MessageSquare,
} from "lucide-react";

import { PieChart, Pie, Cell, Sector } from "recharts";

const BASE_URL = "http://127.0.0.1:5000";

const sources = [
  { id: "manual", name: "Manual Text", icon: <FileText />, desc: "Paste code or logs" },
  { id: "github", name: "GitHub Public", icon: <Globe />, desc: "Scan repositories" },
  { id: "pastebin", name: "Paste Sites", icon: <ClipboardCopy />, desc: "Scan paste data" },
  { id: "forums", name: "Public Forums", icon: <MessageSquare />, desc: "Scan discussions" },
];

const getRiskColor = (risk) => {
  switch (risk) {
    case "HIGH":
      return "text-red-400 bg-red-500/10";
    case "MEDIUM":
      return "text-orange-400 bg-orange-500/10";
    case "LOW":
      return "text-green-400 bg-green-500/10";
    default:
      return "text-yellow-400 bg-yellow-500/10";
  }
};

const Scanner = () => {
  const [activeSource, setActiveSource] = useState("manual");
  const [text, setText] = useState("");
  const [repo, setRepo] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  // ✅ NEW ALERT STATE
  const [alertMsg, setAlertMsg] = useState("");

  const chartData = results
    ? (() => {
        const total = results.findings.length || 1;
        const high = results.findings.filter(r => r.risk === "HIGH").length;
        const medium = results.findings.filter(r => r.risk === "MEDIUM").length;
        const low = results.findings.filter(r => r.risk === "LOW").length;

        return [
          { name: "HIGH", value: (high / total) * 100 },
          { name: "MEDIUM", value: (medium / total) * 100 },
          { name: "LOW", value: (low / total) * 100 },
        ];
      })()
    : [];

  const handleScan = async () => {
    if (activeSource === "manual" && !text.trim()) {
      setError("Enter some text");
      return;
    }

    if (activeSource === "github" && !repo.trim()) {
      setError("Enter repo URL");
      return;
    }

    setLoading(true);
    setError("");
    setResults(null);
    setAlertMsg(""); // reset alert

    try {
      let body = {};

      if (activeSource === "manual") body = { source: "manual", code: text };
      else if (activeSource === "github") body = { source: "github", repo };
      else if (activeSource === "pastebin") body = { source: "paste" };
      else body = { source: "forum" };

      const res = await fetch(`${BASE_URL}/scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      const findings = data.results.map(r => ({
        type: r.type,
        risk: r.risk,
        match: r.key,
      }));

      setResults({
        total: findings.length,
        findings: findings,
      });

      // 🔥 ALERT LOGIC
      if (findings.length > 0) {
        setAlertMsg(`🚨 ${findings.length} leaks detected! Please take action.`);
      } else {
        setAlertMsg("✅ No leaks found. You're safe!");
      }

    } catch {
      setError("Backend error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-black to-[#020617] text-white">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

        {/* Title */}
        <div className="text-center">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-400 to-cyan-400 text-transparent bg-clip-text">
            API Key Scanner
          </h1>
          <p className="text-gray-400 mt-2">
            Detect leaked API keys across sources
          </p>
        </div>

        {/* Sources */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {sources.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setActiveSource(s.id);
                setResults(null);
                setAlertMsg("");
              }}
              className={`p-5 rounded-2xl border transition ${
                activeSource === s.id
                  ? "bg-indigo-600/20 border-indigo-500 scale-105"
                  : "bg-white/5 border-gray-700 hover:border-indigo-400"
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                {s.icon}
                <h3>{s.name}</h3>
                <p className="text-xs text-gray-400">{s.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Inputs */}
        {activeSource === "manual" && (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your code here..."
            className="w-full h-44 p-4 rounded-xl bg-white/5 border border-gray-700"
          />
        )}

        {activeSource === "github" && (
          <input
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            placeholder="https://github.com/user/repo"
            className="w-full p-3 rounded-xl bg-white/5 border border-gray-700"
          />
        )}

        {/* Button */}
        <button
          onClick={handleScan}
          className="w-full py-3 rounded-xl bg-indigo-600 flex justify-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Search />}
          {loading ? "Scanning..." : "Start Scan"}
        </button>

        {/* Error */}
        {error && <div className="text-red-400"><AlertTriangle /> {error}</div>}

        {/* 🔥 ALERT MESSAGE */}
        {alertMsg && (
          <div className={`p-4 rounded-xl text-center font-semibold ${
            alertMsg.includes("🚨")
              ? "bg-red-500/20 text-red-400 border border-red-500"
              : "bg-green-500/20 text-green-400 border border-green-500"
          }`}>
            {alertMsg}
          </div>
        )}

        {/* Results */}
        {results && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Results: {results.total}</h2>

           {/* 🔥 PREMIUM PIE CHART */}
<div className="flex justify-center items-center relative">

  <PieChart width={380} height={380}>

    {/* 🔥 Gradient Definitions */}
    <defs>
      <linearGradient id="highGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#ff4d4f" />
        <stop offset="100%" stopColor="#ff0000" />
      </linearGradient>

      <linearGradient id="medGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#ffa940" />
        <stop offset="100%" stopColor="#ff7a00" />
      </linearGradient>

      <linearGradient id="lowGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#4ade80" />
        <stop offset="100%" stopColor="#16a34a" />
      </linearGradient>
    </defs>

    <Pie
      activeIndex={activeIndex}
      activeShape={(props) => {
        const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
        return (
          <g>
            {/* Glow effect */}
            <Sector
              cx={cx}
              cy={cy}
              innerRadius={innerRadius}
              outerRadius={outerRadius + 12}
              startAngle={startAngle}
              endAngle={endAngle}
              fill={fill}
              style={{ filter: "drop-shadow(0px 0px 12px rgba(255,255,255,0.6))" }}
            />
          </g>
        );
      }}
      data={chartData}
      cx="50%"
      cy="50%"
      innerRadius={80}
      outerRadius={130}
      dataKey="value"
      onMouseEnter={(_, index) => setActiveIndex(index)}
      animationBegin={0}
      animationDuration={1500}
      animationEasing="ease-out"
    >
      {chartData.map((entry, index) => {
        const fills = ["url(#highGrad)", "url(#medGrad)", "url(#lowGrad)"];
        return <Cell key={index} fill={fills[index]} />;
      })}
    </Pie>

    

  </PieChart>

  {/* 🔥 CENTER ANIMATED TEXT */}
  {chartData[activeIndex] && (
    <div className="absolute flex flex-col items-center justify-center transition-all duration-300">
      
      <p className="text-lg font-semibold text-gray-300 tracking-wide">
        {chartData[activeIndex].name}
      </p>

      <p className="text-3xl font-bold text-white animate-pulse">
        {chartData[activeIndex].value.toFixed(0)}%
      </p>

      <p className="text-xs text-gray-500 mt-1">
        Risk Distribution
      </p>

    </div>
  )}

</div>
            {/* Findings */}
            {results.findings.map((item, i) => (
              <div key={i} className="p-4 bg-white/5 rounded-xl">
                <div className="flex justify-between">
                  <h3>{item.type}</h3>
                  <span className={getRiskColor(item.risk)}>
                    {item.risk}
                  </span>
                </div>
                <code className="text-red-400">{item.match}</code>
              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
};

export default Scanner;