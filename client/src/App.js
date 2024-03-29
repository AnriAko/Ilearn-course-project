import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Main from './pages/Main';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CollectionPage from './pages/CollectionPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import UserPage from './pages/UserPage'

function App() {
  return (
    <Router>
      <div>
        <Navigation />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/collections/:id" element={<CollectionPage />} />
          <Route path="/users/:userID" element={<UserPage />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;