import React from 'react'
import { Link } from 'react-router-dom';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DateRangeIcon from '@mui/icons-material/DateRange';
import EventIcon from '@mui/icons-material/Event';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useAuth } from '../context/AuthContext';

const EventList = () => {
    const { logout } = useAuth();
    return (
    <div className='events'>
        <p className='event-heading'><DateRangeIcon /> Calendar</p>
        <div className='events-list'>
            <Link to='/' className='list'><CalendarTodayIcon /> Month</Link>
            <Link to='/events' className='list'><EventIcon/> Events</Link>
            <div className='list' onClick={logout}><ExitToAppIcon/>Logout</div>
        </div>
    </div>
  )
}

export default EventList