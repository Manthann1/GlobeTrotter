import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';
import confetti from 'canvas-confetti';

const TripContext = createContext();

/**
 * Normalizes raw backend trip data (including deep relations) for UI consumers
 */
const normalizeTrip = (rawTrip) => {
  if (!rawTrip) return null;

  const stops = (rawTrip.stops || []).map((stop, stopIdx) => {
    const activities = (stop.tripActivities || stop.activities || []).map((act, actIdx) => ({
      id: act.id,
      activityId: act.activityId,
      name: act.nameSnapshot || act.name || 'Experience',
      category: act.categorySnapshot || act.category || 'Sightseeing',
      cost: Number(act.costSnapshot ?? act.cost ?? 0),
      timeSlot: act.timeSlot || '10:00',
      scheduledDate: act.scheduledDate || null,
      day: act.day || (actIdx + 1),
      dayTitle: act.dayTitle || `Day ${actIdx + 1}: ${act.nameSnapshot || act.name || 'Experience'}`,
      description: act.notes || act.description || act.activity?.description || `${act.categorySnapshot || act.category || 'Sightseeing'} experience`,
      imageUrl: act.activity?.imageUrl || act.imageUrl || null,
      sortOrder: act.sortOrder ?? actIdx,
    }));

    return {
      ...stop,
      cityName: stop.city?.name || stop.cityName || (stop.city ? `${stop.city.name}` : 'Destination'),
      state: stop.city?.state || stop.state || null,
      country: stop.city?.country || stop.country || 'India',
      arrivalDate: stop.arrivalDate
        ? (typeof stop.arrivalDate === 'string' ? stop.arrivalDate.slice(0, 10) : new Date(stop.arrivalDate).toISOString().slice(0, 10))
        : '',
      departureDate: stop.departureDate
        ? (typeof stop.departureDate === 'string' ? stop.departureDate.slice(0, 10) : new Date(stop.departureDate).toISOString().slice(0, 10))
        : '',
      sortOrder: stop.sortOrder ?? stopIdx,
      activities,
    };
  });

  return {
    ...rawTrip,
    startDate: rawTrip.startDate
      ? (typeof rawTrip.startDate === 'string' ? rawTrip.startDate.slice(0, 10) : new Date(rawTrip.startDate).toISOString().slice(0, 10))
      : '',
    endDate: rawTrip.endDate
      ? (typeof rawTrip.endDate === 'string' ? rawTrip.endDate.slice(0, 10) : new Date(rawTrip.endDate).toISOString().slice(0, 10))
      : '',
    stops,
  };
};

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
        setCities(citiesData.data || citiesData || []);

        if (isAuthenticated) {
          const tripsData = await api.getTrips();
          const rawTrips = tripsData.data?.trips || tripsData.data || tripsData || [];
          const incoming = Array.isArray(rawTrips) ? rawTrips.map(normalizeTrip) : [];
          setTrips((prev) =>
            incoming.map((inTrip) => {
              const existing = prev.find((p) => p.id === inTrip.id);
              if (existing && existing.stops?.length > 0 && (!inTrip.stops || inTrip.stops.length === 0)) {
                return { ...inTrip, stops: existing.stops };
              }
              return inTrip;
            })
          );
        } else {
          const publicTrips = await api.getTrips();
          const rawTrips = publicTrips.data?.trips || publicTrips.data || publicTrips || [];
          const incoming = Array.isArray(rawTrips) ? rawTrips.map(normalizeTrip) : [];
          setTrips((prev) =>
            incoming.map((inTrip) => {
              const existing = prev.find((p) => p.id === inTrip.id);
              if (existing && existing.stops?.length > 0 && (!inTrip.stops || inTrip.stops.length === 0)) {
                return { ...inTrip, stops: existing.stops };
              }
              return inTrip;
            })
          );
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

  /**
   * Deep fetch trip details with all stops, cities, and activities from database
   */
  const fetchTripDetails = async (tripId) => {
    try {
      let res;
      try {
        res = await api.getTripById(tripId);
      } catch (err) {
        // Fallback for public shared trip links / share tokens without JWT
        res = await api.getTripByShareToken(tripId);
      }

      const tripData = res.data?.trip || res.data || res;
      if (tripData) {
        const normalized = normalizeTrip(tripData);
        setTrips((prev) => {
          const exists = prev.some(
            (t) => t.id === normalized.id || (normalized.shareToken && t.shareToken === normalized.shareToken)
          );
          if (exists) {
            return prev.map((t) =>
              t.id === normalized.id || (normalized.shareToken && t.shareToken === normalized.shareToken)
                ? normalized
                : t
            );
          }
          return [normalized, ...prev];
        });
        return normalized;
      }
    } catch (err) {
      console.error(`Failed to fetch details for trip ${tripId}:`, err);
    }
    return null;
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
      const res = await api.createTrip(tripData);
      const rawTrip = res.data?.trip || res.data || res;
      const newTrip = normalizeTrip(rawTrip);

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
      const res = await api.updateTrip(id, updatedFields);
      const rawTrip = res.data?.trip || res.data || updatedFields;
      setTrips((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...normalizeTrip(rawTrip) } : t))
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

  const copyTripToAccount = async (tripToCopy) => {
    if (!isAuthenticated) return null;

    const cloneData = {
      name: `${tripToCopy.name} (My Copy)`,
      startDate: tripToCopy.startDate,
      endDate: tripToCopy.endDate,
      totalBudget: tripToCopy.totalBudget,
      status: 'DRAFT',
      isPublic: false,
    };

    const newTrip = await createTrip(cloneData);

    try {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch {
      // Ignore confetti error
    }
    return newTrip;
  };

  /**
   * Persist a Stop to backend database via POST /api/trips/:tripId/stops
   */
  const addStopToTrip = async (tripId, city) => {
    try {
      const targetTrip = trips.find((t) => t.id === tripId);
      const stopsCount = targetTrip?.stops?.length || 0;
      const arrivalDate = city.arrivalDate || targetTrip?.endDate || new Date().toISOString().slice(0, 10);
      const departureDate = city.departureDate || new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10);

      const stopPayload = {
        cityId: city.id,
        arrivalDate,
        departureDate,
        sortOrder: stopsCount,
        notes: city.notes || null,
      };

      const res = await api.addStop(tripId, stopPayload);
      const rawStop = res.data?.stop || res.stop || res;

      const normalizedStop = {
        ...rawStop,
        cityId: city.id,
        cityName: rawStop.city?.name || city.name,
        state: rawStop.city?.state || city.state || null,
        country: rawStop.city?.country || city.country || 'India',
        arrivalDate: rawStop.arrivalDate
          ? (typeof rawStop.arrivalDate === 'string' ? rawStop.arrivalDate.slice(0, 10) : new Date(rawStop.arrivalDate).toISOString().slice(0, 10))
          : arrivalDate,
        departureDate: rawStop.departureDate
          ? (typeof rawStop.departureDate === 'string' ? rawStop.departureDate.slice(0, 10) : new Date(rawStop.departureDate).toISOString().slice(0, 10))
          : departureDate,
        sortOrder: rawStop.sortOrder ?? stopsCount,
        activities: rawStop.tripActivities || rawStop.activities || [],
      };

      setTrips((prev) =>
        prev.map((t) => {
          if (t.id === tripId) {
            const currentStops = t.stops || [];
            return { ...t, stops: [...currentStops, normalizedStop] };
          }
          return t;
        })
      );

      showToast(`📍 Added ${city.name || normalizedStop.cityName} to itinerary`);
      return normalizedStop;
    } catch (err) {
      console.error("Failed to add stop to trip:", err);
      showToast("Failed to add stop to itinerary", "error");
      return null;
    }
  };

  /**
   * Delete a Stop from backend database via DELETE /api/stops/:stopId
   */
  const removeStopFromTrip = async (tripId, stopId) => {
    try {
      await api.deleteStop(stopId);
      setTrips((prev) =>
        prev.map((t) => {
          if (t.id === tripId) {
            return { ...t, stops: (t.stops || []).filter((s) => s.id !== stopId) };
          }
          return t;
        })
      );
      showToast('Stop removed from itinerary', 'info');
    } catch (err) {
      console.error("Failed to delete stop:", err);
      showToast("Failed to remove stop", "error");
    }
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

  /**
   * Persist a TripActivity to backend database via POST /api/stops/:stopId/activities
   */
  const addActivityToStop = async (tripId, stopId, activityData) => {
    try {
      const targetTrip = trips.find((t) => t.id === tripId);
      const targetStop = targetTrip?.stops?.find((s) => s.id === stopId);
      const actsCount = targetStop?.activities?.length || 0;

      const payload = {
        activityId: activityData.activityId || null,
        name: activityData.name || activityData.nameSnapshot || 'Experience',
        category: activityData.category || activityData.categorySnapshot || 'Sightseeing',
        cost: Number(activityData.cost ?? activityData.costSnapshot ?? 0),
        timeSlot: activityData.timeSlot || '10:00',
        scheduledDate: activityData.scheduledDate || null,
        sortOrder: activityData.sortOrder ?? actsCount,
        notes: activityData.notes || activityData.description || null,
      };

      const res = await api.addTripActivity(stopId, payload);
      const rawAct = res.data?.tripActivity || res.tripActivity || res;

      const normalizedAct = {
        ...rawAct,
        id: rawAct.id,
        activityId: rawAct.activityId,
        name: rawAct.nameSnapshot || rawAct.name || activityData.name,
        category: rawAct.categorySnapshot || rawAct.category || activityData.category,
        cost: Number(rawAct.costSnapshot ?? rawAct.cost ?? activityData.cost ?? 0),
        timeSlot: rawAct.timeSlot || activityData.timeSlot || '10:00',
        scheduledDate: rawAct.scheduledDate || activityData.scheduledDate || null,
        day: activityData.day || (actsCount + 1),
        dayTitle: activityData.dayTitle || `Day ${activityData.day || actsCount + 1}: ${rawAct.nameSnapshot || rawAct.name || activityData.name}`,
        description: rawAct.notes || activityData.description || `${rawAct.categorySnapshot || activityData.category || 'Sightseeing'} experience`,
        imageUrl: rawAct.activity?.imageUrl || activityData.imageUrl || null,
        sortOrder: rawAct.sortOrder ?? actsCount,
      };

      setTrips((prev) =>
        prev.map((t) => {
          if (t.id === tripId) {
            const updatedStops = (t.stops || []).map((stop) => {
              if (stop.id === stopId) {
                const currentActs = stop.activities || [];
                return { ...stop, activities: [...currentActs, normalizedAct] };
              }
              return stop;
            });
            return { ...t, stops: updatedStops };
          }
          return t;
        })
      );

      showToast(`✨ Added "${normalizedAct.name}"`);
      return normalizedAct;
    } catch (err) {
      console.error("Failed to add activity to stop:", err);
      showToast("Failed to add experience", "error");
      return null;
    }
  };

  /**
   * Delete a TripActivity from backend database via DELETE /api/trip-activities/:activityId
   */
  const removeActivityFromStop = async (tripId, stopId, activityId) => {
    try {
      await api.deleteTripActivity(activityId);
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
      showToast('Activity removed', 'info');
    } catch (err) {
      console.error("Failed to delete trip activity:", err);
      showToast("Failed to remove experience", "error");
    }
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
        fetchTripDetails,
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
        loading,
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
