import React from "react";
import "./BookingList.css";
import BookItem from "./BookItem/BookItem";

const BookingList = (props) => {
  const BookingList = props.events.map((booking) => {
    return (
      <BookItem
        key={booking._id}
        bookingId={booking._id}
        title={booking.event.title}
        eventDate={booking.event.date}
        price={booking.event.price}
        onDelete={props.onViewDelete}
      />
    );
  });
  return <ul className="events-list">{BookingList}</ul>;
};

export default BookingList;
