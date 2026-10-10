import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";

const tabs = [
  { key: "", label: "🎬 Watchlist" },
  { key: "ratings", label: "⭐ My Ratings" },
  { key: "recommendations", label: "🎯 Recommendations" },
];

const UserTabsNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef(null);
  const tabsRef = useRef([]);
  const [activeTab, setActiveTab] = useState("");
  const [underlineStyle, setUnderlineStyle] = useState({ width: 0, left: 0 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const pathKey = location.pathname.split("/")[2] || "";
    setActiveTab(pathKey);
  }, [location.pathname]);

//Tab 0 (Watchlist): 33.33%

//Tab 1 (Ratings): 66.66%

//Tab 2 (Recommendations): 100%
 const updateUnderline = useCallback(() => {
  const index = tabs.findIndex((tab) => tab.key === activeTab);
  const tabWidthPercent = 95 / tabs.length;
  setUnderlineStyle({
    width: `${tabWidthPercent * (index + 1)}%`,
    left: 0,
  });
}, [activeTab]);


  useEffect(() => {
    updateUnderline();
    window.addEventListener("resize", updateUnderline);
    return () => window.removeEventListener("resize", updateUnderline);
  }, [updateUnderline]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileMenuOpen && containerRef.current && !containerRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen]);

  const handleTabClick = (key) => {
    setMobileMenuOpen(false);
    navigate(`/dashboard${key ? `/${key}` : ""}`);
  };

  const activeLabel = tabs.find((tab) => tab.key === activeTab)?.label || "Select";

  const renderDesktopTabs = () => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="hidden md:flex space-x-8 relative border-b border-white/20 pb-5"
    >
      {tabs.map((tab, index) => {
        const isActive = tab.key === activeTab;
        return (
          <motion.button
            key={tab.key}
            ref={(el) => (tabsRef.current[index] = el)}
            onClick={() => handleTabClick(tab.key)}
            whileTap={{ scale: 0.95 }}
            whileHover={{
              scale: 1.07,
              transition: { type: "spring", stiffness: 300 },
            }}
            className={`relative overflow-hidden text-xs sm:text-sm font-semibold tracking-wide transition duration-300 px-2 py-1 rounded focus:outline-none ${
              isActive
                ? "text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-fuchsia-500 to-indigo-500"
                : "text-gray-500 hover:text-indigo-400"
            }`}
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
          >
            {tab.label}
            {/* Ripple effect on hover */}
            <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-all duration-300 rounded-full pointer-events-none" />
          </motion.button>
        );
      })}
      <motion.div
        className="absolute bottom-0 h-[3px] rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-indigo-500"
        animate={underlineStyle}
        transition={{
          type: "spring",
          stiffness: 600,
          damping: 25,
        }}
        style={{
          backgroundImage:
            "linear-gradient(90deg, #ec4899, #a855f7, #6366f1)",
          backgroundSize: "200% auto",
          animation: "shimmer 1.5s linear infinite",
        }}
      />
    </motion.div>
  );

  const renderMobileDropdown = () => (
    <div className="md:hidden relative mt-4 z-30">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setMobileMenuOpen((prev) => !prev)}
        className="flex items-center justify-between w-full px-4 py-3 bg-gradient-to-r from-pink-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:brightness-110 transition focus:outline-none focus:ring-2 focus:ring-pink-300"
        aria-haspopup="listbox"
        aria-expanded={mobileMenuOpen}
      >
        <span className="text-sm sm:text-base truncate">{activeLabel}</span>
        <motion.div
  className="absolute bottom-0 h-[3px] bg-gradient-to-r from-pink-500 via-fuchsia-500 to-indigo-500 rounded-full"
  animate={underlineStyle}
  transition={{
    type: "spring",
    stiffness: 500,
    damping: 30,
  }}
  style={{
    position: "absolute",
    height: "3px",
  }}
/>

      </motion.button>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            role="listbox"
            className="absolute top-full mt-2 left-0 w-full bg-white/80 backdrop-blur-md shadow-xl rounded-xl border border-white/30 z-40 overflow-hidden"
          >
            {tabs.map((tab) => (
              <motion.button
                key={tab.key}
                onClick={() => handleTabClick(tab.key)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`w-full px-5 py-3 text-left font-medium text-sm sm:text-base border-b border-white/20 last:border-none focus:outline-none transition-all duration-200 ${
                  tab.key === activeTab
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                }`}
                role="option"
                tabIndex={0}
              >
                {tab.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <motion.nav
      ref={containerRef}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="relative w-full px-4 py-6 bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg ring-1 ring-indigo-100 mb-6 border border-white/20 z-20"
      aria-label="User dashboard navigation"
    >
      {renderDesktopTabs()}
      {renderMobileDropdown()}
    </motion.nav>
  );
};

export default UserTabsNav;
