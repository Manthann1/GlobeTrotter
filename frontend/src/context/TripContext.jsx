import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';
import confetti from 'canvas-confetti';

const TripContext = createContext();

export function TripProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  
  const [trips, setTrips] = useState([]);
  const [cities, setCities] = useState([]);
  const [currency, setCurrency] = useState(() => localStorage.getItem('globetrotter_currency') || 'INR');
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const citiesData = await api.getCities();
        setCities(citiesData.data || []);
        
        if (isAuthenticated) {
          const tripsData = await api.getTrips();
          setTrips(tripsData.data || []);
        } else {
          // If not authenticated, we could just clear trips or load public ones
          const publicTrips = await api.getTrips(); // Our backend might return public trips if no token
          setTrips(publicTrips.data || []);
        }
      } catch (err) {
        console.error("Failed to load initial data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('globetrotter_currency', currency);
  }, [currency]);

  // Currency formatting helper
  const formatPrice = (amount) => {
    const num = Number(amount || 0);
    if (currency === 'INR') {
      return `₹${num.toLocaleString('en-IN')}`;
    }
    const usd = Math.round(num / 85);
    return `$${usd.toLocaleString('en-US')}`;
  };

  const toggleCurrency = () => {
    setCurrency((prev) => (prev === 'INR' ? 'USD' : 'INR'));
  };

  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Trip calculation helpers
  const calculateTripTotals = (trip) => {
    if (!trip || !trip.stops) return { totalSpent: 0, breakdown: { lodging: 0, food: 0, activities: 0, transport: 0 } };

    let total = 0;
    const breakdown = { lodging: 0, food: 0, activities: 0, transport: 0 };

    trip.stops.forEach((stop) => {
      (stop.activities || []).forEach((act) => {
        const cost = Number(act.cost || 0);
        total += cost;
        const cat = (act.category || '').toLowerCase();
        if (cat.includes('lodging') || cat.includes('hotel') || cat.includes('stay') || cat.includes('haveli') || cat.includes('houseboat')) {
          breakdown.lodging += cost;
        } else if (cat.includes('food') || cat.includes('dining') || cat.includes('restaurant') || cat.includes('thali') || cat.includes('tasting')) {
          breakdown.food += cost;
        } else if (cat.includes('transport') || cat.includes('train') || cat.includes('flight') || cat.includes('cab')) {
          breakdown.transport += cost;
        } else {
          breakdown.activities += cost;
        }
      });
    });

    return { totalSpent: total, breakdown };
  };

  const getTrip = (id) => {
    return trips.find((t) => t.id === id || t.shareToken === id) || null;
  };

  const createTrip = async (tripData) => {
    if (!isAuthenticated) {
      showToast("Please login to create a trip", "error");
      return null;
    }

    try {
      // Use the actual API to create the trip
      const res = await api.createTrip(tripData);
      const newTrip = res.data;
      
      setTrips((prev) => [newTrip, ...prev]);
      showToast(`🎉 "${newTrip.name}" created successfully!`);
      return newTrip;
    } catch (err) {
      console.error("Failed to create trip", err);
      showToast("Failed to create trip", "error");
      return null;
    }
  };

  const updateTrip = async (id, updatedFields) => {
    try {
      await api.updateTrip(id, updatedFields);
      setTrips((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updatedFields } : t))
      );
      showToast('Trip updated');
    } catch (err) {
      console.error("Failed to update trip", err);
      showToast("Failed to update trip", "error");
    }
  };

  const deleteTrip = async (id) => {
    try {
      await api.deleteTrip(id);
      setTrips((prev) => prev.filter((t) => t.id !== id));
      showToast('Trip deleted', 'info');
    } catch (err) {
      console.error("Failed to delete trip", err);
      showToast("Failed to delete trip", "error");
    }
  };

  // For copying, we should probably add an API route, but for now we simulate locally or call createTrip again.
  const copyTripToAccount = async (tripToCopy) => {
    if (!isAuthenticated) return null;
    
    // In a full implementation, we'd call an API endpoint like /api/trips/:id/copy
    // For now we'll do a basic createTrip with copied data
    const cloneData = {
      name: `${tripToCopy.name} (My Copy)`,
      startDate: tripToCopy.startDate,
      endDate: tripToCopy.endDate,
      totalBudget: tripToCopy.totalBudget,
      status: 'DRAFT',
      isPublic: false
    };

    const newTrip = await createTrip(cloneData);
    
    try {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch {
      // Ignore confetti error
    } return newTrip;
  };

  // Mocking stop/activity additions locally for immediate UI response, 
  // normally these would also be API calls (e.g. POST /api/trips/:id/stops)
  const addStopToTrip = (tripId, city) => {
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id === tripId) {
          const stops = t.stops || [];
          const newStop = {
            id: `stop-${Date.now()}`,
            cityId: city.id,
            cityName: city.name,
            state: city.state,
            country: city.country,
            arrivalDate: t.endDate || new Date().toISOString().slice(0, 10),
            departureDate: new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10),
            sortOrder: stops.length,
            activities: []
          };
          return { ...t, stops: [...stops, newStop] };
        }
        return t;
      })
    );
    showToast(`📍 Added ${city.name} to itinerary`);
  };

  const removeStopFromTrip = (tripId, stopId) => {
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id === tripId) {
          return { ...t, stops: (t.stops || []).filter((s) => s.id !== stopId) };
        }
        return t;
      })
    );
  };

  const reorderStops = (tripId, fromIndex, toIndex) => {
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id === tripId) {
          const stops = [...(t.stops || [])];
          const [moved] = stops.splice(fromIndex, 1);
          stops.splice(toIndex, 0, moved);
          return { ...t, stops: stops.map((s, idx) => ({ ...s, sortOrder: idx })) };
        }
        return t;
      })
    );
  };

  const addActivityToStop = (tripId, stopId, activityData) => {
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id === tripId) {
          const updatedStops = (t.stops || []).map((stop) => {
            if (stop.id === stopId) {
              const acts = stop.activities || [];
              const newAct = {
                id: `act-${Date.now()}`,
                name: activityData.name || 'Custom Experience',
                category: activityData.category || 'Sightseeing',
                cost: Number(activityData.cost || 0),
                dayTitle: activityData.dayTitle || `Day 1: ${activityData.name}`,
                sortOrder: acts.length,
                ...activityData
              };
              return { ...stop, activities: [...acts, newAct] };
            }
            return stop;
          });
          return { ...t, stops: updatedStops };
        }
        return t;
      })
    );
    showToast(`✨ Added "${activityData.name}"`);
  };

  const removeActivityFromStop = (tripId, stopId, activityId) => {
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id === tripId) {
          const updatedStops = (t.stops || []).map((stop) => {
            if (stop.id === stopId) {
              return { ...stop, activities: (stop.activities || []).filter((a) => a.id !== activityId) };
            }
            return stop;
          });
          return { ...t, stops: updatedStops };
        }
        return t;
      })
    );
  };

  return (
    <TripContext.Provider
      value={{
        trips,
        cities,
        user,
        currency,
        setCurrency,
        toggleCurrency,
        formatPrice,
        searchQuery,
        setSearchQuery,
        toasts,
        showToast,
        removeToast,
        getTrip,
        createTrip,
        updateTrip,
        deleteTrip,
        copyTripToAccount,
        addStopToTrip,
        removeStopFromTrip,
        reorderStops,
        addActivityToStop,
        removeActivityFromStop,
        calculateTripTotals,
        loading
      }}
    >
      {children}
    </TripContext.Provider>
  );
}

export function useTrip() {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
}
