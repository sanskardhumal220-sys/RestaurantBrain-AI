# RestaurantBrain AI

RestaurantBrain AI is an AI-powered Smart Restaurant Operating System designed for Vibeathon 6.0. It helps restaurants optimize operations using AI, automation, analytics, and intelligent decision-making.

## Project Structure

This project follows a clean architecture separating the frontend (React + Vite) from the backend (Flask).

\`\`\`text
restaurantbrain-ai/
├── frontend/             # React + Vite application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── layouts/      # Page layouts
│   │   ├── pages/        # React Router pages
│   │   ├── hooks/        # Custom React hooks
│   │   ├── context/      # React Context API state
│   │   ├── services/     # Axios API and third-party services
│   │   ├── routes/       # Route definitions
│   │   ├── utils/        # Utility functions
│   │   └── App.jsx       # Main App component with routing
│   └── ...
├── backend/              # Flask application
│   ├── routes/           # API Endpoints
│   ├── controllers/      # Request handlers
│   ├── models/           # Database models (SQLAlchemy)
│   ├── services/         # Business logic
│   ├── ai/               # AI integrations (Gemini API)
│   ├── database/         # DB configuration
│   ├── middleware/       # Custom middleware (JWT auth, etc.)
│   ├── utils/            # Helper functions
│   ├── app.py            # Flask entry point
│   └── requirements.txt  # Python dependencies
└── docs/                 # Documentation
\`\`\`

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, React Router, Framer Motion, Chart.js
- **Backend**: Python, Flask, Flask-SQLAlchemy, Flask-JWT-Extended
- **Database**: MySQL

## Setup Instructions

### Backend Setup
1. Navigate to the \`backend\` directory: \`cd backend\`
2. Create a virtual environment: \`python -m venv venv\`
3. Activate the virtual environment:
   - Windows: \`venv\\Scripts\\activate\`
   - Mac/Linux: \`source venv/bin/activate\`
4. Install dependencies: \`pip install -r requirements.txt\`
5. Run the server: \`python app.py\`

### Frontend Setup
1. Navigate to the \`frontend\` directory: \`cd frontend\`
2. Install dependencies: \`npm install\`
3. Start the development server: \`npm run dev\`
