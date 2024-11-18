import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import AddEvents from './AddEvents';
import MiniCalendar from './MiniCalendat';
import _ from 'lodash';

const Calendar = () => {
    const { user,handleGoogleSync,googlesync } = useAuth();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState(currentDate);
    const [showAddEvent, setAddEvent] = useState(false);
    const [events, setEvents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        fetchEvents();
        if (googlesync) {
            fetchGoogleEvents();
        }  
    }, [user,googlesync]);


    const fetchEvents = async () => {
        try {
            const response = await axios.get('http://localhost:5001/get-events', {
                headers: {
                    'Authorization': `Bearer ${user}`,
                    'Content-Type': 'application/json'
                }
            });
            setEvents(response.data.events);
        } catch (err) {
            console.error("Error fetching events:", err);
        }
    };

    const fetchGoogleEvents = async () => {
        try {
            const response = await axios.get('http://localhost:5001/get-google-events', 
            {
                headers: {
                    'Authorization': `Bearer ${user}`,
                    'Content-Type': 'application/json'
                }
            });
            const newEvents = response.data.events.map(event => {
                const start = event.start.dateTime ? new Date(event.start.dateTime) : new Date(event.start.date);
                const date = start;
                const end = event.end.dateTime ? new Date(event.end.dateTime) : new Date(event.end.date);
                const summary = event.summary || '';
                const location = event.location || '';

                return {
                    id: event.id,
                    date,
                    start,
                    end,
                    summary,
                    location,
                    priority:'google'
                };
            });

            setEvents(prevEvents => {
                const existingEventIds = prevEvents.map(event => event._id?.toString() || event.id);
                const filteredNewEvents = newEvents.filter(event => {
                    const eventId = event._id?.toString() || event.id;
                    return !existingEventIds.includes(eventId);
                });            
                return [...prevEvents, ...filteredNewEvents];
            });
            
            
        } catch (err) {
            console.error("Error fetching events:", err);
        }
    };

    const handleSyncClick = async () => {
        await handleGoogleSync(!googlesync);
        try {
            const response = await axios.get('http://localhost:5001/google-auth', {
                params:{
                    googlesync:!googlesync
                },
                headers: {
                    'Authorization': `Bearer ${user}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.data.authUrl) {
                window.location.href = response.data.authUrl; 
            }else{
                location.reload();
            }
        } catch (err) {
            console.error("Error initiating OAuth:", err);
        }
    };

    const getWeekDays = (date) => {
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay());
        const weekDays = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            weekDays.push(day);
        }
        return weekDays;
    };

    const currentWeek = getWeekDays(currentDate);

    const renderDaysOfWeek = () => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return (
            <div className='days-of-week'>
                <div className='hour-column'>Hours</div>
                {days.map((day, index) => (
                    <div key={index} className='day-of-week'>
                        {day}
                        <div className='date'>{currentWeek[index].getDate()}</div>
                    </div>
                ))}
            </div>
        );
    };

    const renderEventsForDay = (day) => {
        const startOfDay = new Date(day);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(day);
        endOfDay.setHours(23, 59, 59, 999);
    
        const dayEvents = events.filter(event => {
            const eventStartTime = new Date(event.date);
            const eventDateOnly = new Date(eventStartTime).setHours(0, 0, 0, 0);
            const selectedDayOnly = new Date(day).setHours(0, 0, 0, 0);
    
            return eventDateOnly === selectedDayOnly;
        });
    
        const eventsByHour = Array.from({ length: 24 }, (_, i) => {
            return dayEvents.filter(event => {
                const eventStartTime = new Date(event.start);
                return eventStartTime.getHours() === i;
            });
        });
    
        return (
            <div className='hourly-events'>
                {eventsByHour.map((eventsInHour, hour) => (
                    <div key={hour} className={`hour-block ${eventsInHour.length > 0 ? 'has-events' : ''}`}>
                        {eventsInHour.length > 0 && (
                            <div className='event-list'>
                                {eventsInHour.map((event, index) => {
                                    const eventStartTime = new Date(event.start);
                                    const eventEndTime = new Date(event.end);
                                    return (
                                        <div key={index} className={`event ${event.priority}`}>
                                            <p className='event-name'>{event.summary}</p>
                                            {event.location && <p className='event-name'>{event.location}</p>}
                                            <p className='event-time'>
                                                {eventStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })} - 
                                                {eventEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    };
    

    const renderHourLabels = () => {
        const hours = Array.from({ length: 24 }, (_, i) => i);
        return (
            <div className='hour-labels'>
                {hours.map(hour => (
                    <div key={hour} className='hour-label'>
                        {/* Format hour to 12-hour format */}
                        {new Date(2020, 1, 1, hour).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                    </div>
                ))}
            </div>
        );
    };

    const handleDateSelect = (selectedDate) => {
        const startOfWeek = new Date(selectedDate);
        startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
        setCurrentDate(startOfWeek);
        setSelectedDay(selectedDate);
    };

    const handleAddEvent = () => {
        setAddEvent(!showAddEvent);
    };

    const debouncedSearch = useCallback(
        _.debounce((query) => {
          if (query) {
            fetch(`http://localhost:5001/search?query=${query}`)
              .then(response => response.json())
              .then(data => {
                setSuggestions(data.userData ? [data.userData] : []); 
            })
              .catch(error => {
                console.error('Error fetching data:', error);
                setSuggestions([]);
              });
          } else {
            setSuggestions([]);
          }
        }, 300),
        []
    );

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        debouncedSearch(value);
    };

    const handleSuggestionClick = (events) => {
        
        setEvents(prevEvents => {
            const existingEventIds = new Set(prevEvents.map(event => event._id));
            const newEvents = events.filter(event => !existingEventIds.has(event._id));        
            return [...prevEvents, ...newEvents];
        });
        setSuggestions([]);
        setSearchQuery('');
        
    };
    


    return (
        <div className='weekly'>
            <div className='header'>
                <div className='search-section'>
                <input className='search' placeholder="search by Email" value={searchQuery} onChange={handleInputChange} />
                    {suggestions.length > 0 ? (
                        <div className="suggestions">
                        {suggestions.map((user, index) => (
                            <div className='suggestion-list' key={index} onClick={() => handleSuggestionClick(user.events)} >
                            {user.email}
                            </div>
                        ))}
                        </div>
                    ) : (
                        searchQuery && (
                        <div className="suggestions">
                            No User Found
                        </div>
                        )
                    )}
                </div>
                <div className='cta'>
                    <div className='add-event'>
                        <button onClick={handleSyncClick} style={{ padding: '10px', backgroundColor: googlesync ? 'green' : 'red', color: 'white', borderRadius: '5px' }}>
                            {googlesync ? 'Unsync' : 'Sync'}
                        </button>
                        <button onClick={handleAddEvent}>Add Event</button>
                    </div>
                </div>
            </div>
            <div className="calendar-container">
                <div className="mini-calendar-container">
                    <MiniCalendar 
                        selectedDate={selectedDay} 
                        onDateSelect={handleDateSelect}
                    />
                </div>
                <div className='calendar-main'>
                    {renderDaysOfWeek()}
                    <div className='week-view'>
                        <div className='hour-column'>
                            {renderHourLabels()}
                        </div>

                        {currentWeek.map((day, index) => (
                            <div 
                                key={index} 
                                className={`day ${selectedDay && selectedDay.toDateString() === day.toDateString() ? 'selected' : ''}`}
                                onClick={() => {
                                    setSelectedDay(day);
                                    setAddEvent(true);
                                }}
                            >
                                {renderEventsForDay(day)}
                            </div>
                        ))}
                    </div>
                    {showAddEvent && <AddEvents handleAddEvent={() => setAddEvent(false)} user={user} day={selectedDay} events={events}/>}
                </div>
            </div>
        </div>
    );
};

export default Calendar;
