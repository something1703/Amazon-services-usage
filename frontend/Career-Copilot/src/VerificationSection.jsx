import { useState } from 'react';
import { toBase64, API_BASE } from './utils';

export default function VerificationSection() {
  const [resumeData, setResumeData] = useState({
    name: '',
    email: '',
    education: '',
    tenth: '',
    twelfth: '',
  });
  
  const [documents, setDocuments] = useState([]);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showRawText, setShowRawText] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setResumeData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e, docType) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      // Check if document type already exists
      const existingIndex = documents.findIndex(doc => doc.type === docType);
      
      const newDoc = {
        type: docType,
        file: file,
        filename: file.name,
      };

      setDocuments(prev => {
        if (existingIndex >= 0) {
          // Replace existing document of same type
          const updated = [...prev];
          updated[existingIndex] = newDoc;
          return updated;
        } else {
          // Add new document
          return [...prev, newDoc];
        }
      });
    });
  };

  const removeDocument = (index) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const handleVerify = async () => {
    if (!resumeData.name.trim()) {
      setError('Please provide at least your name');
      return;
    }

    if (documents.length === 0) {
      setError('Please upload at least one document');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Convert all documents to base64
      const documentsWithBase64 = await Promise.all(
        documents.map(async (doc) => {
          const base64 = await toBase64(doc.file);
          return {
            type: doc.type,
            filename: doc.filename,
            base64: base64,
          };
        })
      );

      // Parse education list
      const educationList = resumeData.education
        .split(/[\n,]/)
        .map(e => e.trim())
        .filter(e => e);

      const requestBody = {
        resume: {
          name: resumeData.name.trim(),
          email: resumeData.email.trim(),
          education: educationList.length > 0 ? educationList : [],
          scores: {
            tenth: resumeData.tenth.trim(),
            twelfth: resumeData.twelfth.trim(),
          },
        },
        documents: documentsWithBase64,
      };

      const res = await fetch(`${API_BASE}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Verification failed');
      }
      
      setResponse(data);
      setError(null);
    } catch (err) {
      setError('Verification failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreLabel = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Review';
  };

  return (
    <div className="section">
      <h2>Document Verification</h2>
      <p className="section-description">
        Verify resume authenticity with Amazon Textract + Bedrock
      </p>

      <div className="card">
        <h3>Resume Information</h3>
        
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="v-name">Full Name *</label>
            <input
              id="v-name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={resumeData.name}
              onChange={handleInputChange}
              className="input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="v-email">Email</label>
            <input
              id="v-email"
              name="email"
              type="email"
              placeholder="john@example.com"
              value={resumeData.email}
              onChange={handleInputChange}
              className="input"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="v-education">Education</label>
          <textarea
            id="v-education"
            name="education"
            placeholder="B.Tech CSE, XYZ College, 8.5 CGPA&#10;XII - ABC School&#10;X - DEF School"
            value={resumeData.education}
            onChange={handleInputChange}
            className="textarea"
            rows="3"
          />
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="v-tenth">10th Score/Percentage</label>
            <input
              id="v-tenth"
              name="tenth"
              type="text"
              placeholder="92"
              value={resumeData.tenth}
              onChange={handleInputChange}
              className="input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="v-twelfth">12th Score/Percentage</label>
            <input
              id="v-twelfth"
              name="twelfth"
              type="text"
              placeholder="90"
              value={resumeData.twelfth}
              onChange={handleInputChange}
              className="input"
            />
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Upload Documents *</h3>
        <p className="help-text">Upload marksheets, certificates, or other supporting documents</p>
        
        <div className="documents-upload">
          <div className="upload-group">
            <label>10th Marksheet</label>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => handleFileChange(e, 'marksheet_10th')}
              className="file-input"
              id="doc-10th"
            />
            <label htmlFor="doc-10th" className="file-label small">
              Choose file
            </label>
          </div>

          <div className="upload-group">
            <label>12th Marksheet</label>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => handleFileChange(e, 'marksheet_12th')}
              className="file-input"
              id="doc-12th"
            />
            <label htmlFor="doc-12th" className="file-label small">
              Choose file
            </label>
          </div>

          <div className="upload-group">
            <label>Degree/Other Documents</label>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => handleFileChange(e, 'degree')}
              className="file-input"
              id="doc-degree"
            />
            <label htmlFor="doc-degree" className="file-label small">
              Choose file
            </label>
          </div>
        </div>

        {documents.length > 0 && (
          <div className="documents-list">
            <h4>Uploaded Documents ({documents.length})</h4>
            {documents.map((doc, idx) => (
              <div key={idx} className="document-item">
                <div className="document-info">
                  <span className="document-type">{doc.type.replace(/_/g, ' ')}</span>
                  <span className="document-name">{doc.filename}</span>
                </div>
                <button
                  onClick={() => removeDocument(idx)}
                  className="button-icon"
                  title="Remove"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <button onClick={handleVerify} disabled={loading} className="button primary large">
          {loading ? 'Verifying Documents...' : 'Verify Documents'}
        </button>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </div>

      {response && (
        <>
          <div className="card verification-result">
            <h3>Verification Results</h3>
            
            <div className="credibility-score">
              <div className="score-circle" style={{ borderColor: getScoreColor(response.score) }}>
                <div className="score-value" style={{ color: getScoreColor(response.score) }}>
                  {response.score}
                </div>
                <div className="score-label">Credibility Score</div>
              </div>
              <div className="score-status" style={{ color: getScoreColor(response.score) }}>
                {getScoreLabel(response.score)}
              </div>
            </div>

            {response.issues && response.issues.length > 0 && (
              <div className="issues-section">
                <h4>Issues Found ({response.issues.length})</h4>
                <ul className="issues-list">
                  {response.issues.map((issue, idx) => (
                    <li key={idx} className="issue-item">
                      <div className="issue-header">
                        <span className="issue-field">{issue.field.replace(/_/g, ' ')}</span>
                        <span className={`issue-status status-${issue.status}`}>
                          {issue.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div className="issue-detail">{issue.detail}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {response.report && (
              <div className="report-section">
                <h4>AI Analysis Report</h4>
                <div className="report-content">
                  {response.report}
                </div>
              </div>
            )}

            {response.raw_text_preview && (
              <div className="raw-text-section">
                <button
                  onClick={() => setShowRawText(!showRawText)}
                  className="button secondary small"
                >
                  {showRawText ? '▼ Hide' : '▶ Show'} Extracted Text Preview
                </button>
                
                {showRawText && (
                  <pre className="raw-text">
                    {response.raw_text_preview}
                  </pre>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
