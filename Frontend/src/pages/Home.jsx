import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import { motion, useAnimation, useScroll, AnimatePresence } from "framer-motion";
import Globe from "../components/Globe";
import Footer from "../components/Footer";
import CarbonModeToggle from "../components/CarbonModeToggle";
import { FiArrowUp } from "react-icons/fi";

const activities = {
  email: {
    label: "Emails Sent",
    placeholder: "Enter number of emails",
    factor: 0.004,
    icon: "📧",
  },
  zoom: {
    label: "Zoom Meeting Hours",
    placeholder: "Enter number of hours",
    factor: 0.1,
    icon: "🎥",
  },
  download: {
    label: "Downloads (GB)",
    placeholder: "Enter data in GB",
    factor: 0.02,
    icon: "💾",
  },
  youtube: {
    label: "YouTube Watch Hours",
    placeholder: "Enter watch time in hours",
    factor: 0.08,
    icon: "📺",
  },
};

const iconVariants = {
  hover: {
    scale: 1.3,
    rotate: [0, 10, -10, 0],
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 10,
      duration: 1,
      repeat: Infinity,
      repeatType: "reverse"
    }
  },
  tap: {
    scale: 0.9
  }
};

const cardVariants = {
  offscreen: {
    y: 50,
    opacity: 0
  },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 0.8
    }
  }
};

