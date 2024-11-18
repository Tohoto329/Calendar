import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AddEvents = ({ handleAddEvent, user, day = '', events }) => {
    const [eventDate, setEventDate] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [eventName, setEventName] = useState('');
    const [eventPlace, setEventPlace] = useState('');
    const [priority, setEventPriority] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState('');

    const priorities = ['Select', 'High', 'Medium', 'Low'];

    useEffect(() => {
        if (day) {
            const formattedDate = new Date(day);
            setEventDate(formattedDate);
            setStartTime(formattedDate);
        }
    }, [day]);

    const checkEventOverlap = () => {
        for (let event of events) {
            const eventStart = new Date(event.start);
            const eventEnd = new Date(event.end);

            if (
                (startTime >= eventStart && startTime < eventEnd) || 
                (endTime > eventStart && endTime <= eventEnd) ||
                (startTime <= eventStart && endTime >= eventEnd)
            ) {
                return true; // There is an overlap
            }
        }
        return false; // No overlap
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        const errors = {};
    
        if (!eventDate) {
            errors.eventDate = "Date is required";
        }
        if (!startTime) {
            errors.startTime = "Start time is required";
        }
        if (!endTime) {
            errors.endTime = "End time is required";
        }
        if (!eventName.trim()) {
            errors.eventName = "Event Name is required";
        }
        if (priority === 'Select') {
            errors.priority = "Priority is required";
        }
    
        if (startTime && endTime) {
            if (new Date(endTime) <= new Date(startTime)) {
                errors.endTime = "End time must be later than start time.";
            }
    
            const start = new Date(startTime);
            const end = new Date(endTime);
            const timeDifference = (end - start) / 1000 / 60 / 60; 
    
            if (timeDifference > 1) {
                errors.endTime = "The event duration cannot be more than 1 hour.";
            }
        }

        if (checkEventOverlap()) {
            errors.eventTime = "Event is already scheduled in this slot.";
        }
    
        setErrors(errors);
    
        if (Object.keys(errors).length === 0) {
            try {
                const response = await axios.post(
                    'http://localhost:5001/add-event',
                    {
                        eventDate: eventDate.toISOString(),
                        startTime: new Date(startTime).toISOString(),
                        endTime: new Date(endTime).toISOString(),
                        eventName: eventName,
                        eventPlace: eventPlace ?? '',
                        priority: priority
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${user}`,
                            'Content-Type': 'application/json'
                        },
                    }
                );
                if (response.data.status) {
                    toast.success(response.data.message);
                    handleAddEvent(); // Close or reset form
                } else {
                    toast.error(response.data.message);
                }
            } catch (err) {
                console.error(err);
                toast.error("An error occurred while adding the event.");
            }
        }
    
        setLoading(false);
    };

    const handlePriorityChange = (event) => {
        setEventPriority(event.target.value);
    };

    const handleTimeChange = (time, isStartTime) => {
        if (!eventDate) return; 
        
        const updatedTime = new Date(eventDate); 
        updatedTime.setHours(time.getHours(), time.getMinutes(), 0, 0); 
        
        if (isStartTime) {
            setStartTime(updatedTime);
        } else {
            setEndTime(updatedTime);
        }
    };

    return (
        <div className='add-event-modal'>
            <div className='event-modal'>
                <div className='event-header'>
                    <div className='login-header'>Add Event</div>
                    <button onClick={handleAddEvent}>x</button>
                </div>
                <form className='event-form' onSubmit={handleSubmit}>
                    <div>
                        <DatePicker
                            selected={eventDate}
                            onChange={(date) => setEventDate(date)}
                            dateFormat="yyyy-MM-dd"
                            placeholderText="Select Date"
                            className="date-picker-input"
                        />
                        {errors.eventDate && <span className='errors'>{errors.eventDate}</span>}
                    </div>

                    <div>
                        <DatePicker
                            selected={startTime}
                            onChange={(time) => handleTimeChange(time, true)}
                            showTimeSelect
                            showTimeSelectOnly
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            dateFormat="HH:mm"
                            placeholderText="Select Start Time"
                            className="time-picker-input"
                        />
                        {errors.startTime && <span className='errors'>{errors.startTime}</span>}
                    </div>

                    <div>
                        <DatePicker
                            selected={endTime}
                            onChange={(time) => handleTimeChange(time, false)}
                            showTimeSelect
                            showTimeSelectOnly
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            dateFormat="HH:mm"
                            placeholderText="Select End Time"
                            className="time-picker-input"
                        />
                        {errors.endTime && <span className='errors'>{errors.endTime}</span>}
                    </div>

                    <input
                        type="text"
                        value={eventName}
                        onChange={(e) => setEventName(e.target.value)}
                        placeholder="Event Name"
                    />
                    {errors.eventName && <span className='errors'>{errors.eventName}</span>}

                    <div>
                        <input
                            type="text"
                            value={eventPlace}
                            onChange={(e) => setEventPlace(e.target.value)}
                            placeholder="Place"
                        />
                    </div>

                    <div>
                        <select id='priority' value={priority} onChange={handlePriorityChange}>
                            {priorities.map((priority, index) => (
                                <option key={index} value={priority}>{priority}</option>
                            ))}
                        </select>
                        {errors.priority && <span className='errors'>{errors.priority}</span>}
                    </div>

                    {errors.eventTime && <span className='errors'>{errors.eventTime}</span>}

                    <button className='submit-event' type="submit" disabled={loading}>
                        {loading ? 'Please wait ...' : 'Add Event'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddEvents;
