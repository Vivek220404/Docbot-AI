import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Stethoscope, 
  Search, 
  MessageCircle, 
  BookOpen, 
  Shield, 
  Clock, 
  Users,
  ArrowRight,
  Star,
  Heart
} from 'lucide-react';
import './Home.css';

const Home = () => {
  const features = [
    {
      icon: Search,
      title: 'Symptom Analysis',
      description: 'Get instant AI-powered analysis of your symptoms with personalized health insights.',
      link: '/symptoms',
      color: '#667eea'
    },
    {
      icon: MessageCircle,
      title: 'AI Chat Assistant',
      description: 'Chat with our intelligent medical assistant for health questions and guidance.',
      link: '/chat',
      color: '#764ba2'
    },
    {
      icon: BookOpen,
      title: 'Medical Information',
      description: 'Access comprehensive information about medical conditions and treatments.',
      link: '/medical-info',
      color: '#f093fb'
    }
  ];

  const stats = [
    { icon: Users, number: '10K+', label: 'Users Helped' },
    { icon: Clock, number: '24/7', label: 'Available' },
    { icon: Shield, number: '100%', label: 'Secure' },
    { icon: Star, number: '4.9', label: 'Rating' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <motion.section 
        className="hero"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="container">
          <div className="hero-content">
            <motion.div className="hero-text" variants={itemVariants}>
              <h1 className="hero-title">
                Your AI-Powered 
                <span className="gradient-text"> Medical Assistant</span>
              </h1>
              <p className="hero-description">
                Get instant, intelligent health insights with DocBot AI. Analyze symptoms, 
                chat with our AI assistant, and access comprehensive medical information - 
                all in one secure platform.
              </p>
              <div className="hero-buttons">
                <Link to="/symptoms" className="btn-primary">
                  <Search size={20} />
                  Analyze Symptoms
                </Link>
                <Link to="/chat" className="btn-secondary">
                  <MessageCircle size={20} />
                  Start Chat
                </Link>
              </div>
            </motion.div>
            
            <motion.div className="hero-visual" variants={itemVariants}>
              <div className="hero-card glass-effect">
                <div className="card-header">
                  <Stethoscope className="card-icon" />
                  <div>
                    <h3>Health Analysis</h3>
                    <p>AI-Powered Insights</p>
                  </div>
                </div>
                <div className="card-content">
                  <div className="pulse-indicator">
                    <Heart className="heart-icon" />
                    <div className="pulse-line">
                      <div className="pulse-wave"></div>
                    </div>
                  </div>
                  <p>Analyzing your health data...</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        className="features"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="container">
          <motion.div className="section-header" variants={itemVariants}>
            <h2 className="section-title">Powerful Features</h2>
            <p className="section-description">
              Discover how DocBot AI can help you take control of your health
            </p>
          </motion.div>
          
          <div className="features-grid">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  className="feature-card card"
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.05,
                    transition: { duration: 0.2 }
                  }}
                >
                  <div className="feature-icon" style={{ color: feature.color }}>
                    <Icon size={48} />
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                  <Link to={feature.link} className="feature-link">
                    Get Started
                    <ArrowRight size={16} />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        className="stats"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  className="stat-item"
                  variants={itemVariants}
                  whileHover={{ scale: 1.1 }}
                >
                  <Icon className="stat-icon" />
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="cta"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="container">
          <motion.div className="cta-content" variants={itemVariants}>
            <h2 className="cta-title">Ready to Get Started?</h2>
            <p className="cta-description">
              Join thousands of users who trust DocBot AI for their health insights
            </p>
            <div className="cta-buttons">
              <Link to="/symptoms" className="btn-primary">
                <Search size={20} />
                Start Analysis
              </Link>
              <Link to="/about" className="btn-secondary">
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
