import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import AddEvents from './AddEvents';

const AllEvents = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [totalEvents, setTotalEvents] = useState(0);
  const [showAddEvent, setAddEvent] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [priority, setPriority] = useState('');  // state for storing priority filter

  const totalPages = Math.ceil(totalEvents / 10);

  useEffect(() => {
    fetchAllEvents();
  }, [currentPage, priority]);  // Add priority as a dependency

  const fetchAllEvents = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}events`, {
        params: {
          page: currentPage,
          limit: 10,
          priority: priority, // Send priority filter as query parameter
        },
        headers: {
          'Authorization': `Bearer ${user}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.data.status) {
        setEvents(response.data.events);
        setTotalEvents(response.data.totalEvents);
      }
    } catch (err) {
      console.error("Error fetching events", err);
    }
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleAddEvent = () => {
    setAddEvent(!showAddEvent);
  };

  const handlePriorityChange = (e) => {
    setPriority(e.target.value);  // Update the priority state when the user selects a priority
  };

  const formatDateAndTime = (dateString) => {
    const eventDate = new Date(dateString);
    const datePart = eventDate.toLocaleDateString('en-GB');
    return `${datePart}`;
  };

  return (
    <div className="calendar">
      <div className="header">
        <div className="all-event-heading">All Events</div>
        <div className='filter-priority'>
          <p>Filter:</p>
        <select value={priority} onChange={handlePriorityChange}>
          <option value="">Select Priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        </div>
      </div>

      <div className="all-events">
        {events &&
          events.map((evnt, index) => (
            <div key={index} className={`evnt ${evnt.priority}`}>
              <p className="evnt-name">{evnt.summary}</p>
              {evnt.place && <p className="evnt-time">{evnt.location}</p>}
              <p className="evnt-time">{formatDateAndTime(evnt.date)}</p>
            </div>
          ))}
      </div>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            className={page === currentPage ? 'active' : ''}
            key={`page-${page}`}
            onClick={() => {
              if (page !== currentPage) {
                handlePageChange(page);
              }
            }}
          >
            {page}
          </button>
        ))}
      </div>

      {showAddEvent && <AddEvents handleAddEvent={handleAddEvent} user={user} />}
    </div>
  );
};

export default AllEvents;
