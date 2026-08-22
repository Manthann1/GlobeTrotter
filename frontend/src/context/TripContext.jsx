import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, getStoredData, setStoredData } from '../services/api';
import { INITIAL_TRIPS, CITIES_DATA, INITIAL_USER } from '../data/mockData';
import confetti from 'canvas-confetti';

const TripContext = createContext();

export function TripProvider({ children }) {
  const [trips, setTrips] = useState(() => getStoredData('globetrotter_trips_v2', INITIAL_TRIPS));
  const [cities, setCities] = useState(() => getStoredData('globetrotter_cities_v2', CITIES_DATA));
  const [user, setUser] = useState(() => getStoredData('globetrotter_user_v2', INITIAL_USER));
  const [currency, setCurrency] = useState(() => localStorage.getItem('globetrotter_currency') || 'INR');
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sync with local storage
  useEffect(() => {
    setStoredData('globetrotter_trips_v2', trips);
  }, [trips]);

  useEffect(() => {
    setStoredData('globetrotter_user_v2', user);
  }, [user]);

  useEffect(() => {
    localStorage.setItem('globetrotter_currency', currency);
  }, [currency]);

  // Currency formatting helper
  const formatPrice = (amount) => {
    const num = Number(amount || 0);
    if (currency === 'INR') {
      return `₹${num.toLocaleString('en-IN')}`;
    }
    // Approx USD conversion (1 USD ≈ 85 INR)
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

  const createTrip = (tripData) => {
    const newTrip = {
      id: `trip-${Date.now()}`,
      userId: user.id,
      name: tripData.name || 'New India Adventure',
      subtitle: tripData.destination || 'Incredible India',
      startDate: tripData.startDate || new Date().toISOString().slice(0, 10),
      endDate: tripData.endDate || new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
      status: 'upcoming',
      isPublic: true,
      shareToken: `trip-${Date.now()}`,
      coverPhoto: tripData.coverPhoto || 'https://images.unsplash.com/photo-1603262110263-fb010d6e59d4?auto=format&fit=crop&w=1600&q=85',
      description: tripData.description || 'A custom planned travel itinerary on GlobeTrotter.',
      author: {
        name: user.name,
        photo: user.profilePhoto,
      },
      budget: {
        totalBudget: Number(tripData.totalBudget || 50000),
        dailyCap: Number(tripData.dailyCap || 5000),
        categoryBreakdown: { lodging: 0, food: 0, activities: 0, transport: 0 },
      },
      stops: tripData.initialCity ? [
        {
          id: `stop-${Date.now()}`,
          cityId: tripData.initialCity.id || 'c-custom',
          cityName: tripData.initialCity.name || tripData.destination,
          state: tripData.initialCity.state || '',
          country: tripData.initialCity.country || 'India',
          arrivalDate: tripData.startDate || new Date().toISOString().slice(0, 10),
          departureDate: tripData.endDate || new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
          sortOrder: 0,
          estCost: 0,
          activities: tripData.initialCity.activities ? tripData.initialCity.activities.slice(0, 2).map((a, idx) => ({
            ...a,
            id: `act-${Date.now()}-${idx}`,
            day: idx + 1,
            dayTitle: `Day ${idx + 1}: ${a.name}`,
            sortOrder: idx
          })) : []
        }
      ] : [],
    };

    setTrips((prev) => [newTrip, ...prev]);
    setUser((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        totalTrips: (prev.stats?.totalTrips || 0) + 1,
        upcomingTrips: (prev.stats?.upcomingTrips || 0) + 1,
      }
    }));

    showToast(`🎉 "${newTrip.name}" created successfully!`);
    return newTrip;
  };

  const updateTrip = (id, updatedFields) => {
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const merged = { ...t, ...updatedFields };
          return merged;
        }
        return t;
      })
    );
    showToast('Trip updated');
  };

  const deleteTrip = (id) => {
    setTrips((prev) => prev.filter((t) => t.id !== id));
    showToast('Trip deleted', 'info');
  };

  const copyTripToAccount = (tripToCopy) => {
    const clonedTrip = {
      ...tripToCopy,
      id: `trip-copy-${Date.now()}`,
      userId: user.id,
      name: `${tripToCopy.name} (My Copy)`,
      status: 'upcoming',
      author: {
        name: user.name,
        photo: user.profilePhoto,
      },
      shareToken: `copy-${Date.now()}`,
    };

    setTrips((prev) => [clonedTrip, ...prev]);
    setUser((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        totalTrips: (prev.stats?.totalTrips || 0) + 1,
        upcomingTrips: (prev.stats?.upcomingTrips || 0) + 1,
      }
    }));

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    showToast(`✈️ Trip "${tripToCopy.name}" copied to your account!`);
    return clonedTrip;
  };

  const addStopToTrip = (tripId, city) => {
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id === tripId) {
          const stops = t.stops || [];
          const newStop = {
            id: `stop-${Date.now()}`,
            cityId: city.id || 'c-custom',
            cityName: city.name,
            state: city.state || '',
            country: city.country,
            arrivalDate: t.endDate || new Date().toISOString().slice(0, 10),
            departureDate: new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10),
            sortOrder: stops.length,
            estCost: 0,
            activities: (city.activities || []).slice(0, 2).map((a, idx) => ({
              ...a,
              id: `ta-${Date.now()}-${idx}`,
              day: stops.length + 1,
              dayTitle: `Day ${stops.length + 1}: ${a.name}`,
              sortOrder: idx
            }))
          };
          return {
            ...t,
            stops: [...stops, newStop],
          };
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
          return {
            ...t,
            stops: (t.stops || []).filter((s) => s.id !== stopId),
          };
        }
        return t;
      })
    );
    showToast('Stop removed', 'info');
  };

  const reorderStops = (tripId, fromIndex, toIndex) => {
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id === tripId) {
          const stops = [...(t.stops || [])];
          const [moved] = stops.splice(fromIndex, 1);
          stops.splice(toIndex, 0, moved);
          return {
            ...t,
            stops: stops.map((s, idx) => ({ ...s, sortOrder: idx })),
          };
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
                timeSlot: activityData.timeSlot || '12:00',
                description: activityData.description || 'Custom activity',
                imageUrl: activityData.imageUrl || 'https://images.unsplash.com/photo-1603262110263-fb010d6e59d4?auto=format&fit=crop&w=800&q=80',
                day: activityData.day || 1,
                dayTitle: activityData.dayTitle || `Day 1: ${activityData.name}`,
                sortOrder: acts.length,
              };
              return {
                ...stop,
                activities: [...acts, newAct],
              };
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
              return {
                ...stop,
                activities: (stop.activities || []).filter((a) => a.id !== activityId),
              };
            }
            return stop;
          });
          return { ...t, stops: updatedStops };
        }
        return t;
      })
    );
    showToast('Activity removed', 'info');
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
