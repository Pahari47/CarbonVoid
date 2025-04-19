import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import Globe from "../components/Globe";
import Footer from "../components/Footer";
import CarbonModeToggle from "../components/CarbonModeToggle";

const activities = {
  email: {
    label: "Emails Sent",
    placeholder: "Enter number of emails",
    factor: 0.004,
  },
  zoom: {
    label: "Zoom Meeting Hours",
    placeholder: "Enter number of hours",
    factor: 0.1,
  },
  download: {
    label: "Downloads (GB)",
    placeholder: "Enter data in GB",
    factor: 0.02,
  },
  youtube: {
    label: "YouTube Watch Hours",
    placeholder: "Enter watch time in hours",
    factor: 0.08,
  },
};

const Home = () => {
  const { user } = useUser();
  const [emission, setEmission] = useState(0);
  const [activity, setActivity] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [carbonResult, setCarbonResult] = useState(null);
  const [aiSuggestion, setAiSuggestion] = useState("");

  const aiSuggestions = [
    {
      text: "Switch to audio-only mode during Zoom calls to reduce emissions.",
      icon: "🎧",
    },
    {
      text: "Consider unsubscribing from promotional emails to reduce carbon footprint.",
      icon: "📧",
    },
    {
      text: "Opt for streaming rather than downloading to save energy.",
      icon: "📲",
    },
    {
      text: "Choose lower resolution for YouTube videos to cut down emissions.",
      icon: "📺",
    },
    {
      text: "Use energy-efficient video streaming settings for work meetings.",
      icon: "🧑‍💻",
    },
    {
      text: "Avoid unnecessary downloads to limit digital waste.",
      icon: "💾",
    },
  ];
  const [activeTips, setActiveTips] = useState([0, 1, 2]);

  // Live ticker carbon emission
  useEffect(() => {
    const interval = setInterval(() => {
      setEmission((prev) =>
        parseFloat((prev + Math.random() * 0.002).toFixed(4))
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch AI suggestions (mocked for now)
  const fetchAiSuggestions = async () => {
    const mockApiResponse = {
      email: "Consider unsubscribing from promotional emails.",
      zoom: "Switch to audio-only mode during Zoom calls.",
      download: "Opt for streaming rather than downloading.",
      youtube: "Choose lower resolution for YouTube videos.",
    };

    setAiSuggestion(mockApiResponse[activity]);
  };

  const estimateCarbon = () => {
    if (!activity || !inputValue) return;

    const factor = activities[activity].factor;
    const result = inputValue * factor;
    setCarbonResult(result.toFixed(2));

    fetchAiSuggestions();

    const utterance = new SpeechSynthesisUtterance(
      `You generated ${result.toFixed(
        2
      )} kilograms of carbon dioxide. AI suggests: ${aiSuggestion}`
    );
    speechSynthesis.speak(utterance);
  };

  // Rotating tips every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTips((prev) => [
        (prev[0] + 1) % aiSuggestions.length,
        (prev[1] + 1) % aiSuggestions.length,
        (prev[2] + 1) % aiSuggestions.length,
      ]);
    }, 6000); // Change tips every 6 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden text-white bg-black">
      {/* Globe Background */}
      <div className="absolute inset-0 z-0">
        <Globe />
      </div>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center h-[75vh] px-6">
        <div className="max-w-3xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-4xl md:text-6xl font-extrabold mb-4"
          >
            Welcome to <span className="text-green-400">CarboVoid</span> 🌱
          </motion.h1>

          <SignedIn>
            <p className="text-lg text-gray-200 mb-4">
              Hello,{" "}
              <span className="font-semibold">
                {user?.firstName || user?.username}
              </span>
              !
            </p>
          </SignedIn>

          <SignedOut>
            <p className="text-lg text-gray-200 mb-6">
              Track your digital carbon footprint and make greener choices with
              AI-powered insights.
            </p>
            <div className="flex justify-center space-x-4 mb-6">
              <Link
                to="/sign-in"
                className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition"
              >
                Sign In
              </Link>
              <Link
                to="/sign-up"
                className="border border-green-400 text-green-400 px-6 py-2 rounded-full hover:bg-green-100 transition"
              >
                Sign Up
              </Link>
            </div>
          </SignedOut>

          <motion.div
            className="text-sm text-gray-300"
            transition={{ delay: 1 }}
          >
            Empowering users to reduce hidden digital emissions — one byte at a
            time.
          </motion.div>
          {/* Toggle */}
          <CarbonModeToggle />

          <div className="mt-8 text-lg font-medium text-green-300">
            Estimated Carbon Emission:{" "}
            <span className="font-bold">{emission.toFixed(4)} g CO₂</span>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-20 w-full max-w-6xl mx-auto px-6 my-20">
        <h2 className="text-3xl font-extrabold text-center text-white mb-10">
          Our Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: "⚡",
              title: "Personalized Carbon Reports",
              desc: "Detailed breakdown of emissions.",
            },
            {
              icon: "🌱",
              title: "Green Suggestions Assistant",
              desc: "AI-driven reduction tips.",
            },
            {
              icon: "🧼",
              title: "Digital Declutter Assistant",
              desc: "Remove digital waste efficiently.",
            },
            {
              icon: "📊",
              title: "ESG Report Generator",
              desc: "Environmental & social reports.",
            },
          ].map(({ icon, title, desc }) => (
            <div
              key={title}
              className="bg-white/10 text-white p-6 rounded-2xl shadow-xl hover:bg-white/20 transition-all duration-300 text-center"
            >
              <div className="text-4xl mb-4">{icon}</div>
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Live Interactive Estimator */}
      <div className="relative z-20 w-full max-w-3xl mx-auto px-6 my-16">
        <h2 className="text-2xl font-bold text-center text-white mb-6">
          Live Interactive Estimator
        </h2>
        <div className="bg-white/10 p-6 rounded-xl text-white shadow-lg">
          <select
            value={activity}
            onChange={(e) => {
              setActivity(e.target.value);
              setInputValue("");
              setCarbonResult(null);
              setAiSuggestion("");
            }}
            className="w-full mb-4 p-3 rounded-md bg-black border border-green-400 text-green-300"
          >
            <option value="">Select activity</option>
            {Object.keys(activities).map((key) => (
              <option key={key} value={key}>
                {activities[key].label}
              </option>
            ))}
          </select>

          {activity && (
            <>
              <input
                type="number"
                placeholder={activities[activity].placeholder}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full mb-4 p-3 rounded-md bg-black border border-white/20"
              />
              <button
                onClick={estimateCarbon}
                className="bg-green-500 px-6 py-2 rounded-full hover:bg-green-600 transition w-full"
              >
                Estimate
              </button>
            </>
          )}

          {carbonResult && (
            <div className="mt-4 text-lg text-green-300 font-medium">
              You generated: {carbonResult} kg CO₂
              <p className="text-sm text-gray-300 mt-2">{aiSuggestion}</p>
            </div>
          )}
        </div>
      </div>

      {/* Rotating AI Tips Section Heading */}
      <div className="relative z-20 text-center my-12 px-4">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-semibold text-white"
        >
          Smart AI Tips to Reduce Your Carbon Footprint 🌍
        </motion.h2>
      </div>

      {/* Rotating AI Cards - Fullscreen per card */}
      <div className="relative z-20 w-full px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        {activeTips.map((index, i) => {
          const { text, icon } = aiSuggestions[index];
          return (
            <motion.div
              key={i}
              className="mx-4 bg-white/10 p-6 rounded-xl shadow-xl text-white backdrop-blur-md hover:scale-105 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 1, delay: i * 0.5 }}
              viewport={{ once: false, amount: 0.1 }}
            >
              <motion.div
                className="flex justify-center items-center text-6xl mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 2 }}
              >
                {icon}
              </motion.div>
              <motion.p
                className="text-lg font-medium text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 2 }}
              >
                {text}
              </motion.p>
            </motion.div>
          );
        })}
      </div>
      <Footer />
    </div>
  );
};

export default Home;