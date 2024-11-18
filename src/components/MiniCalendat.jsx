import React, { useState } from 'react';

const MiniCalendar = ({ selectedDate, onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(selectedDate?.getMonth() || new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(selectedDate?.getFullYear() || new Date().getFullYear());

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

  const startDay = firstDayOfMonth.getDay();

  const totalDays = lastDayOfMonth.getDate();

  const daysArray = [];
  for (let i = 1; i <= totalDays; i++) {
    daysArray.push(i);
  }

  const blankDays = Array(startDay).fill(null);

  const handleMonthChange = (direction) => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else if (direction === 'next') {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const handleDateSelect = (date) => {
    onDateSelect(new Date(currentYear, currentMonth, date));
  };

  return (
    <div className="mini-calendar">
      <div className="calendar-header">
        <span>{`${firstDayOfMonth.toLocaleString('default', { month: 'long' })} ${currentYear}`}</span>
        <div>
        <button onClick={() => handleMonthChange('prev')}>&lt;</button>
        <button onClick={() => handleMonthChange('next')}>&gt;</button>
        </div>
      </div>

      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div className="calendar-day-name" key={day}>{day}</div>
        ))}

        {blankDays.map((_, idx) => (
          <div key={idx} className="calendar-day empty"></div>
        ))}
        
        {daysArray.map((day) => (
          <div 
            key={day}
            className={`calendar-day ${selectedDate?.getDate() === day && selectedDate.getMonth() === currentMonth && selectedDate.getFullYear() === currentYear ? 'selected' : ''}`}
            onClick={() => handleDateSelect(day)} >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MiniCalendar;
