import { motion } from "framer-motion";
import { BarChart, Leaf, Trash2, Building2 } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function Features() {
  const features = [
    {
      title: "Personalized Carbon Reports",
      description: "Track and visualize your personal digital carbon footprint with AI-powered analytics.",
      icon: <BarChart className="w-8 h-8 transition-colors duration-300 group-hover:text-green-300" />,
      link: "/dashboard",
    },
    {
      title: "Green Suggestions Assistant",
      description: "Get eco-friendly recommendations to reduce emissions from emails, storage, streaming, and more.",
      icon: <Leaf className="w-8 h-8 transition-colors duration-300 group-hover:text-emerald-300" />,
      link: "/green-suggestions",
    },
    {
      title: "Digital Declutter Assistant",
      description: "Automatically identify and clean up unused files, subscriptions, or cloud storage to save energy.",
      icon: <Trash2 className="w-8 h-8 transition-colors duration-300 group-hover:text-yellow-200" />,
      link: "/declutter",
    },
    {
      title: "ESG Reporting for Businesses",
      description: "Smart ESG tools to monitor, reduce, and report on digital carbon usage organization-wide.",
      icon: <Building2 className="w-8 h-8 transition-colors duration-300 group-hover:text-blue-300" />,
    },
  ];

  useEffect(() => {
    const numSparkles = 30;
    const sparkleContainer = document.querySelector(".sparkle-container");

    for (let i = 0; i < numSparkles; i++) {
      const sparkle = document.createElement("div");
      sparkle.classList.add("sparkle");
      sparkle.style.left = `${Math.random() * 100}vw`;
      sparkle.style.top = `${Math.random() * 100}vh`;
      sparkle.style.width = `${Math.random() * 10 + 5}px`;
      sparkle.style.height = sparkle.style.width;
      sparkleContainer.appendChild(sparkle);
    }
  }, []);

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] py-20 px-6 text-white relative">
      {/* Sparkle Container */}
      <div className="sparkle-container"></div>

      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          className="text-4xl font-bold mb-4"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Core Features
        </motion.h2>

        <motion.p
          className="text-gray-300 mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Powerful tools to track, reduce, and report your digital carbon footprint.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const CardContent = (
              <motion.div
                className="group rounded-3xl border border-white/20 backdrop-blur-lg bg-white/10 p-8 shadow-xl transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-2xl hover:border-white/30"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <motion.div
                  className="flex items-center justify-center mb-4"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  whileHover={{ rotate: 5, scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  {feature.icon}
                </motion.div>

                <h3 className="text-2xl font-semibold mb-2 group-hover:text-white transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-300 text-sm group-hover:text-gray-100 transition-colors duration-300">
                  {feature.description}
                </p>
              </motion.div>
            );

            return feature.link ? (
              <Link to={feature.link} key={index}>
                {CardContent}
              </Link>
            ) : (
              <div key={index}>{CardContent}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
