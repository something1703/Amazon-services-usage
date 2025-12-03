import { useState } from 'react';
import AuthSection from './AuthSection';
import InterviewSection from './InterviewSection';
import ResumeSection from './ResumeSection';
import VerificationSection from './VerificationSection';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('auth');
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  const handleLoginSuccess = (userId, token) => {
    setLoggedInUser(userId);
    setAuthToken(token);
    // Automatically switch to interview tab after successful login
    setActiveTab('interview');
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setAuthToken(null);
    setActiveTab('auth');
  };

  const tabs = [
    { id: 'auth', label: 'Login', icon: '' },
    { id: 'interview', label: 'Interview Prep', icon: '', requiresAuth: true },
    { id: 'resume', label: 'Resume Builder', icon: '', requiresAuth: true },
    { id: 'verification', label: 'Verification', icon: '', requiresAuth: true },
  ];

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <h1>Career Copilot</h1>
            <p>GenAI Placement Assistant</p>
          </div>
          {loggedInUser && (
            <div className="user-info">
              <span className="user-badge">
                {loggedInUser}
              </span>
              <button onClick={handleLogout} className="button secondary small">
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <nav className="nav-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`nav-tab ${activeTab === tab.id ? 'active' : ''} ${
              tab.requiresAuth && !loggedInUser ? 'disabled' : ''
            }`}
            disabled={tab.requiresAuth && !loggedInUser}
            title={tab.requiresAuth && !loggedInUser ? 'Login required' : ''}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </nav>

      <main className="main-content">
        <div className="container">
          {activeTab === 'auth' && (
            <AuthSection onLoginSuccess={handleLoginSuccess} />
          )}
          
          {activeTab === 'interview' && loggedInUser && (
            <InterviewSection />
          )}
          
          {activeTab === 'resume' && loggedInUser && (
            <ResumeSection />
          )}
          
          {activeTab === 'verification' && loggedInUser && (
            <VerificationSection />
          )}

          {activeTab !== 'auth' && !loggedInUser && (
            <div className="auth-required">
              <div className="auth-required-content">
                <h2>Authentication Required</h2>
                <p>Please login to access this feature</p>
                <button onClick={() => setActiveTab('auth')} className="button primary">
                  Go to Login
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="footer">
        <p>Powered by AWS Services: Rekognition, Bedrock, Textract</p>
      </footer>
    </div>
  );
}

export default App;
