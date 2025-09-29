import React from 'react';
import { motion } from 'framer-motion';
import { 
  Info, 
  Shield, 
  Brain, 
  Users, 
  Heart, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  Star,
  Award
} from 'lucide-react';
import './About.css';

const About = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Advanced machine learning algorithms provide intelligent health insights and symptom analysis.'
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      description: 'Your health data is protected with enterprise-grade security and privacy measures.'
    },
    {
      icon: Clock,
      title: '24/7 Availability',
      description: 'Access medical information and AI assistance anytime, anywhere you need it.'
    },
    {
      icon: Users,
      title: 'Expert-Backed',
      description: 'Our AI models are trained on medical literature and validated by healthcare professionals.'
    }
  ];

  const capabilities = [
    'Symptom analysis and health insights',
    'Interactive medical chat assistance',
    'Comprehensive medical information database',
    'Personalized health recommendations',
    'Emergency situation recognition',
    'Treatment suggestion guidance'
  ];

  const limitations = [
    'Not a replacement for professional medical diagnosis',
    'Cannot prescribe medications',
    'Should not be used for medical emergencies',
    'May not cover all rare medical conditions',
    'Requires human medical validation for serious conditions'
  ];

  const stats = [
    { icon: Users, number: '10,000+', label: 'Users Served' },
    { icon: Heart, number: '50,000+', label: 'Symptoms Analyzed' },
    { icon: Star, number: '4.9/5', label: 'User Rating' },
    { icon: Award, number: '99.9%', label: 'Uptime' }
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
    <div className="about">
      <div className="container">
        <motion.div 
          className="page-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="page-title">
            <Info className="title-icon" />
            About DocBot AI
          </h1>
          <p className="page-description">
            Your trusted AI-powered medical assistant, providing intelligent health insights 
            and comprehensive medical information to help you make informed health decisions.
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.section 
          className="mission-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <div className="section-grid">
            <motion.div className="mission-content" variants={itemVariants}>
              <h2 className="section-title">Our Mission</h2>
              <p className="mission-text">
                DocBot AI is dedicated to democratizing access to medical information and 
                health insights through advanced artificial intelligence. We believe that 
                everyone should have access to reliable, instant medical guidance that can 
                help them understand their health better and make informed decisions about 
                their care.
              </p>
              <p className="mission-text">
                Our platform combines cutting-edge AI technology with evidence-based medical 
                knowledge to provide users with personalized health insights, symptom analysis, 
                and comprehensive medical information - all while maintaining the highest 
                standards of privacy and security.
              </p>
            </motion.div>
            
            <motion.div className="mission-visual" variants={itemVariants}>
              <div className="visual-card glass-effect">
                <Heart className="visual-icon" />
                <h3>Empowering Health Decisions</h3>
                <p>Making medical knowledge accessible to everyone</p>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section 
          className="features-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.h2 className="section-title center" variants={itemVariants}>
            Key Features
          </motion.h2>
          
          <div className="features-grid">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  className="feature-card card"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                >
                  <Icon className="feature-icon" />
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Stats Section */}
        <motion.section 
          className="stats-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <div className="stats-grid">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  className="stat-card"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                >
                  <Icon className="stat-icon" />
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Capabilities & Limitations */}
        <motion.section 
          className="capabilities-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <div className="capabilities-grid">
            <motion.div className="capabilities-card card" variants={itemVariants}>
              <h3 className="card-title">
                <CheckCircle className="card-icon success" />
                What DocBot AI Can Do
              </h3>
              <ul className="capabilities-list">
                {capabilities.map((capability, index) => (
                  <li key={index} className="capability-item">
                    <CheckCircle className="item-icon" />
                    {capability}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div className="limitations-card card" variants={itemVariants}>
              <h3 className="card-title">
                <AlertTriangle className="card-icon warning" />
                Important Limitations
              </h3>
              <ul className="limitations-list">
                {limitations.map((limitation, index) => (
                  <li key={index} className="limitation-item">
                    <AlertTriangle className="item-icon" />
                    {limitation}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.section>

        {/* Disclaimer Section */}
        <motion.section 
          className="disclaimer-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div className="disclaimer-card card" variants={itemVariants}>
            <div className="disclaimer-header">
              <Shield className="disclaimer-icon" />
              <h3>Medical Disclaimer</h3>
            </div>
            <div className="disclaimer-content">
              <p>
                <strong>DocBot AI is not a substitute for professional medical advice, diagnosis, or treatment.</strong> 
                Always seek the advice of your physician or other qualified health provider with any questions 
                you may have regarding a medical condition.
              </p>
              <p>
                Never disregard professional medical advice or delay in seeking it because of something you 
                have read or received through DocBot AI. If you think you may have a medical emergency, 
                call your doctor or emergency services immediately.
              </p>
              <p>
                The information provided by DocBot AI is for educational and informational purposes only 
                and should not be used as a substitute for professional medical care.
              </p>
            </div>
          </motion.div>
        </motion.section>

        {/* Technology Section */}
        <motion.section 
          className="technology-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div className="technology-content" variants={itemVariants}>
            <h2 className="section-title center">Powered by Advanced AI</h2>
            <p className="technology-description">
              DocBot AI leverages state-of-the-art machine learning models and natural language 
              processing to understand and analyze health-related queries. Our system is built 
              on a foundation of medical literature, clinical guidelines, and expert knowledge 
              to provide accurate and relevant health information.
            </p>
            <div className="tech-features">
              <div className="tech-feature">
                <Brain className="tech-icon" />
                <span>Advanced NLP Models</span>
              </div>
              <div className="tech-feature">
                <Shield className="tech-icon" />
                <span>HIPAA-Compliant Security</span>
              </div>
              <div className="tech-feature">
                <Clock className="tech-icon" />
                <span>Real-time Processing</span>
              </div>
            </div>
          </motion.div>
        </motion.section>
      </div>
    </div>
  );
};

export default About;
