import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TripProvider } from './context/TripContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import DashboardPage from './pages/DashboardPage';
import TripViewPage from './pages/TripViewPage';
import TripBuilderPage from './pages/TripBuilderPage';
import BudgetAnalysisPage from './pages/BudgetAnalysisPage';
import ProfilePage from './pages/ProfilePage';
import TripCopiedPage from './pages/TripCopiedPage';
import ExplorePage from './pages/ExplorePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LandingPage from './pages/LandingPage';
import MyTripsPage from './pages/MyTripsPage';
import CalendarPage from './pages/CalendarPage';
import AdminPage from './pages/AdminPage';
import CommunityPage from './pages/CommunityPage';
import SearchPage from './pages/SearchPage';
import NewTripModal from './components/modals/NewTripModal';
import ToastContainer from './components/ui/Toast';

// Layout wrapper for standard pages with top navbar and footer
function StandardLayout({ children, onOpenNewTrip }) {
  return (
    <div className="bg-[#f8f9fa] text-[#191c1d] font-['Inter'] min-h-screen flex flex-col antialiased">
      <Navbar onOpenNewTrip={onOpenNewTrip} />
      <main className="flex-grow flex flex-col">{children}</main>
      <Footer />
    </div>
  );
}

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

function App() {
  const [newTripModalOpen, setNewTripModalOpen] = useState(false);

  const handleOpenNewTrip = () => {
    setNewTripModalOpen(true);
  };

  return (
    <AuthProvider>
      <TripProvider>
        <Router>
          <ToastContainer />

          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Landing Page (Public / Home) */}
            <Route
              path="/"
              element={
                <StandardLayout onOpenNewTrip={handleOpenNewTrip}>
                  <LandingPage />
                </StandardLayout>
              }
            />

            {/* Dashboard Route (Protected) */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <StandardLayout onOpenNewTrip={handleOpenNewTrip}>
                    <DashboardPage onOpenNewTrip={handleOpenNewTrip} />
                  </StandardLayout>
                </ProtectedRoute>
              }
            />

            {/* Public / Share Trip View */}
            <Route
              path="/trips/:tripId"
              element={
                <StandardLayout onOpenNewTrip={handleOpenNewTrip}>
                  <TripViewPage />
                </StandardLayout>
              }
            />

            {/* Trip Builder / Itinerary Planner (Protected) */}
            <Route
              path="/trips/:tripId/edit"
              element={
                <ProtectedRoute>
                  <TripBuilderPage />
                </ProtectedRoute>
              }
            />

            {/* Dedicated Budget Analysis Route */}
            <Route
              path="/trips/:tripId/budget"
              element={
                <ProtectedRoute>
                  <BudgetAnalysisPage />
                </ProtectedRoute>
              }
            />

            {/* Trip Copied Success Route */}
            <Route
              path="/trips/:tripId/copied"
              element={<TripCopiedPage />}
            />

            {/* Explore Destinations (Public but inside layout) */}
            <Route
              path="/explore"
              element={
                <StandardLayout onOpenNewTrip={handleOpenNewTrip}>
                  <ExplorePage onOpenNewTrip={handleOpenNewTrip} />
                </StandardLayout>
              }
            />

            {/* User Profile & Preferences Route (Protected) */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <StandardLayout onOpenNewTrip={handleOpenNewTrip}>
                    <ProfilePage />
                  </StandardLayout>
                </ProtectedRoute>
              }
            />

            {/* Additional Missing Routes */}
            <Route
              path="/my-trips"
              element={
                <ProtectedRoute>
                  <StandardLayout onOpenNewTrip={handleOpenNewTrip}>
                    <MyTripsPage />
                  </StandardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/calendar"
              element={
                <ProtectedRoute>
                  <StandardLayout onOpenNewTrip={handleOpenNewTrip}>
                    <CalendarPage />
                  </StandardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <StandardLayout onOpenNewTrip={handleOpenNewTrip}>
                    <AdminPage />
                  </StandardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/community"
              element={
                <StandardLayout onOpenNewTrip={handleOpenNewTrip}>
                  <CommunityPage />
                </StandardLayout>
              }
            />
            <Route
              path="/search"
              element={
                <StandardLayout onOpenNewTrip={handleOpenNewTrip}>
                  <SearchPage />
                </StandardLayout>
              }
            />

            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Global New Trip Modal */}
          <NewTripModal
            isOpen={newTripModalOpen}
            onClose={() => setNewTripModalOpen(false)}
          />
        </Router>
      </TripProvider>
    </AuthProvider>
  );
}

export default App;
