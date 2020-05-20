import React from "react";
import EventItem from "./EventItem/eventItem";
import "./eventList.css";

const EventList = (props) => {
  return (
    <ul className="events__list">
      {props.events.map((event) => (
        <EventItem
          key={event._id}
          event={event}
          userId={props.userId}
          onViewDetails={props.onViewDetails}
        />
      ))}
    </ul>
  );
};

export default EventList;
