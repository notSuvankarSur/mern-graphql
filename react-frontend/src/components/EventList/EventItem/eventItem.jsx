import React from "react";
import "./eventItem.css";

const EventItem = ({ event, userId, onViewDetails }) => {
  return (
    <li key={event._id} className="events__list-item">
      <div>
        <h1>{event.title}</h1>
        <h3>
          ${event.price} - {new Date(event.date).toLocaleDateString()}
        </h3>
      </div>
      <div>
        {userId === event.createdBy._id ? (
          <p>You're the owner of this event</p>
        ) : (
          <button className="btn" onClick={() => onViewDetails(event._id)}>
            View Details
          </button>
        )}
      </div>
    </li>
  );
};

export default EventItem;
