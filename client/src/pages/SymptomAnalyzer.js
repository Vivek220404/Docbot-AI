import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, User, Calendar, FileText, AlertTriangle, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';
import './SymptomAnalyzer.css';

const SymptomAnalyzer = () => {
  const [formData, setFormData] = useState({
    symptoms: '',
    age: '',
    gender: '',
    medical_history: ''
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.symptoms.trim()) {
      toast.error('Please describe your symptoms');
      return;
    }

    setLoading(true);
    setResults(null);

    try {
      const analysisData = {
        symptoms: formData.symptoms,
        ...(formData.age && { age: parseInt(formData.age) }),
        ...(formData.gender && { gender: formData.gender }),
        ...(formData.medical_history && { medical_history: formData.medical_history })
      };

      const response = await apiService.analyzeSymptoms(analysisData);
      setResults(response);
      toast.success('Analysis completed successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to analyze symptoms');
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'emergency': return '#ef4444';
      case 'high': return '#f97316';
      case 'moderate': return '#eab308';
      case 'low': return '#22c55e';
      default: return '#6b7280';
    }
  };

  const getProbabilityColor = (probability) => {
    switch (probability.toLowerCase()) {
      case 'high': return '#ef4444';
      case 'moderate': return '#f97316';
      case 'low': return '#22c55e';
      default: return '#6b7280';
    }
  };

  return (
    <div className="symptom-analyzer">
      <div className="container">
        <motion.div 
          className="page-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="page-title">
            <Search className="title-icon" />
            Symptom Analyzer
          </h1>
          <p className="page-description">
            Describe your symptoms and get AI-powered analysis with personalized health insights
          </p>
        </motion.div>

        <div className="analyzer-content">
          {/* Symptom Form */}
          <motion.div 
            className="analyzer-form card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="form-title">Tell us about your symptoms</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">
                  <FileText size={18} />
                  Describe your symptoms *
                </label>
                <textarea
                  name="symptoms"
                  value={formData.symptoms}
                  onChange={handleInputChange}
                  className="form-textarea"
                  placeholder="Please describe your symptoms in detail, including when they started, how severe they are, and any patterns you've noticed..."
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    <Calendar size={18} />
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter your age"
                    min="1"
                    max="120"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <User size={18} />
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FileText size={18} />
                  Medical History (Optional)
                </label>
                <textarea
                  name="medical_history"
                  value={formData.medical_history}
                  onChange={handleInputChange}
                  className="form-textarea"
                  placeholder="Any relevant medical history, current medications, allergies, or previous conditions..."
                  style={{ minHeight: '80px' }}
                />
              </div>

              <button 
                type="submit" 
                className="btn-primary analyze-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="loading-spinner" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search size={20} />
                    Analyze Symptoms
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Results */}
          {results && (
            <motion.div 
              className="analysis-results"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Analysis Summary */}
              <div className="result-card card">
                <div className="result-header">
                  <CheckCircle className="result-icon" />
                  <h3>Analysis Summary</h3>
                  <div 
                    className="urgency-badge"
                    style={{ backgroundColor: getUrgencyColor(results.urgency_level) }}
                  >
                    {results.urgency_level.toUpperCase()}
                  </div>
                </div>
                <p className="result-summary">{results.analysis_summary}</p>
              </div>

              {/* Possible Conditions */}
              {results.possible_conditions && results.possible_conditions.length > 0 && (
                <div className="result-card card">
                  <h3 className="result-title">
                    <AlertTriangle className="result-icon" />
                    Possible Conditions
                  </h3>
                  <div className="conditions-list">
                    {results.possible_conditions.map((condition, index) => (
                      <div key={index} className="condition-item">
                        <div className="condition-header">
                          <h4 className="condition-name">{condition.name}</h4>
                          <span 
                            className="probability-badge"
                            style={{ backgroundColor: getProbabilityColor(condition.probability) }}
                          >
                            {condition.probability} probability
                          </span>
                        </div>
                        <p className="condition-description">{condition.description}</p>
                        {condition.common_symptoms && condition.common_symptoms.length > 0 && (
                          <div className="common-symptoms">
                            <strong>Common symptoms:</strong>
                            <div className="symptoms-tags">
                              {condition.common_symptoms.map((symptom, idx) => (
                                <span key={idx} className="symptom-tag">{symptom}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Treatment Recommendations */}
              {results.treatment_recommendations && results.treatment_recommendations.length > 0 && (
                <div className="result-card card">
                  <h3 className="result-title">
                    <ArrowRight className="result-icon" />
                    Treatment Recommendations
                  </h3>
                  <div className="recommendations-list">
                    {results.treatment_recommendations.map((recommendation, index) => (
                      <div key={index} className="recommendation-item">
                        <div className="recommendation-header">
                          <span className="recommendation-type">{recommendation.type}</span>
                          <div 
                            className="urgency-indicator"
                            style={{ backgroundColor: getUrgencyColor(recommendation.urgency) }}
                          >
                            <Clock size={14} />
                            {recommendation.urgency}
                          </div>
                        </div>
                        <p className="recommendation-description">{recommendation.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Follow-up Questions */}
              {results.follow_up_questions && results.follow_up_questions.length > 0 && (
                <div className="result-card card">
                  <h3 className="result-title">Follow-up Questions</h3>
                  <ul className="followup-list">
                    {results.follow_up_questions.map((question, index) => (
                      <li key={index} className="followup-item">{question}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Disclaimer */}
              {results.disclaimer && (
                <div className="disclaimer-card card">
                  <AlertTriangle className="disclaimer-icon" />
                  <p className="disclaimer-text">{results.disclaimer}</p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SymptomAnalyzer;
