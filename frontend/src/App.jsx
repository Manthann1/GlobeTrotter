import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

function App() {
  const [newTripModalOpen, setNewTripModalOpen] = useState(false);

  const handleOpenNewTrip = () => {
    setNewTripModalOpen(true);
  };

  return (
    <TripProvider>
      <Router>
        <ToastContainer />

        <Routes>
          {/* Dashboard Route */}
          <Route
            path="/"
            element={
              <StandardLayout onOpenNewTrip={handleOpenNewTrip}>
                <DashboardPage onOpenNewTrip={handleOpenNewTrip} />
              </StandardLayout>
            }
          />
          <Route
            path="/dashboard"
            element={<Navigate to="/" replace />}
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

          {/* Trip Builder / Itinerary Planner (Custom full-screen sidebar layout) */}
          <Route
            path="/trips/:tripId/edit"
            element={<TripBuilderPage />}
          />

          {/* Dedicated Budget Analysis Route (Mockup 1) */}
          <Route
            path="/trips/:tripId/budget"
            element={<BudgetAnalysisPage />}
          />

          {/* Trip Copied Success Route (Mockup 3) */}
          <Route
            path="/trips/:tripId/copied"
            element={<TripCopiedPage />}
          />

          {/* Explore Destinations */}
          <Route
            path="/explore"
            element={
              <StandardLayout onOpenNewTrip={handleOpenNewTrip}>
                <ExplorePage onOpenNewTrip={handleOpenNewTrip} />
              </StandardLayout>
            }
          />

          {/* User Profile & Preferences Route (Mockup 2) */}
          <Route
            path="/profile"
            element={
              <StandardLayout onOpenNewTrip={handleOpenNewTrip}>
                <ProfilePage />
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
  );
}

export default App;
