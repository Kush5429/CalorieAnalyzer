Calorie & Nutrition Analyzer
This is a full-stack web application that allows users to input a recipe or list of ingredients and receive a detailed nutritional breakdown, including calories, protein, carbohydrates, and fat.

Tech Stack
Frontend: React, Tailwind CSS, recharts

Backend: Express.js

API: Spoonacular API

Project Structure
/
├── client/
│   ├── public/
│   │   ├── index.html
│   │   └── ...
│   ├── src/
│   │   ├── App.js
│   │   ├── index.css
│   │   └── index.js
│   ├── package.json
│   └── ...
│
├── server/
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── README.md

Setup and Running the Application
1. Prerequisites
Node.js and npm installed on your machine.

A free API key from Spoonacular.

2. Backend Setup
Navigate to the server/ directory in your terminal: cd server

Install the dependencies: npm install

Create a .env file and add your API key: SPOONACULAR_API_KEY=YOUR_SPOONACULAR_API_KEY

Start the server: npm start (or npm run dev if you have nodemon installed)

The server will run on http://localhost:3001.

3. Frontend Setup
Navigate to the client/ directory in a new terminal window: cd client

Install the dependencies: npm install

Start the React development server: npm start

The app will open in your browser at http://localhost:3000.

The frontend will automatically proxy API requests to the backend server running on port 3001. You can now use the application to analyze recipes!