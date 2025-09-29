import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Stethoscope, 
  Menu, 
  X, 
  Home, 
  Search, 
  MessageCircle, 
  BookOpen, 
  Info 
} from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/symptoms', label: 'Symptom Analyzer', icon: Search },
    { path: '/chat', label: 'AI Chat', icon: MessageCircle },
    { path: '/medical-info', label: 'Medical Info', icon: BookOpen },
    { path: '/about', label: 'About', icon: Info },
  ];

  return (
    <motion.nav 
      className={`navbar ${scrolled ? 'scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <motion.div 
            className="brand-content"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Stethoscope className="brand-icon" />
            <span className="brand-text">DocBot AI</span>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-menu desktop-menu">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${isActive ? 'active' : ''}`}
              >
                <motion.div 
                  className="nav-link-content"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-button"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isOpen ? <X /> : <Menu />}
          </motion.div>
        </button>
      </div>

      {/* Mobile Navigation */}
      <motion.div 
        className={`mobile-menu ${isOpen ? 'open' : ''}`}
        initial={{ opacity: 0, height: 0 }}
        animate={{ 
          opacity: isOpen ? 1 : 0, 
          height: isOpen ? 'auto' : 0 
        }}
        transition={{ duration: 0.3 }}
      >
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <motion.div
              key={item.path}
              initial={{ x: -50, opacity: 0 }}
              animate={{ 
                x: isOpen ? 0 : -50, 
                opacity: isOpen ? 1 : 0 
              }}
              transition={{ 
                duration: 0.3, 
                delay: isOpen ? index * 0.1 : 0 
              }}
            >
              <Link
                to={item.path}
                className={`mobile-nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.nav>
  );
};

export default Navbar;
