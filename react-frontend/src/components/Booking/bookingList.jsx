import React from "react";
import "./bookingList.css";

const BookingList = (props) => {
  return (
    <ul className="bookings__list">
      {props.bookings.map((booking) => (
        <li key={booking._id} className="bookings__item">
          <div className="bookings__item-data">
            {booking.event.title} -{" "}
            {new Date(booking.createdAt).toLocaleDateString()}
          </div>
          <div className="bookings__item-actions">
            <button
              className="btn"
              onClick={() => props.onCancelBooking(booking._id)}
            >
              Cancel Booking
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default BookingList;