const textGlowVariants = {
  hidden: { 
    opacity: 0,
    textShadow: "0 0 0px rgba(74, 222, 128, 0)"
  },
  visible: {
    opacity: 1,
    textShadow: [
      "0 0 0px rgba(74, 222, 128, 0)",
      "0 0 10px rgba(74, 222, 128, 0.5)",
      "0 0 20px rgba(74, 222, 128, 0.3)",
      "0 0 10px rgba(74, 222, 128, 0.5)",
      "0 0 0px rgba(74, 222, 128, 0)"
    ],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const Home = () => {
  const { user } = useUser();
  const [emission, setEmission] = useState(0);
  const [activity, setActivity] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [carbonResult, setCarbonResult] = useState(null);
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const controls = useAnimation();
  const { scrollYProgress } = useScroll();

  const aiSuggestions = [
    {
      text: "Switch to audio-only mode during Zoom calls to reduce emissions by up to 96%.",
      icon: "🎧",
    },
    {
      text: "Unsubscribe from promotional emails - 65 billion spam emails are sent daily, wasting energy.",
      icon: "📧",
    },
    {
      text: "Stream content instead of downloading when possible - saves repeated data transfers.",
      icon: "📲",
    },
    {
      text: "Watch YouTube at 480p instead of 1080p to cut emissions by half.",
      icon: "📺",
    },
    {
      text: "Use dark mode on devices with OLED screens to reduce energy consumption by up to 60%.",
      icon: "🌙",
    },
    {
      text: "Delete old emails and cloud files - stored data consumes energy in data centers.",
      icon: "🗑️",
    },
    {
      text: "Limit video conferencing when audio is sufficient - video increases data usage 10x.",
      icon: "🎤",
    },
    {
      text: "Use WiFi instead of mobile data - it's typically 2-3 times more energy efficient.",
      icon: "📶",
    },
  ];
  const [activeTips, setActiveTips] = useState([0, 1, 2]);

  // User reviews data
  const userReviews = [
    {
      name: "Alex Johnson",
      role: "Sustainability Manager",
      avatar: "👨‍💼",
      review: "CarboVoid helped our company reduce digital emissions by 28% in just 3 months!",
      rating: 5
    },
    {
      name: "Sarah Williams",
      role: "Digital Nomad",
      avatar: "👩‍💻",
      review: "The AI suggestions are incredibly practical. I've cut my carbon footprint without changing my workflow.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "IT Director",
      avatar: "👨‍🔧",
      review: "The ESG reports saved us dozens of hours in sustainability reporting. Highly recommended!",
      rating: 4
    },
    {
      name: "Emma Rodriguez",
      role: "Environmental Activist",
      avatar: "👩‍🌾",
      review: "Finally a tool that makes digital carbon footprint tangible and actionable.",
      rating: 5
    }
  ];

  // Scroll button visibility
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

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
      email: "Consider unsubscribing from promotional emails to reduce unnecessary data storage and transfers.",
      zoom: "Switch to audio-only mode during Zoom calls to reduce video data transmission by up to 96%.",
      download: "Opt for streaming rather than downloading when you'll only view content once to avoid duplicate data transfers.",
      youtube: "Choose 480p resolution for YouTube videos - it uses about 1/4 the data of 1080p with minimal quality loss for most content.",
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

  // Animation for the website name
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      textShadow: "0 0 10px rgba(74, 222, 128, 0.7)",
      transition: {
        duration: 0.3,
        yoyo: Infinity
      }
    }
  };

  // Animation for the welcome text
  const welcomeVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200
      }
    }
  };

  const renderWelcomeText = () => {
    const text = "Welcome to CarboVoid";
    return text.split("").map((char, i) => (
      <motion.span
        key={i}
        variants={letterVariants}
        style={{ display: "inline-block" }}
        className={char === " " ? "mx-1" : ""}
      >
        {char === " " ? "\u00A0" : char}
      </motion.span>
    ));
  };

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden text-white bg-black">
      {/* Scroll progress indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-green-500 z-50"
        style={{ scaleX: scrollYProgress, transformOrigin: "0%" }}
      />

      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollButton && (
          <motion.button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 bg-green-500 p-3 rounded-full shadow-lg z-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            whileHover={{ scale: 1.1, backgroundColor: "#22c55e" }}
            whileTap={{ scale: 0.9 }}
          >
            <FiArrowUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Globe Background */}
      <div className="absolute inset-0 z-0">
        <Globe />
      </div>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center h-[75vh] px-6">
        <div className="max-w-3xl text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={welcomeVariants}
            className="text-4xl md:text-6xl font-extrabold mb-4"
          >
            <motion.div
              className="inline-block"
              variants={textGlowVariants}
              initial="hidden"
              animate="visible"
            >
              {renderWelcomeText()}
            </motion.div>
            <motion.span 
              className="text-green-400 ml-2"
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              🌱
            </motion.span>
          </motion.div>

          <SignedIn>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-gray-200 mb-4"
            >
              Hello,{" "}
              <span className="font-semibold">
                {user?.firstName || user?.username}
              </span>
              !
            </motion.p>
          </SignedIn>

          <SignedOut>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-gray-200 mb-6"
            >
              Track your digital carbon footprint and make greener choices with
              AI-powered insights.
            </motion.p>
            <div className="flex justify-center space-x-4 mb-6">
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Link
                  to="/sign-in"
                  className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition"
                >
                  Sign In
                </Link>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Link
                  to="/sign-up"
                  className="border border-green-400 text-green-400 px-6 py-2 rounded-full hover:bg-green-100 transition"
                >
                  Sign Up
                </Link>
              </motion.div>
            </div>
          </SignedOut>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-sm text-gray-300"
          >
            Empowering users to reduce hidden digital emissions — one byte at a
            time.
          </motion.div>
          
          {/* Toggle */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-4"
          >
            <CarbonModeToggle />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="mt-8 text-lg font-medium text-green-300"
          >
            Estimated Carbon Emission:{" "}
            <span className="font-bold">{emission.toFixed(4)} g CO₂</span>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-20 w-full max-w-6xl mx-auto px-6 my-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-3xl font-extrabold text-center text-white mb-10"
        >
          Our Features
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: "⚡",
              title: "Personalized Carbon Reports",
              desc: "Detailed breakdown of emissions from your digital activities.",
              link: "/dashboard",
            },
            {
              icon: "🌱",
              title: "Green Suggestions Assistant",
              desc: "AI-driven reduction tips tailored to your usage patterns.",
              link: "green-suggestions",
            },
            {
              icon: "🧼",
              title: "Digital Declutter Assistant",
              desc: "Clean up digital waste that's silently emitting CO₂.",
              link: "/declutter",
            },
            {
              icon: "📊",
              title: "ESG Report Generator",
              desc: "Professional environmental reports for businesses.",
              link: "/esg-report",
            },
          ].map(({ icon, title, desc, link }, index) => (
            <motion.div
              key={title}
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.2 }}
              variants={cardVariants}
              custom={index}
              className="flex"
            >
              <Link
                to={link}
                className="bg-white/10 text-white p-6 rounded-2xl shadow-xl hover:bg-white/20 transition-all duration-300 flex flex-col items-center flex-1 min-h-[300px]"
              >
                <motion.div
                  className="text-5xl mb-6"
                  variants={iconVariants}
                  whileHover="hover"
                  whileTap="tap"
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {icon}
                </motion.div>
                <h3 className="text-xl font-semibold mb-4 text-center">{title}</h3>
                <p className="text-center flex-grow">{desc}</p>
                <motion.div
                  className="mt-4 text-green-400"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  Learn more →
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Live Interactive Estimator */}
      <div className="relative z-20 w-full max-w-3xl mx-auto px-6 my-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-2xl font-bold text-center text-white mb-6"
        >
          Live Interactive Estimator
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white/10 p-6 rounded-xl text-white shadow-lg"
        >
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
                {activities[key].icon} {activities[key].label}
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
              <motion.button
                onClick={estimateCarbon}
                className="bg-green-500 px-6 py-2 rounded-full hover:bg-green-600 transition w-full"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Estimate
              </motion.button>
            </>
          )}

          {carbonResult && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4 text-lg text-green-300 font-medium overflow-hidden"
            >
              You generated: {carbonResult} kg CO₂
              <p className="text-sm text-gray-300 mt-2">{aiSuggestion}</p>
            </motion.div>
          )}
        </motion.div>
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

      {/* Rotating AI Cards */}
      <div className="relative z-20 w-full px-4 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {activeTips.map((index, i) => {
          const { text, icon } = aiSuggestions[index];
          return (
            <motion.div
              key={i}
              className="mx-4 bg-white/10 p-6 rounded-xl shadow-xl text-white backdrop-blur-md hover:scale-105 transition-all duration-300 min-h-[250px] flex flex-col"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 1, delay: i * 0.5 }}
              viewport={{ once: false, amount: 0.1 }}
            >
              <motion.div
                className="flex justify-center items-center text-6xl mb-4"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                whileHover={{ rotate: [0, 10, -10, 0], scale: 1.1 }}
              >
                {icon}
              </motion.div>
              <motion.p
                className="text-lg font-medium text-center flex-grow"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                {text}
              </motion.p>
            </motion.div>
          );
        })}
      </div>

      {/* User Reviews Section */}
      <div className="relative z-20 w-full max-w-6xl mx-auto px-6 my-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-3xl font-extrabold text-center text-white mb-10"
        >
          What Our Users Say
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {userReviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-green-900/30 to-black/50 p-6 rounded-xl border border-green-500/20 shadow-lg hover:shadow-green-500/20 transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <motion.div 
                  className="text-3xl mr-4"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                >
                  {review.avatar}
                </motion.div>
                <div>
                  <h3 className="font-bold text-lg">{review.name}</h3>
                  <p className="text-green-300 text-sm">{review.role}</p>
                </div>
              </div>
              <motion.p 
                className="text-gray-200 mb-4"
                whileHover={{ scale: 1.02 }}
              >
                "{review.review}"
              </motion.p>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <motion.span
                    key={i}
                    className={`text-xl ${i < review.rating ? 'text-yellow-400' : 'text-gray-500'}`}
                    whileHover={{ scale: 1.2 }}
                  >
                    ★
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;