import React from 'react'
import EventList from '../components/EventList'
import Calendar from '../components/Calendar'

const Dashboard = () => {
  return (
    <div className='dashboard'>
        <EventList/>
        <Calendar/>
    </div>
  )
}

export default Dashboard