import { useState } from 'react';
import { API_BASE } from './utils';

export default function InterviewSection() {
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const companies = ['Amazon', 'Google', 'Microsoft', 'Meta', 'Apple', 'Netflix', 'Other'];
  const roles = ['SDE', 'ML Engineer', 'Data Scientist', 'DevOps Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Other'];

  const handleGenerate = async () => {
    if (!company.trim() || !role.trim()) {
      setError('Please select both company and role');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`${API_BASE}/interview/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          company: company.trim(),
          role: role.trim(),
          num_questions: parseInt(numQuestions) || 5,
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to generate questions');
      }
      
      setResponse(data);
      setError(null);
    } catch (err) {
      setError('Failed to generate interview questions: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Parse questions_text into structured format for better display
  const parseQuestions = (questionsText) => {
    if (!questionsText) return [];
    
    // Split by numbered lines (1. 2. 3. etc.)
    const questionBlocks = questionsText.split(/(?=\d+\.\s)/).filter(block => block.trim());
    
    const questions = questionBlocks.map((block, index) => {
      const lines = block.trim().split('\n').map(l => l.trim()).filter(l => l);
      
      if (lines.length === 0) return null;
      
      // First line should be the question
      const firstLine = lines[0];
      const questionMatch = firstLine.match(/^\d+\.\s*(.+)/);
      const questionText = questionMatch ? questionMatch[1] : firstLine;
      
      return {
        number: (index + 1).toString(),
        question: questionText,
        difficulty: 'Medium', // Default since format doesn't include difficulty
        answer: '', // No separate answer in this format
      };
    }).filter(q => q !== null);

    return questions;
  };

  const questions = response ? parseQuestions(response.questions_text) : [];

  return (
    <div className="section">
      <h2>AI Interview Preparation</h2>
      <p className="section-description">
        Generate interview questions powered by Amazon Bedrock
      </p>

      <div className="card">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="company">Company</label>
            <select
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="input"
            >
              <option value="">Select company...</option>
              {companies.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {company === 'Other' && (
              <input
                type="text"
                placeholder="Enter company name"
                onChange={(e) => setCompany(e.target.value)}
                className="input"
                style={{ marginTop: '10px' }}
              />
            )}
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="input"
            >
              <option value="">Select role...</option>
              {roles.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            {role === 'Other' && (
              <input
                type="text"
                placeholder="Enter role"
                onChange={(e) => setRole(e.target.value)}
                className="input"
                style={{ marginTop: '10px' }}
              />
            )}
          </div>

          <div className="form-group">
            <label htmlFor="num-questions">Number of Questions</label>
            <input
              id="num-questions"
              type="number"
              min="1"
              max="10"
              value={numQuestions}
              onChange={(e) => setNumQuestions(e.target.value)}
              className="input"
            />
          </div>
        </div>

        <button onClick={handleGenerate} disabled={loading} className="button primary">
          {loading ? 'Generating...' : 'Generate Questions'}
        </button>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </div>

      {response && questions.length > 0 && (
        <div className="card">
          <div className="interview-header">
            <h3>Interview Questions</h3>
            <div className="interview-meta">
              <span className="badge">{response.company}</span>
              <span className="badge">{response.role}</span>
            </div>
          </div>

          <div className="questions-list">
            {questions.map((q, idx) => (
              <div key={idx} className="question-item">
                <div className="question-header">
                  <span className="question-number">Question {q.number}</span>
                  <span className={`difficulty-badge ${q.difficulty.toLowerCase()}`}>
                    {q.difficulty}
                  </span>
                </div>
                <div className="question-text">
                  {q.question}
                </div>
                {q.answer && (
                  <div className="answer-section">
                    <strong>Ideal Answer:</strong>
                    <div className="answer-text">{q.answer}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {response && questions.length === 0 && (
        <div className="card">
          <h3>Raw Response</h3>
          <pre className="raw-text">{response.questions_text}</pre>
        </div>
      )}
    </div>
  );
}
