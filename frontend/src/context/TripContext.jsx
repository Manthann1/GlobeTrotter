import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';
import { INITIAL_TRIPS, CITIES_DATA } from '../data/mockData';
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

  const normalizeTrip = (trip) => {
    if (!trip) return null;

    let rawStops = (trip.stops && trip.stops.length > 0) ? trip.stops : [
      {
        id: `stop-default-${trip.id}`,
        cityName: trip.name?.includes('Jaipur') ? 'Jaipur' : trip.name?.includes('Goa') ? 'Goa' : trip.name?.includes('Kerala') ? 'Alleppey' : trip.name?.includes('Paris') ? 'Paris' : trip.name?.includes('Dubai') ? 'Dubai' : 'Jaipur',
        arrivalDate: trip.startDate,
        departureDate: trip.endDate,
        tripActivities: [
          {
            id: `ta-def-1`,
            nameSnapshot: `Palace & Heritage Stay in ${trip.name || 'Destination'}`,
            categorySnapshot: 'Lodging',
            costSnapshot: 14500,
            timeSlot: '14:00',
            description: `Luxury heritage resort stay with private views and premium amenities.`,
            imageUrl: trip.coverPhoto || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
            sortOrder: 0,
          },
          {
            id: `ta-def-2`,
            nameSnapshot: `Authentic Regional Thali & Dining`,
            categorySnapshot: 'Food & Dining',
            costSnapshot: 1850,
            timeSlot: '19:30',
            description: `Traditional multi-course dinner tasting local authentic recipes and sweets.`,
            imageUrl: 'https://images.unsplash.com/photo-1613292443284-8d10ef9383fe?auto=format&fit=crop&w=800&q=80',
            sortOrder: 1,
          },
          {
            id: `ta-def-3`,
            nameSnapshot: `Guided Fort & Monument Tour`,
            categorySnapshot: 'Sightseeing',
            costSnapshot: 1200,
            timeSlot: '09:30',
            description: `Guided excursion to famous historic forts, palaces, and scenic viewpoints.`,
            imageUrl: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80',
            sortOrder: 2,
          }
        ]
      }
    ];

    const stops = rawStops.map((stop, stopIdx) => {
      let rawActs = (stop.activities && stop.activities.length > 0)
        ? stop.activities
        : (stop.tripActivities && stop.tripActivities.length > 0)
        ? stop.tripActivities
        : [
            {
              id: `ta-fallback-${stopIdx}-1`,
              nameSnapshot: `Heritage Hotel Stay`,
              categorySnapshot: 'Lodging',
              costSnapshot: 12500,
              timeSlot: '14:00',
              description: `Check into luxury stay in ${stop.cityName || stop.city?.name || 'the city'}.`,
              imageUrl: stop.city?.imageUrl || trip.coverPhoto || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
              sortOrder: 0,
            },
            {
              id: `ta-fallback-${stopIdx}-2`,
              nameSnapshot: `Traditional Local Banquet`,
              categorySnapshot: 'Food & Dining',
              costSnapshot: 1650,
              timeSlot: '19:30',
              description: `Authentic dining experience featuring regional specialties.`,
              imageUrl: 'https://images.unsplash.com/photo-1613292443284-8d10ef9383fe?auto=format&fit=crop&w=800&q=80',
              sortOrder: 1,
            },
            {
              id: `ta-fallback-${stopIdx}-3`,
              nameSnapshot: `City Highlights & Market Walk`,
              categorySnapshot: 'Sightseeing',
              costSnapshot: 950,
              timeSlot: '10:00',
              description: `Guided tour of top city landmarks, bazaars, and photography points.`,
              imageUrl: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80',
              sortOrder: 2,
            }
          ];

      const activities = rawActs.map((act, idx) => {
        const actName = act.name || act.nameSnapshot || act.activity?.name || 'Local Experience';
        const actCategory = act.category || act.categorySnapshot || act.activity?.category || 'Sightseeing';
        const actCost = Number(act.cost ?? act.customCost ?? act.costSnapshot ?? act.activity?.cost ?? 1500);
        const actDesc = act.description || act.customNotes || act.activity?.description || `Explore top heritage spots and local culture in ${stop.cityName || stop.city?.name || 'the city'}.`;
        const actImg = act.imageUrl || act.activity?.imageUrl || stop.city?.imageUrl || trip.coverPhoto || 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80';
        const actDay = act.day || act.dayNumber || (idx < 2 ? 1 : 2);
        const actTime = act.timeSlot || (idx % 2 === 0 ? '10:00 AM' : '04:00 PM');
        const actDayTitle = act.dayTitle || `Day ${actDay}: ${actName}`;

        return {
          id: act.id || `ta-${stopIdx}-${idx}`,
          day: actDay,
          dayTitle: actDayTitle,
          name: actName,
          category: actCategory,
          cost: actCost,
          timeSlot: actTime,
          description: actDesc,
          imageUrl: actImg,
          sortOrder: act.sortOrder ?? idx,
        };
      });

      return {
        ...stop,
        cityName: stop.cityName || stop.city?.name || 'Destination',
        state: stop.state || stop.city?.state || '',
        country: stop.country || stop.city?.country || 'India',
        activities,
      };
    });

    return {
      ...trip,
      stops,
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const citiesData = await api.getCities();
        setCities(Array.isArray(citiesData) && citiesData.length > 0 ? citiesData : CITIES_DATA);
        
        let loadedTrips = [];
        try {
          loadedTrips = await api.getTrips();
        } catch {
          loadedTrips = await api.getPublicTrips();
        }

        if (!Array.isArray(loadedTrips) || loadedTrips.length === 0) {
          loadedTrips = await api.getPublicTrips();
        }

        let normalized = (Array.isArray(loadedTrips) ? loadedTrips : []).map(normalizeTrip);
        if (normalized.length === 0) {
          normalized = INITIAL_TRIPS.map(normalizeTrip);
        }
        setTrips(normalized);
      } catch (err) {
        console.error("Failed to load initial data:", err);
        setTrips(INITIAL_TRIPS.map(normalizeTrip));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    localStorage.setItem('globetrotter_currency', currency);
  }, [currency]);

  const formatPrice = (amount) => {
    const num = Number(amount || 0);
    return `Rs. ${num.toLocaleString('en-IN')}`;
  };

  const toggleCurrency = () => {
    setCurrency('INR');
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
    const raw = trips.find((t) => t.id === id || t.shareToken === id);
    return normalizeTrip(raw);
  };

  const createTrip = async (tripData) => {
    if (!isAuthenticated) {
      showToast("Please login to create a trip", "error");
      return null;
    }

    try {
      const rawNewTrip = await api.createTrip(tripData);
      
      // Auto-populate initial stop & activities if stops are empty
      let newTrip = normalizeTrip(rawNewTrip);
      
      if (!newTrip.stops || newTrip.stops.length === 0) {
        const targetCity = tripData.initialCity || cities.find(c => tripData.destination?.toLowerCase().includes(c.name.toLowerCase())) || cities[0];
        
        if (targetCity) {
          const defaultActivities = (targetCity.activities && targetCity.activities.length > 0)
            ? targetCity.activities.map((a, idx) => ({
                id: `act-${Date.now()}-${idx}`,
                day: idx < 2 ? 1 : 2,
                dayTitle: idx < 2 ? `Day 1: Arrival in ${targetCity.name}` : `Day 2: ${targetCity.name} Exploration`,
                name: a.name,
                category: a.category || 'Sightseeing',
                cost: Number(a.cost || 1500),
                timeSlot: idx % 2 === 0 ? '10:00' : '16:00',
                description: a.description || `Experience in ${targetCity.name}`,
                imageUrl: a.imageUrl || targetCity.imageUrl,
              }))
            : [
                {
                  id: `act-${Date.now()}-1`,
                  day: 1,
                  dayTitle: `Day 1: Arrival & Heritage Check-in`,
                  name: `Palace & Heritage Stay in ${targetCity.name}`,
                  category: 'Lodging',
                  cost: 12500,
                  timeSlot: '14:00',
                  description: `Check into luxury stay in ${targetCity.name} with traditional greeting.`,
                  imageUrl: targetCity.imageUrl,
                },
                {
                  id: `act-${Date.now()}-2`,
                  day: 1,
                  dayTitle: `Day 1: Arrival & Heritage Check-in`,
                  name: `Authentic Local Thali & Dining`,
                  category: 'Food & Dining',
                  cost: 1600,
                  timeSlot: '19:30',
                  description: `Multi-course traditional meal showcasing regional flavors.`,
                  imageUrl: targetCity.imageUrl,
                },
                {
                  id: `act-${Date.now()}-3`,
                  day: 2,
                  dayTitle: `Day 2: Guided Monument Tour`,
                  name: `Guided Historical Monument Tour`,
                  category: 'Culture & History',
                  cost: 950,
                  timeSlot: '09:30',
                  description: `Explore ancient landmarks and architecture with an expert guide.`,
                  imageUrl: targetCity.imageUrl,
                }
              ];

          newTrip.stops = [
            {
              id: `stop-${Date.now()}`,
              cityId: targetCity.id,
              cityName: targetCity.name,
              state: targetCity.state || '',
              country: targetCity.country || 'India',
              arrivalDate: newTrip.startDate || new Date().toISOString().slice(0, 10),
              departureDate: newTrip.endDate || new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10),
              sortOrder: 0,
              activities: defaultActivities,
            }
          ];
        }
      }
      
      setTrips((prev) => [newTrip, ...prev]);
      showToast(`🎉 "${newTrip.name}" created with curated itinerary!`);
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
