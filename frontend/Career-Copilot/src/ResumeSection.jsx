import { useState } from 'react';
import { API_BASE } from './utils';

export default function ResumeSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    summary: '',
    education: '',
    skills: '',
    projects: '',
    experience: '',
  });
  
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenerate = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Please provide at least name and email');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Parse comma-separated or line-separated lists
      const educationList = formData.education
        .split(/[\n,]/)
        .map(e => e.trim())
        .filter(e => e);
        
      const skillsList = formData.skills
        .split(/[\n,]/)
        .map(s => s.trim())
        .filter(s => s);
        
      const projectsList = formData.projects
        .split(/[\n,]/)
        .map(p => p.trim())
        .filter(p => p);
        
      const experienceList = formData.experience
        .split(/[\n,]/)
        .map(e => e.trim())
        .filter(e => e);

      const requestBody = {
        user: {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          summary: formData.summary.trim() || 'Enthusiastic professional seeking opportunities',
          education: educationList.length > 0 ? educationList : ['Bachelor of Technology'],
          skills: skillsList.length > 0 ? skillsList : ['Python', 'JavaScript'],
          projects: projectsList.length > 0 ? projectsList : ['Personal projects'],
          experience: experienceList,
        },
      };

      const res = await fetch(`${API_BASE}/resume/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to generate resume');
      }
      
      setResponse(data);
      setError(null);
    } catch (err) {
      setError('Failed to generate resume: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewResume = () => {
    if (response?.url) {
      window.open(response.url, '_blank');
    }
  };

  const handleDownloadPDF = async () => {
    if (!response?.url) return;
    
    try {
      setLoading(true);
      
      // Fetch the HTML content from the presigned URL
      const htmlResponse = await fetch(response.url);
      const htmlContent = await htmlResponse.text();
      
      // Create a temporary iframe to render the HTML
      const iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.width = '210mm';
      iframe.style.height = '297mm';
      iframe.style.left = '-9999px';
      document.body.appendChild(iframe);
      
      // Write HTML content to iframe
      iframe.contentDocument.open();
      iframe.contentDocument.write(htmlContent);
      iframe.contentDocument.close();
      
      // Wait for content to load
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Trigger print dialog (user can save as PDF)
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
      
    } catch (err) {
      setError('Failed to download PDF: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section">
      <h2>AI Resume Builder</h2>
      <p className="section-description">
        Generate professional resumes with Amazon Bedrock
      </p>

      <div className="card">
        <h3>Personal Information</h3>
        
        <div className="form-group">
          <label htmlFor="name">Full Name *</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleInputChange}
            className="input"
          />
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleInputChange}
              className="input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="1234567890"
              value={formData.phone}
              onChange={handleInputChange}
              className="input"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="summary">Professional Summary</label>
          <textarea
            id="summary"
            name="summary"
            placeholder="Brief description about yourself, your goals, and what you're looking for..."
            value={formData.summary}
            onChange={handleInputChange}
            className="textarea"
            rows="3"
          />
        </div>
      </div>

      <div className="card">
        <h3>Education</h3>
        <p className="help-text">Enter one per line or separate with commas</p>
        
        <div className="form-group">
          <textarea
            name="education"
            placeholder="B.Tech CSE, XYZ College, 8.5 CGPA&#10;XII - ABC School, 92%&#10;X - DEF School, 95%"
            value={formData.education}
            onChange={handleInputChange}
            className="textarea"
            rows="4"
          />
        </div>
      </div>

      <div className="card">
        <h3>Skills</h3>
        <p className="help-text">Enter skills separated by commas or one per line</p>
        
        <div className="form-group">
          <textarea
            name="skills"
            placeholder="Python, AWS, React, SQL, Machine Learning, Docker"
            value={formData.skills}
            onChange={handleInputChange}
            className="textarea"
            rows="3"
          />
        </div>
      </div>

      <div className="card">
        <h3>Projects</h3>
        <p className="help-text">Enter projects separated by commas or one per line</p>
        
        <div className="form-group">
          <textarea
            name="projects"
            placeholder="Career Copilot - AI placement assistant using AWS&#10;E-commerce website using MERN stack&#10;ML model for sentiment analysis"
            value={formData.projects}
            onChange={handleInputChange}
            className="textarea"
            rows="4"
          />
        </div>
      </div>

      <div className="card">
        <h3>Experience (Optional)</h3>
        <p className="help-text">Enter work experience separated by commas or one per line</p>
        
        <div className="form-group">
          <textarea
            name="experience"
            placeholder="Software Intern at XYZ Company (Summer 2024)&#10;Open source contributor to ABC project"
            value={formData.experience}
            onChange={handleInputChange}
            className="textarea"
            rows="3"
          />
        </div>
      </div>

      <div className="card">
        <button onClick={handleGenerate} disabled={loading} className="button primary large">
          {loading ? 'Generating Resume...' : 'Generate Resume'}
        </button>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </div>

      {response && (
        <div className="card success-card">
          <h3>✓ Resume Generated Successfully!</h3>
          
          <div className="resume-info">
            <div className="info-row">
              <span className="info-label">Resume ID:</span>
              <code className="info-value">{response.resume_id}</code>
            </div>
            <div className="info-row">
              <span className="info-label">S3 Key:</span>
              <code className="info-value">{response.s3_key}</code>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button onClick={handleViewResume} className="button secondary" style={{ flex: 1 }}>
              View Resume
            </button>
            <button onClick={handleDownloadPDF} disabled={loading} className="button primary" style={{ flex: 1 }}>
              {loading ? 'Preparing...' : 'Download as PDF'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
