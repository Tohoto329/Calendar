import React, { useEffect,useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import AddEvents from './AddEvents';

const AllEvents = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState(false);
  const [totalEvents, setTotalEvents] = useState(false);
  const [showAddEvent, setAddEvent] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(totalEvents/10);


  useEffect(() => {
    fetchAllEvents();
  },[currentPage]);

  const fetchAllEvents = async() =>{
    try{
      const response = await axios.get('http://localhost:5001/events',
        {
          params:{
            page:currentPage,
            limit:10,
          },
          headers:{
            'Authorization': `Bearer ${user}`,
            'Content-Type': 'application/json'
          }
        }
      );
      if(response.data.status){
        setEvents(response.data.events);
        setTotalEvents(response.data.totalEvents);  
      }
    }catch(err){

    }
  }

  const handlePageChange = async(page) =>{
    if(page > 0 && page <= Math.ceil(totalEvents/10)){
      setCurrentPage(page);
    }
  }

  const handleAddEvent = () => {
      setAddEvent(!showAddEvent);
  };

  const formatDateAndTime = (dateString) => {
    const eventDate = new Date(dateString);

    const datePart = eventDate.toLocaleDateString('en-GB');

    return `${datePart}`;
};



  return (
    <div className='calendar'>
      <div className='header'>
          <div className='all-event-heading'>All Events</div>
      </div>

      <div className='all-events'>
        {events && (
          events.map((evnt,index) => (
            <div key={index} className={`evnt ${evnt.priority}`}>
            <p className='evnt-name'>{evnt.summary}</p>
            {evnt.place && (
              <p className='evnt-time'>{evnt.location}</p>
            )}
            <p className='evnt-time'>{formatDateAndTime(evnt.date)}</p>
            </div>
          )
        ))}
      </div>
      <div className='pagination'>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button className={page === currentPage ? 'active' : ''} key={`page-${page}`} onClick={() => { if (page !== currentPage) {handlePageChange(page);} }}>
            {page} </button>
        ))}
      </div>
      {showAddEvent && <AddEvents handleAddEvent={handleAddEvent} user={user} />}
    </div>
      )
}

export default AllEvents