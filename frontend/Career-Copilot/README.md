# Career Copilot - Frontend

A modern, sleek web application for the Career Copilot GenAI Placement Assistant hackathon project.

## 🚀 Features

- **🔐 Face Authentication**: Secure signup and login using Amazon Rekognition
- **🎯 AI Interview Preparation**: Generate company and role-specific interview questions with Amazon Bedrock
- **📄 AI Resume Builder**: Create professional resumes powered by Amazon Bedrock
- **✅ Document Verification**: Verify resume authenticity using Amazon Textract and Bedrock

## 🛠️ Tech Stack

- **React 19** with Hooks
- **Vite** for fast development and building
- **Modern CSS** with responsive design
- **AWS Services**: Rekognition, Bedrock, Textract (backend)

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running on AWS (already deployed)

## 🏃 Running the Application

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open in browser**:
   Navigate to `http://localhost:5173/`

## 🎨 Application Structure

```
src/
├── App.jsx                 # Main app with tab navigation and auth state
├── App.css                 # Main styles
├── index.css               # Global styles
├── utils.js                # Utility functions (base64 conversion, API base URL)
├── AuthSection.jsx         # Face authentication component
├── InterviewSection.jsx    # Interview preparation component
├── ResumeSection.jsx       # Resume builder component
└── VerificationSection.jsx # Document verification component
```

## 📖 How to Use

### 1. Authentication (Login Tab)

**Signup:**
1. Enter a unique User ID
2. Enter your name (optional)
3. Upload a clear selfie (reference image)
4. Click "Sign Up"

**Login:**
1. Enter your User ID
2. Upload a selfie for verification
3. Click "Login"
4. If successful, you'll be redirected to the Interview Prep section

### 2. Interview Preparation

1. Select a company from the dropdown (Amazon, Google, Microsoft, etc.)
2. Select your target role (SDE, ML Engineer, etc.)
3. Choose number of questions (1-10)
4. Click "Generate Questions"
5. Review the AI-generated interview questions with ideal answers

### 3. Resume Builder

1. Fill in your personal information:
   - Name and email (required)
   - Phone number
   - Professional summary
2. Add education details (one per line or comma-separated)
3. Add skills (comma-separated or one per line)
4. Add projects and experience
5. Click "Generate Resume"
6. Click "View Resume" to open your generated resume in a new tab

### 4. Document Verification

1. Fill in resume information:
   - Name (required)
   - Email
   - Education details
   - 10th and 12th scores
2. Upload supporting documents:
   - 10th marksheet
   - 12th marksheet
   - Degree or other certificates
3. Click "Verify Documents"
4. Review the credibility score (0-100)
5. Check any issues found by the AI
6. Read the detailed AI-generated verification report

## 🎨 Design Features

- **Clean & Minimal**: Lots of whitespace, subtle shadows, rounded corners
- **Responsive**: Works on desktop, tablet, and mobile devices
- **Modern Gradient**: Beautiful purple gradient theme
- **Smooth Animations**: Card hover effects and fade-in transitions
- **Loading States**: Visual feedback during API calls
- **Error Handling**: User-friendly error messages

## 🔌 API Integration

All components connect to the backend API at:
```
https://3thpmphful.execute-api.us-east-1.amazonaws.com/prod
```

Endpoints used:
- `POST /signup` - Register user with reference image
- `POST /login/face` - Authenticate user with face recognition
- `POST /interview/generate` - Generate interview questions
- `POST /resume/generate` - Create AI-powered resume
- `POST /verify` - Verify documents against resume

## 🚧 Development

**Build for production:**
```bash
npm run build
```

**Preview production build:**
```bash
npm run preview
```

**Lint code:**
```bash
npm run lint
```

## 📱 Responsive Breakpoints

- Desktop: > 768px (full layout with labels)
- Tablet/Mobile: ≤ 768px (compact layout, icon-only navigation)

## 🎯 Key Components

### AuthSection
- File upload with base64 conversion
- Signup and login forms
- Similarity score display
- Success/failure feedback

### InterviewSection
- Dynamic company and role selection
- Structured question parsing
- Difficulty badges (Easy, Medium, Hard)
- Clean question/answer display

### ResumeSection
- Comprehensive form with validation
- Array handling for lists (education, skills, projects)
- Presigned URL integration
- Success confirmation with resume ID

### VerificationSection
- Multiple document upload
- Document type management
- Credibility score visualization (0-100)
- Issues list with status badges
- AI-generated verification report
- Collapsible raw text preview

## 🔐 Security Notes

- All file uploads are converted to base64 for API transmission
- Token-based authentication (stored in component state)
- CORS-enabled backend
- Secure face recognition using AWS Rekognition

## 🤝 Contributing

This is a hackathon project. Feel free to extend features:
- Add more interview companies and roles
- Enhance resume templates
- Add more document types for verification
- Implement local storage for persistence
- Add download options for generated content

## 📄 License

Built for college AI hackathon - Career Copilot project

## 🎉 Credits

Powered by AWS Services:
- Amazon Rekognition (Face Recognition)
- Amazon Bedrock (Generative AI)
- Amazon Textract (Document Processing)
