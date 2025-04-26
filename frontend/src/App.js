// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Views/Home';
import Community from './Views/Community';
import OAuthCallback from './Components/Home/OAuthCallbackHandler'; // Import your OAuthCallback component

// ProtectedRoute to check if the user is authenticated
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('userId') && localStorage.getItem('accessToken');
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Add the OAuth callback route here */}
        <Route path="/oauth2/callback" element={<OAuthCallback />} />
        {/* Protected route for /community */}
        <Route 
          path="/community" 
          element={
            <ProtectedRoute>
              <Community />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
};

export default App;
