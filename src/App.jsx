import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import BookingModal from './components/booking/BookingModal';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import Home from './pages/Home';
import EventCatalog from './pages/EventCatalog';
import EventDetails from './pages/EventDetails';
import Dashboard from './pages/Dashboard';
import CreateEvent from './pages/CreateEvent';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

// Styles
import './assets/styles/global.css';
import './assets/styles/components.css';

// Automatically scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export function App() {
  return (
    <Router>
      <AuthProvider>
        <BookingProvider>
          <ScrollToTop />
          <div className="app-container">
            <Navbar />
            <main className="main-content">
              <Routes>
                {/* Public Discovery Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/events" element={<EventCatalog />} />
                <Route path="/events/:id" element={<EventDetails />} />

                {/* Authentication Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/create-event"
                  element={
                    <ProtectedRoute>
                      <CreateEvent />
                    </ProtectedRoute>
                  }
                />

                {/* Catch-all 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>

            {/* Global Interactive Ticket Checkout Modal */}
            <BookingModal />

            <Footer />
          </div>
        </BookingProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
