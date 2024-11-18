import React from 'react';
import EventList from '../components/EventList';
import AllEvents from '../components/AllEvents';

const Events = () => {
  return (
    <div className='dashboard'>
        <EventList/>
        <AllEvents/>
    </div>
  )
}

export default Events