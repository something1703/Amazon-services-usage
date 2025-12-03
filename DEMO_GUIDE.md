# Career Copilot - Quick Start Guide

## 🎯 For Hackathon Demo

### Setup (One-time)
```bash
cd frontend/Career-Copilot
npm install
npm run dev
```

The app will be available at: **http://localhost:5173/**

---

## 📋 Demo Flow

### Step 1: User Registration & Login (2 min)

1. **Go to Login tab** (default view)

2. **Signup Process:**
   - Enter User ID: `demo_student`
   - Enter Name: `Demo Student`
   - Upload a clear selfie (use webcam or file)
   - Click **Sign Up**
   - Wait for success message with `refImageKey`

3. **Login Process:**
   - Keep the same User ID: `demo_student`
   - Upload another selfie (same person)
   - Click **Login**
   - See similarity score (should be high, e.g., 95%+)
   - Automatically redirected to Interview Prep

---

### Step 2: Interview Preparation (2 min)

1. Now in **Interview Prep tab**

2. **Generate Questions:**
   - Select Company: `Amazon`
   - Select Role: `SDE`
   - Number of Questions: `5`
   - Click **✨ Generate Questions**

3. **Review Output:**
   - See difficulty levels (Easy/Medium/Hard)
   - Read questions and ideal answers
   - Show how AI tailored questions for Amazon SDE role

**Talking Point:** "This helps students prepare for specific companies and roles using AI-powered question generation."

---

### Step 3: Resume Builder (2 min)

1. Switch to **Resume Builder tab**

2. **Fill Information:**
   ```
   Name: Demo Student
   Email: demo@example.com
   Phone: 1234567890
   Summary: Final year CSE student passionate about cloud computing and AI
   
   Education:
   B.Tech CSE, XYZ College, 8.5 CGPA
   XII - ABC School, 92%
   X - DEF School, 95%
   
   Skills:
   Python, AWS, React, Node.js, Docker, SQL, Machine Learning
   
   Projects:
   Career Copilot - GenAI placement assistant using AWS services
   E-commerce Platform - Full-stack MERN application
   ML Sentiment Analyzer - NLP project using transformers
   
   Experience:
   Software Intern at Tech Corp (Summer 2024)
   ```

3. Click **✨ Generate Resume**

4. **View Result:**
   - Show resume ID
   - Click **🔗 View Resume** (opens in new tab)
   - Show professionally formatted HTML resume

**Talking Point:** "AI generates a well-structured resume from raw data, saving students hours of formatting work."

---

### Step 4: Document Verification (3 min)

1. Switch to **Verification tab**

2. **Enter Resume Data:**
   ```
   Name: Demo Student
   Email: demo@example.com
   
   Education:
   B.Tech CSE, XYZ College, 8.5 CGPA
   
   10th Score: 95
   12th Score: 92
   ```

3. **Upload Documents:**
   - Upload 10th marksheet image
   - Upload 12th marksheet image
   - (Use sample documents from `samples/` folder if available)

4. Click **🔍 Verify Documents**

5. **Show Results:**
   - **Credibility Score:** Large circular indicator (0-100)
   - **Color coding:**
     - Green (80-100): Excellent/Very Good
     - Yellow (60-79): Good/Fair
     - Red (<60): Needs Review
   - **Issues List:** Any discrepancies found
   - **AI Report:** Detailed analysis of document authenticity
   - **Raw Text Preview:** Show extracted text (expandable)

**Talking Points:**
- "Textract extracts text from documents automatically"
- "Bedrock AI compares claims with actual documents"
- "Helps colleges verify student credentials quickly"
- "Reduces fraud and manual verification work"

---

## 🎨 Features to Highlight

### Design Quality
- ✅ Clean, minimal, modern UI
- ✅ Responsive (works on mobile/tablet/desktop)
- ✅ Smooth animations and transitions
- ✅ Professional color scheme with gradients
- ✅ Loading states and error handling

### Technical Implementation
- ✅ React with modern hooks
- ✅ Modular component structure
- ✅ Base64 file handling
- ✅ Real-time API integration
- ✅ Tab-based navigation
- ✅ Authentication state management

### AWS Integration
- ✅ Amazon Rekognition (Face recognition)
- ✅ Amazon Bedrock (Generative AI)
- ✅ Amazon Textract (Document OCR)
- ✅ S3 presigned URLs (Resume storage)

---

## 🐛 Troubleshooting

### Issue: Can't login after signup
- **Solution:** Make sure you're using the exact same User ID
- **Solution:** Ensure both photos are of the same person
- **Solution:** Use clear, well-lit photos

### Issue: Low similarity score
- **Solution:** Take photos in good lighting
- **Solution:** Face the camera directly
- **Solution:** Don't use filters or heavy editing

### Issue: Verification score is low
- **Solution:** Ensure document images are clear and readable
- **Solution:** Make sure scores in form match document content
- **Solution:** Check that documents are the correct type

### Issue: Resume not generating
- **Solution:** Fill at least Name and Email (required fields)
- **Solution:** Check browser console for errors
- **Solution:** Verify backend API is responding

---

## 🎤 Demo Script (5 minutes)

**Introduction (30 sec):**
"Career Copilot is an AI-powered placement assistant for students. It uses AWS services to provide face-based login, interview prep, resume generation, and credential verification."

**Live Demo:**
1. **Face Login (60 sec):** Show signup and login with face recognition
2. **Interview Prep (60 sec):** Generate company-specific questions
3. **Resume Builder (90 sec):** Create and view AI-generated resume
4. **Verification (90 sec):** Upload documents and show credibility analysis

**Conclusion (30 sec):**
"This solution helps students prepare better and helps colleges verify credentials faster, all powered by AWS AI services."

---

## 📊 Key Metrics to Mention

- **Time Saved:** Resume generation in seconds vs hours manually
- **Accuracy:** 90%+ face match accuracy with Rekognition
- **Scalability:** Serverless architecture handles unlimited concurrent users
- **Cost-Effective:** Pay-per-use AWS services
- **Security:** No password storage, biometric authentication

---

## 🚀 Next Steps / Future Enhancements

If asked about improvements:
- Add more interview categories and domains
- PDF export for resumes
- Video interview practice with AI feedback
- Integration with job portals
- Mobile app version
- Multi-language support
- Analytics dashboard for placement officers

---

## 💡 Business Value

**For Students:**
- Better interview preparation
- Professional resume in minutes
- Secure, passwordless login
- Credential verification confidence

**For Colleges:**
- Automated credential verification
- Reduced manual verification work
- Fraud detection
- Placement analytics
- Modern, tech-forward solution

---

Good luck with your demo! 🎉
