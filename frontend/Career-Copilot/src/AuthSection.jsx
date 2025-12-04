import { useState } from 'react';
import { toBase64, API_BASE } from './utils';

export default function AuthSection({ onLoginSuccess }) {
  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [refImage, setRefImage] = useState(null);
  const [refImagePreview, setRefImagePreview] = useState(null);
  const [loginImage, setLoginImage] = useState(null);
  const [loginImagePreview, setLoginImagePreview] = useState(null);
  const [signupResponse, setSignupResponse] = useState(null);
  const [loginResponse, setLoginResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRefImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRefImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setRefImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLoginImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoginImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLoginImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignup = async () => {
    if (!userId.trim() || !refImage) {
      setError('Please enter a userId and upload a reference image');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const imgB64 = await toBase64(refImage);
      
      const response = await fetch(`${API_BASE}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId.trim(),
          name: name.trim() || userId.trim(),
          image_base64: imgB64,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }
      
      setSignupResponse(data);
      setError(null);
    } catch (err) {
      setError('Signup failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!userId.trim() || !loginImage) {
      setError('Please enter a userId and upload a login image');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const imgB64 = await toBase64(loginImage);
      
      const response = await fetch(`${API_BASE}/login/face`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId.trim(),
          image_base64: imgB64,
        }),
      });

      const data = await response.json();
      setLoginResponse(data);
      
      if (data.success && response.ok) {
        onLoginSuccess?.(userId.trim(), data.token);
      } else {
        setError(`Login failed. Similarity: ${data.similarity}%`);
      }
    } catch (err) {
      setError('Login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section">
      <h2>Face Authentication</h2>
      <p className="section-description">
        Secure login powered by Amazon Rekognition
      </p>

      <div className="card">
        <h3>User ID</h3>
        <input
          type="text"
          placeholder="Enter your user ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="input"
        />
        
        <input
          type="text"
          placeholder="Your name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
          style={{ marginTop: '10px' }}
        />
      </div>

      <div className="card">
        <h3>Signup - Upload Reference Image</h3>
        <p className="help-text">Upload a clear selfie for registration</p>
        
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <div className="file-input-wrapper">
              <input
                type="file"
                accept="image/*"
                onChange={handleRefImageChange}
                className="file-input"
                id="ref-image"
              />
              <label htmlFor="ref-image" className="file-label">
                {refImage ? refImage.name : 'Choose reference image'}
              </label>
            </div>

            <button onClick={handleSignup} disabled={loading} className="button primary">
              {loading ? 'Processing...' : 'Sign Up'}
            </button>
          </div>

          {refImagePreview && (
            <div className="image-preview">
              <img src={refImagePreview} alt="Reference preview" />
            </div>
          )}
        </div>

        {signupResponse && (
          <div className="response-box success">
            <strong>✓ Signup Successful!</strong>
            <div className="response-details">
              <div>User ID: {signupResponse.userId}</div>
              <div>Image Key: {signupResponse.refImageKey}</div>
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <h3>Login - Verify Your Face</h3>
        <p className="help-text">Upload a selfie to authenticate</p>
        
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <div className="file-input-wrapper">
              <input
                type="file"
                accept="image/*"
                onChange={handleLoginImageChange}
                className="file-input"
                id="login-image"
              />
              <label htmlFor="login-image" className="file-label">
                {loginImage ? loginImage.name : 'Choose login image'}
              </label>
            </div>

            <button onClick={handleLogin} disabled={loading} className="button primary">
              {loading ? 'Verifying...' : 'Login'}
            </button>
          </div>

          {loginImagePreview && (
            <div className="image-preview">
              <img src={loginImagePreview} alt="Login preview" />
            </div>
          )}
        </div>

        {loginResponse && (
          <div className={`response-box ${loginResponse.success ? 'success' : 'error'}`}>
            {loginResponse.success ? (
              <>
                <strong>✓ Login Successful!</strong>
                <div className="response-details">
                  <div>Similarity Score: {loginResponse.similarity}%</div>
                  <div>Token: {loginResponse.token}</div>
                </div>
              </>
            ) : (
              <>
                <strong>✗ Login Failed</strong>
                <div className="response-details">
                  <div>Similarity Score: {loginResponse.similarity}%</div>
                  <div>Face doesn't match reference image</div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  );
}
