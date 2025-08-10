# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an AI-powered exam question generation prototype for the Korea Health Personnel Licensing Examination Institute (한국보건의료인국가시험원), submitted for their 2025 Innovation Contest. The system demonstrates how AI can assist medical exam question creators in generating, reviewing, and managing high-quality medical exam questions.

## Development Commands

### Local Development
```bash
# Install dependencies
npm install

# Start development server with live reload
npm run dev
# This starts live-server on port 3000
# Navigate to http://localhost:3000

# Note: npm start outputs serverless info message
npm start
```

### Building and Deployment
```bash
# Static build (outputs confirmation message)
npm run build

# Deploy to Vercel production
npm run deploy
# or 
vercel --prod

# Test deployment without deployment
vercel
```

### File Structure Access
```bash
# Main entry point
open index.html

# View in browser directly (no server needed)
# Just open index.html in any modern web browser
```

## Architecture Overview

### Technology Stack
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Vercel Serverless Functions (Node.js)
- **AI Integration**: Google Gemini API (@google/generative-ai)
- **Styling**: Custom CSS with CSS Grid/Flexbox, Google Fonts (Noto Sans KR)
- **Charts**: Chart.js for data visualizations
- **Icons**: Font Awesome 6.4.0
- **Deployment**: Vercel with serverless functions configuration

### Application Structure

The application is a **Single Page Application (SPA)** with dynamic page switching:

#### Core Components
1. **Dashboard**: Real-time system metrics, examiner performance, recent activities
2. **AI Question Generator**: Form-based question generation with mock AI simulation
3. **Review System**: Question approval workflow with filtering capabilities  
4. **Analytics**: Statistical dashboards with charts showing question distribution and trends

#### Key Files
- `index.html`: Complete SPA with all page content, navigation structure
- `js/main.js`: Application logic, navigation, page rendering, chart setup
- `js/main-v2.js`: Enhanced version with additional features
- `js/data.js`: Mock data definitions and utility functions
- `mock_data.json`: Additional structured mock data for medical questions
- `styles/main.css`: Comprehensive styling including responsive design
- `api/`: Vercel serverless functions directory
  - `api/ai/generate.js`: AI question generation endpoint (Gemini API)
  - `api/analytics/dashboard.js`: Analytics data endpoint
  - `api/questions/index.js`: Question management endpoints
  - `api/collaboration/rooms.js`: Collaboration features
  - `api/health.js`: Health check endpoint
- `vercel.json`: Deployment configuration for serverless functions

### Data Architecture

#### Mock Data Structure (`js/data.js`):
- **Users**: Medical professionals (doctors, nurses) with specialties and performance metrics
- **Questions**: Medical exam questions with choices, explanations, metadata
- **Subjects**: Medical specialties (Internal Medicine, Surgery, Nursing, Pharmacy)
- **Dashboard Stats**: System performance metrics, generation statistics
- **Activities**: Recent system activities and user actions
- **Performance Data**: Examiner efficiency scores, approval rates, monthly targets

#### Question Data Model:
```javascript
{
  id: number,
  title: string,
  content: string,        // Question text
  subject_id: number,
  difficulty_level: 1-10,
  question_type: "multiple_choice" | "scenario_based",
  ai_generated: boolean,
  status: "draft" | "pending" | "approved" | "rejected",
  choices: [
    {
      choice_text: string,
      is_correct: boolean,
      explanation: string
    }
  ],
  explanation: string,    // Overall explanation
  tags: string[],
  references: string[]
}
```

### Navigation System

Uses `data-page` attributes for SPA routing:
- **Dashboard** (`dashboard-page`): System overview and metrics
- **Generator** (`generator-page`): AI question creation interface  
- **Review** (`review-page`): Question approval and management
- **Analytics** (`analytics-page`): Statistical analysis and charts

Page content is dynamically generated in JavaScript using template literals and injected into the DOM.

### UI/UX Features

#### Design System
- **Korean-focused**: Noto Sans KR typography, Korean medical terminology
- **Medical Professional UI**: Clean, clinical design with healthcare color schemes
- **Responsive**: Grid-based layout adapting to desktop/tablet/mobile
- **Accessibility**: Semantic markup, proper contrast ratios

#### Interactive Elements
- **Real-time Updates**: Simulated live data updates for dashboard metrics
- **Chart Visualizations**: Bar charts (monthly trends), doughnut charts (difficulty distribution)
- **Form Interactions**: Multi-step question generation with validation
- **Status Indicators**: Color-coded badges for approval states, difficulty levels

## Development Workflow

### Adding New Questions
Questions are stored in the `mockData.questions` array in `js/data.js`. Each question requires:
- Unique ID
- Medical specialty assignment
- 5 multiple choice options with explanations
- Overall explanation with clinical reasoning
- Appropriate tags and references

### Modifying the Dashboard
Dashboard metrics are controlled by `mockData.dashboardStats`. Charts are rendered using Chart.js with data from `mockData.monthlyData`.

### Extending Analytics
New chart types can be added in the `setupAnalyticsCharts()` function. Chart.js configuration allows for various medical data visualizations.

## API Endpoints

The serverless functions provide the following endpoints:

### `/api/ai/generate` (POST)
Generates medical exam questions using Google Gemini AI.

**Request Body:**
```javascript
{
  specialty: string,        // Medical specialty
  difficulty: string,       // 'easy', 'medium', 'hard'
  questionType: string,     // 'multiple_choice', 'scenario_based'
  topic: string,           // Specific topic
  keywords: string[],      // Related keywords
  context: string          // Additional context
}
```

**Response:**
```javascript
{
  success: boolean,
  question: {
    title: string,
    content: string,
    choices: Array<{choice_text: string, is_correct: boolean, explanation: string}>,
    explanation: string,
    difficulty_level: number,
    tags: string[],
    references: string[]
  }
}
```

### Environment Variables
- `GEMINI_API_KEY`: Google Gemini API key for AI question generation

### Error Handling
All API endpoints include proper error handling with appropriate HTTP status codes and CORS headers for cross-origin requests.

## Content Guidelines

This is a **medical education prototype** for a government institution. All content should be:
- Clinically accurate and evidence-based
- Appropriate for medical professional assessment
- Aligned with Korean medical education standards
- Professional and institutional in tone

The prototype demonstrates a real AI-powered question generation system using Google Gemini API integration. It combines mock data for UI demonstration with actual AI capabilities for question generation. The serverless architecture allows for scalable deployment while maintaining the prototype's demonstration purpose.

## Deployment Notes

- Configured for Vercel serverless functions hosting
- No build process required for frontend (vanilla HTML/CSS/JS)
- All frontend assets are referenced via CDN (Chart.js, Font Awesome, Google Fonts)
- Backend API functions require GEMINI_API_KEY environment variable
- Functions have 30-second timeout limit as configured in vercel.json
- CORS headers are configured for cross-origin requests
- Mock data is embedded in JavaScript files, with AI generation available via serverless functions