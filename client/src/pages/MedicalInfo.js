import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Search, FileText, AlertCircle, Info } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';
import './MedicalInfo.css';

const MedicalInfo = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [medicalInfo, setMedicalInfo] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);

  const commonConditions = [
    { name: 'Common Cold', category: 'Respiratory' },
    { name: 'Flu (Influenza)', category: 'Respiratory' },
    { name: 'Hypertension', category: 'Cardiovascular' },
    { name: 'Diabetes Type 2', category: 'Endocrine' },
    { name: 'Migraine', category: 'Neurological' },
    { name: 'Asthma', category: 'Respiratory' },
    { name: 'Depression', category: 'Mental Health' },
    { name: 'Anxiety', category: 'Mental Health' },
    { name: 'Arthritis', category: 'Musculoskeletal' },
    { name: 'Allergies', category: 'Immune System' },
    { name: 'Gastroesophageal Reflux Disease (GERD)', category: 'Digestive' },
    { name: 'Insomnia', category: 'Sleep Disorders' }
  ];

  const handleSearch = async (condition = searchTerm) => {
    if (!condition.trim()) {
      toast.error('Please enter a medical condition to search');
      return;
    }

    setLoading(true);
    setMedicalInfo(null);

    try {
      const response = await apiService.getMedicalInfo(condition.trim());
      setMedicalInfo(response);
      
      // Add to search history if not already present
      if (!searchHistory.includes(condition.trim())) {
        setSearchHistory(prev => [condition.trim(), ...prev.slice(0, 4)]);
      }
      
      toast.success('Medical information retrieved successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to retrieve medical information');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  const handleConditionClick = (condition) => {
    setSearchTerm(condition);
    handleSearch(condition);
  };

  const formatMedicalInfo = (info) => {
    // Process the raw markdown content from the API
    // Clean up any extra spacing and ensure proper markdown formatting
    return info
      .replace(/\n\s*\n\s*\n/g, '\n\n') // Remove excessive line breaks
      .replace(/^\s+|\s+$/g, '') // Trim whitespace
      .replace(/^(\d+\.\s)/gm, '\n$1') // Ensure numbered lists have proper spacing
      .replace(/^(\*\s)/gm, '\n$1') // Ensure bullet lists have proper spacing
      .replace(/^(#{1,6}\s)/gm, '\n$1') // Ensure headers have proper spacing
      .trim();
  };

  return (
    <div className="medical-info">
      <div className="container">
        <motion.div 
          className="page-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="page-title">
            <BookOpen className="title-icon" />
            Medical Information
          </h1>
          <p className="page-description">
            Search for comprehensive information about medical conditions, treatments, and health topics
          </p>
        </motion.div>

        <motion.div 
          className="search-section card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="search-form">
            <div className="search-input-container">
              <Search className="search-icon" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter a medical condition (e.g., diabetes, hypertension, migraine...)"
                className="search-input"
              />
              <button 
                type="submit" 
                className="search-button"
                disabled={loading}
              >
                {loading ? (
                  <div className="loading-spinner" />
                ) : (
                  'Search'
                )}
              </button>
            </div>
          </form>

          {searchHistory.length > 0 && (
            <div className="search-history">
              <h4>Recent Searches:</h4>
              <div className="history-tags">
                {searchHistory.map((term, index) => (
                  <button
                    key={index}
                    className="history-tag"
                    onClick={() => handleConditionClick(term)}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        <div className="content-grid">
          <motion.div 
            className="common-conditions card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="section-title">
              <FileText className="section-icon" />
              Common Conditions
            </h3>
            <p className="section-description">
              Click on any condition to get detailed information
            </p>
            
            <div className="conditions-grid">
              {commonConditions.map((condition, index) => (
                <motion.button
                  key={index}
                  className="condition-card"
                  onClick={() => handleConditionClick(condition.name)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <h4>{condition.name}</h4>
                  <span className="condition-category">{condition.category}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          <motion.div 
            className="info-display"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {loading && (
              <div className="loading-card card">
                <div className="loading-content">
                  <div className="loading-spinner large" />
                  <h3>Retrieving Medical Information</h3>
                  <p>Please wait while we gather comprehensive information...</p>
                </div>
              </div>
            )}

            {medicalInfo && !loading && (
              <motion.div 
                className="medical-info-card card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="info-header">
                  <h2>{medicalInfo.condition}</h2>
                  <div className="info-badge">
                    <Info size={16} />
                    Medical Information
                  </div>
                </div>

                <div className="info-content">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      // Custom components for better styling
                      p: ({children}) => <p style={{margin: '1em 0', lineHeight: '1.6', fontSize: '1rem'}}>{children}</p>,
                      ul: ({children}) => <ul style={{margin: '1em 0', paddingLeft: '1.5em'}}>{children}</ul>,
                      ol: ({children}) => <ol style={{margin: '1em 0', paddingLeft: '1.5em'}}>{children}</ol>,
                      li: ({children}) => <li style={{margin: '0.5em 0', lineHeight: '1.5'}}>{children}</li>,
                      strong: ({children}) => <strong style={{fontWeight: '600', color: '#2563eb'}}>{children}</strong>,
                      em: ({children}) => <em style={{fontStyle: 'italic', color: '#7c3aed'}}>{children}</em>,
                      code: ({children}) => <code style={{
                        backgroundColor: '#f1f5f9', 
                        padding: '0.2em 0.4em', 
                        borderRadius: '4px', 
                        fontSize: '0.9em',
                        color: '#dc2626',
                        fontFamily: 'monospace'
                      }}>{children}</code>,
                      pre: ({children}) => <pre style={{
                        backgroundColor: '#f8fafc',
                        padding: '1.2em',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        overflow: 'auto',
                        fontSize: '0.9em',
                        fontFamily: 'monospace'
                      }}>{children}</pre>,
                      blockquote: ({children}) => <blockquote style={{
                        borderLeft: '4px solid #3b82f6',
                        paddingLeft: '1.2em',
                        margin: '1em 0',
                        fontStyle: 'italic',
                        backgroundColor: '#f8fafc',
                        padding: '0.8em 1.2em',
                        borderRadius: '0 8px 8px 0'
                      }}>{children}</blockquote>,
                      h1: ({children}) => <h1 style={{
                        fontSize: '1.875rem', 
                        fontWeight: '700', 
                        margin: '1.5em 0 1em 0', 
                        color: '#1e293b',
                        borderBottom: '2px solid #e2e8f0',
                        paddingBottom: '0.5em'
                      }}>{children}</h1>,
                      h2: ({children}) => <h2 style={{
                        fontSize: '1.5rem', 
                        fontWeight: '600', 
                        margin: '1.25em 0 0.75em 0', 
                        color: '#1e293b',
                        borderBottom: '1px solid #e2e8f0',
                        paddingBottom: '0.3em'
                      }}>{children}</h2>,
                      h3: ({children}) => <h3 style={{
                        fontSize: '1.25rem', 
                        fontWeight: '600', 
                        margin: '1em 0 0.5em 0', 
                        color: '#374151'
                      }}>{children}</h3>,
                      h4: ({children}) => <h4 style={{
                        fontSize: '1.125rem', 
                        fontWeight: '600', 
                        margin: '0.875em 0 0.5em 0', 
                        color: '#374151'
                      }}>{children}</h4>,
                      table: ({children}) => <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        margin: '1em 0',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        overflow: 'hidden'
                      }}>{children}</table>,
                      th: ({children}) => <th style={{
                        border: '1px solid #e2e8f0',
                        padding: '0.75em',
                        backgroundColor: '#f8fafc',
                        fontWeight: '600',
                        textAlign: 'left',
                        color: '#374151'
                      }}>{children}</th>,
                      td: ({children}) => <td style={{
                        border: '1px solid #e2e8f0',
                        padding: '0.75em',
                        verticalAlign: 'top'
                      }}>{children}</td>,
                      hr: () => <hr style={{
                        margin: '2em 0',
                        border: 'none',
                        borderTop: '2px solid #e2e8f0'
                      }} />
                    }}
                  >
                    {formatMedicalInfo(medicalInfo.information)}
                  </ReactMarkdown>
                </div>

                <div className="disclaimer">
                  <AlertCircle className="disclaimer-icon" />
                  <p>
                    This information is for educational purposes only and should not replace 
                    professional medical advice. Always consult with healthcare providers 
                    for accurate diagnosis and treatment.
                  </p>
                </div>
              </motion.div>
            )}

            {!medicalInfo && !loading && (
              <div className="placeholder-card card">
                <div className="placeholder-content">
                  <BookOpen className="placeholder-icon" />
                  <h3>Search for Medical Information</h3>
                  <p>
                    Enter a medical condition in the search box above or click on 
                    one of the common conditions to get started.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MedicalInfo;
